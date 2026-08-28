import json
import sqlite3
import tempfile
import unittest
import urllib.error
from pathlib import Path

from anps_bsfv_outbox import (
    IntegrationConfig,
    capture_state_changes,
    dispatch_once,
    initialize_outbox,
    payload_digest,
    safe_metrics,
    sign_headers,
)


def config(enabled=False):
    return IntegrationConfig(
        enabled=enabled,
        endpoint="https://bsfv.synthetic.invalid/api/v1/integrations/anps/events",
        approved_endpoints=("https://bsfv.synthetic.invalid/api/v1/integrations/anps/events",),
        key_id="synthetic-key",
        secret="synthetic-secret-not-production",
        school_id="school-synthetic",
        session_map={"2026-27": "session-synthetic"},
    )


def payment(amount="100.00", discount="5.00"):
    return {
        "id": "pay-synthetic-1",
        "receipt": "SYN/1",
        "date": "2026-08-28",
        "amount": amount,
        "cashAmount": amount,
        "bankAmount": "0",
        "discountAmount": discount,
        "allocations": [{"id": "line-1", "head": "Synthetic Tuition", "month": "AUG", "amount": str(float(amount) + float(discount))}],
    }


def fee_state(item=None):
    return {"collectedPayments": {"2026-27": {"ADM-SYN-1": [item or payment()]}}}


def staff_state(status="Active", designation="Teacher"):
    return {"staffMembers": [{"staffId": "STF-SYN-1", "name": "Synthetic Person", "status": status, "designation": designation, "department": "Synthetic"}]}


class Response:
    def __init__(self, code):
        self.code = code

    def getcode(self):
        return self.code


class OutboxTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / "outbox.db"
        self.conn = sqlite3.connect(self.path)
        self.conn.row_factory = sqlite3.Row
        initialize_outbox(self.conn)

    def tearDown(self):
        self.conn.close()
        self.temp.cleanup()

    def rows(self):
        return self.conn.execute("SELECT * FROM bsfv_outbox_events ORDER BY source_version").fetchall()

    def test_fee_lifecycle_is_ordered_immutable_and_exact_once(self):
        capture_state_changes(self.conn, {}, fee_state(), config())
        capture_state_changes(self.conn, {}, fee_state(), config())
        corrected = payment("120.00", "5.00")
        capture_state_changes(self.conn, fee_state(), fee_state(corrected), config())
        capture_state_changes(self.conn, fee_state(corrected), {}, config())
        rows = self.rows()
        self.assertEqual([row["event_type"] for row in rows], [
            "anps.fee_collection.created", "anps.fee_collection.corrected", "anps.fee_collection.voided"
        ])
        self.assertEqual([row["source_version"] for row in rows], [1, 2, 3])
        with self.assertRaises(sqlite3.DatabaseError):
            self.conn.execute("UPDATE bsfv_outbox_events SET event_type='changed'")
        with self.assertRaises(sqlite3.DatabaseError):
            self.conn.execute("DELETE FROM bsfv_outbox_events")

    def test_staff_lifecycle_and_payload_minimization(self):
        capture_state_changes(self.conn, {}, staff_state(), config())
        capture_state_changes(self.conn, staff_state(), staff_state(designation="Principal"), config())
        capture_state_changes(self.conn, staff_state(designation="Principal"), staff_state(status="Disabled", designation="Principal"), config())
        rows = self.rows()
        self.assertEqual([row["event_type"] for row in rows], [
            "anps.staff.created", "anps.staff.updated", "anps.staff.deactivated"
        ])
        payload = " ".join(row["payload"].lower() for row in rows)
        for forbidden in ("salary", "password", "biometric", "attendance", "bankaccount", "phone", "email"):
            self.assertNotIn(forbidden, payload)

    def test_missing_mapping_is_blocked_and_detectable(self):
        missing = IntegrationConfig(False, "", (), "", "", "", {})
        capture_state_changes(self.conn, {}, fee_state(), missing)
        delivery = self.conn.execute("SELECT * FROM bsfv_outbox_delivery").fetchone()
        self.assertEqual(delivery["delivery_status"], "BLOCKED")
        self.assertIn(delivery["failure_code"], {"school_mapping_missing", "session_mapping_missing"})

    def test_missing_durable_id_is_not_invented_and_is_detectable(self):
        no_payment_id = payment()
        no_payment_id.pop("id")
        no_staff_id = {"staffMembers": [{"name": "Synthetic Person", "status": "Active"}]}
        capture_state_changes(self.conn, {}, fee_state(no_payment_id), config())
        capture_state_changes(self.conn, {}, no_staff_id, config())
        self.assertEqual(self.conn.execute("SELECT COUNT(*) FROM bsfv_outbox_events").fetchone()[0], 0)
        metrics = safe_metrics(self.conn)
        self.assertEqual(metrics["blocked_missing_payment_identity"], 1)
        self.assertEqual(metrics["blocked_missing_staff_identity"], 1)

    def test_signing_matches_frozen_input_and_digest(self):
        capture_state_changes(self.conn, {}, fee_state(), config())
        document = json.loads(self.rows()[0]["payload"])
        headers = sign_headers(document, config(), "2026-08-28T12:00:00Z")
        self.assertEqual(headers["X-ANPS-Event-ID"], document["event_id"])
        self.assertEqual(headers["X-ANPS-Payload-SHA256"], payload_digest(self.rows()[0]["payload"].encode()))
        self.assertTrue(headers["X-ANPS-Signature"].startswith("v1="))

    def test_dispatcher_refuses_by_default_and_offline_does_not_lose_work(self):
        capture_state_changes(self.conn, {}, fee_state(), config())
        result = dispatch_once(self.conn, config(False))
        self.assertEqual(result, {"attempted": 0, "refused": "integration_disabled"})
        self.assertEqual(self.conn.execute("SELECT delivery_status FROM bsfv_outbox_delivery").fetchone()[0], "PENDING")
        self.conn.commit()
        self.conn.close()
        self.conn = sqlite3.connect(self.path)
        self.conn.row_factory = sqlite3.Row
        self.assertEqual(self.conn.execute("SELECT COUNT(*) FROM bsfv_outbox_events").fetchone()[0], 1)

    def test_delivery_success_retry_and_dead_letter(self):
        capture_state_changes(self.conn, {}, fee_state(), config())
        self.assertEqual(dispatch_once(self.conn, config(True), lambda request, timeout: Response(202))["status"], "DELIVERED")

        self.conn.execute("UPDATE bsfv_outbox_delivery SET delivery_status='PENDING',attempt_count=0,next_attempt_at=NULL,delivered_at=NULL")
        self.assertEqual(dispatch_once(self.conn, config(True), lambda request, timeout: (_ for _ in ()).throw(urllib.error.HTTPError(request.full_url, 500, "synthetic", {}, None)))["status"], "PENDING")

        self.conn.execute("UPDATE bsfv_outbox_delivery SET delivery_status='PENDING',attempt_count=0,next_attempt_at=NULL")
        self.assertEqual(dispatch_once(self.conn, config(True), lambda request, timeout: (_ for _ in ()).throw(urllib.error.HTTPError(request.full_url, 400, "synthetic", {}, None)))["status"], "DEAD_LETTER")
        metrics = safe_metrics(self.conn)
        self.assertEqual(metrics["created"], 1)
        self.assertEqual(metrics["dead_letter"], 1)

    def test_synthetic_response_matrix_timeout_and_retry_exhaustion(self):
        capture_state_changes(self.conn, {}, fee_state(), config())

        def reset(attempts=0):
            self.conn.execute(
                "UPDATE bsfv_outbox_delivery SET delivery_status='PENDING',attempt_count=?,next_attempt_at=NULL,delivered_at=NULL,dead_letter_at=NULL",
                (attempts,),
            )

        for code in (200, 202):
            reset()
            self.assertEqual(dispatch_once(self.conn, config(True), lambda request, timeout, code=code: Response(code))["status"], "DELIVERED")
        for code in (400, 401, 409, 413, 415):
            reset()
            result = dispatch_once(
                self.conn,
                config(True),
                lambda request, timeout, code=code: (_ for _ in ()).throw(
                    urllib.error.HTTPError(request.full_url, code, "synthetic", {}, None)
                ),
            )
            self.assertEqual(result["status"], "DEAD_LETTER")
        reset()
        self.assertEqual(dispatch_once(
            self.conn, config(True), lambda request, timeout: (_ for _ in ()).throw(TimeoutError("synthetic"))
        )["status"], "PENDING")
        reset(11)
        self.assertEqual(dispatch_once(
            self.conn, config(True), lambda request, timeout: (_ for _ in ()).throw(TimeoutError("synthetic"))
        )["status"], "DEAD_LETTER")

    def test_business_and_event_evidence_share_rollback_boundary(self):
        self.conn.execute("CREATE TABLE business_state(id TEXT PRIMARY KEY)")
        self.conn.commit()
        self.conn.execute("INSERT INTO business_state VALUES ('synthetic')")
        capture_state_changes(self.conn, {}, fee_state(), config())
        self.conn.rollback()
        self.assertEqual(self.conn.execute("SELECT COUNT(*) FROM business_state").fetchone()[0], 0)
        self.assertEqual(self.conn.execute("SELECT COUNT(*) FROM bsfv_outbox_events").fetchone()[0], 0)
        self.assertEqual(self.conn.execute("SELECT COUNT(*) FROM bsfv_source_versions").fetchone()[0], 0)

    def test_enable_conditions_reject_missing_or_non_tls_configuration(self):
        base = config(True)
        cases = [
            IntegrationConfig(True, "", (), base.key_id, base.secret, base.school_id, base.session_map),
            IntegrationConfig(True, "http://unsafe", ("http://unsafe",), base.key_id, base.secret, base.school_id, base.session_map),
            IntegrationConfig(True, base.endpoint, base.approved_endpoints, "", base.secret, base.school_id, base.session_map),
            IntegrationConfig(True, base.endpoint, base.approved_endpoints, base.key_id, "", base.school_id, base.session_map),
        ]
        self.assertEqual([item.refusal_code() for item in cases], [
            "endpoint_not_approved", "tls_required", "key_id_missing", "hmac_secret_missing"
        ])

    def test_clean_and_existing_schema_migration_are_idempotent(self):
        initialize_outbox(self.conn)
        existing = sqlite3.connect(Path(self.temp.name) / "existing.db")
        existing.execute("CREATE TABLE app_state(key TEXT PRIMARY KEY,value TEXT NOT NULL)")
        initialize_outbox(existing)
        self.assertEqual(existing.execute("SELECT COUNT(*) FROM sqlite_master WHERE name LIKE 'bsfv_%'").fetchone()[0], 6)
        existing.close()


if __name__ == "__main__":
    unittest.main()
