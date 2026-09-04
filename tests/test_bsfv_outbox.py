import json
import os
import sqlite3
import tempfile
import unittest
import urllib.error
from datetime import UTC, datetime
from pathlib import Path
from unittest.mock import patch

import anps_bsfv_outbox

from anps_bsfv_outbox import (
    IntegrationConfig,
    build_fee_baseline_envelope,
    capture_state_changes,
    dispatch_once,
    dispatcher_loop,
    initialize_outbox,
    payload_digest,
    pilot_metrics,
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
        secret_provider="synthetic",
        allowed_event_types=("anps.fee_collection.created",),
        pilot_not_before="2026-01-01T00:00:00Z",
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


def bank_payment(amount="100.00", bank_id="bank-synthetic-01"):
    item = payment(amount, "0.00")
    item["cashAmount"] = "0.00"
    item["bankAmount"] = amount
    item["bankAccountId"] = bank_id
    item["allocations"][0]["amount"] = amount
    return item


def fee_state(item=None):
    return {"collectedPayments": {"2026-27": {"ADM-SYN-1": [item or payment()]}}}


def staff_state(status="Active", designation="Teacher"):
    return {"staffMembers": [{"staffId": "STF-SYN-1", "name": "Synthetic Person", "status": status, "designation": designation, "department": "Synthetic"}]}


class Response:
    def __init__(self, code):
        self.code = code

    def getcode(self):
        return self.code


class StopAfterWaits:
    def __init__(self, limit):
        self.limit = limit
        self.waits = 0

    def is_set(self):
        return self.waits >= self.limit

    def wait(self, _seconds):
        self.waits += 1


class FakeConnection:
    def __init__(self):
        self.commits = 0
        self.rollbacks = 0
        self.closed = 0

    def commit(self):
        self.commits += 1

    def rollback(self):
        self.rollbacks += 1

    def close(self):
        self.closed += 1


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

    def test_runtime_dispatcher_is_off_without_enable_flag(self):
        dispatcher_loop(
            StopAfterWaits(1),
            lambda: self.fail("disabled dispatcher opened the database"),
            config_factory=lambda: config(False),
            dispatcher=lambda _conn, config: self.fail("disabled dispatcher attempted delivery"),
            idle_seconds=0,
        )

    def test_runtime_dispatcher_failure_is_isolated_and_loop_continues(self):
        connections = []
        calls = []

        def connection_factory():
            connection = FakeConnection()
            connections.append(connection)
            return connection

        def dispatcher(_conn, config):
            calls.append(config.enabled)
            if len(calls) == 1:
                raise OSError("synthetic BSFV unavailable")
            return {"attempted": 0, "refused": None}

        dispatcher_loop(
            StopAfterWaits(2),
            connection_factory,
            config_factory=lambda: config(True),
            dispatcher=dispatcher,
            idle_seconds=0,
        )

        self.assertEqual(calls, [True, True])
        self.assertEqual([item.rollbacks for item in connections], [1, 0])
        self.assertEqual([item.commits for item in connections], [0, 1])
        self.assertEqual([item.closed for item in connections], [1, 1])

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

    def test_normalization_only_changes_do_not_create_correction(self):
        original = payment("100.0", "5")
        normalized = payment("100.00", "5.00")
        normalized["session"] = "2026-27"
        normalized["school_id"] = "school-synthetic"
        normalized["allocations"][0]["session"] = "2026-27"
        normalized["allocations"][0]["schoolId"] = "school-synthetic"
        original["date"] = "28-08-2026"
        normalized["date"] = "2026-08-28"
        capture_state_changes(self.conn, {}, fee_state(original), config())
        capture_state_changes(self.conn, fee_state(original), fee_state(normalized), config())
        self.assertEqual(len(self.rows()), 1)

    def test_meaningful_finance_changes_create_corrections(self):
        cases = []
        amount_changed = payment("120.00", "5.00")
        cases.append(amount_changed)
        tender_changed = bank_payment("100.00")
        cases.append(tender_changed)
        bank_changed = bank_payment("100.00", "bank-synthetic-02")
        cases.append(bank_changed)
        allocation_changed = payment("100.00", "5.00")
        allocation_changed["allocations"] = [
            {"id": "line-1", "head": "Tuition", "month": "AUG", "amount": "50.00"},
            {"id": "line-2", "head": "Transport", "month": "AUG", "amount": "55.00"},
        ]
        cases.append(allocation_changed)
        prior = payment()
        capture_state_changes(self.conn, {}, fee_state(prior), config())
        for changed in cases:
            before = len(self.rows())
            capture_state_changes(self.conn, fee_state(prior), fee_state(changed), config())
            self.assertEqual(len(self.rows()), before + 1)
            prior = changed

    def test_bank_identity_is_transport_only_and_cash_needs_none(self):
        capture_state_changes(self.conn, {}, fee_state(bank_payment()), config())
        bank_data = json.loads(self.rows()[0]["payload"])["data"]
        self.assertEqual(bank_data["tenders"][0]["source_bank_id"], "bank-synthetic-01")
        with self.assertRaisesRegex(ValueError, "source_bank_id_required"):
            missing = bank_payment()
            missing.pop("bankAccountId")
            anps_bsfv_outbox._fee_payload(missing["id"], "2026-27", "ADM", missing)
        cash_data = anps_bsfv_outbox._fee_payload(
            "pay-cash", "2026-27", "ADM", payment()
        )
        self.assertNotIn("source_bank_id", cash_data["tenders"][0])

    def test_baseline_preserves_high_water_without_mutating_outbox(self):
        item = bank_payment()
        capture_state_changes(self.conn, {}, fee_state(item), config())
        corrected = dict(item, amount="110.00", bankAmount="110.00")
        corrected["allocations"] = [dict(item["allocations"][0], amount="110.00")]
        capture_state_changes(self.conn, fee_state(item), fee_state(corrected), config())
        before = self.conn.total_changes
        baseline = build_fee_baseline_envelope(
            self.conn, item["id"], "2026-27", "ADM-SYN-1", corrected, config()
        )
        self.assertEqual(baseline["event_type"], "anps.fee_collection.baseline")
        self.assertEqual(baseline["source_version"], 2)
        self.assertEqual(self.conn.total_changes, before)
        self.assertEqual(len(self.rows()), 2)

    def test_india_display_date_is_rfc3339_without_utc_reinterpretation(self):
        item = payment()
        item["date"] = "30-08-2026"
        capture_state_changes(self.conn, {}, fee_state(item), config())
        document = json.loads(self.rows()[0]["payload"])
        self.assertEqual(document["occurred_at"], "2026-08-30T00:00:00+05:30")
        self.assertEqual(document["data"]["payment_date"], "2026-08-30")

    def test_month_day_ambiguity_uses_day_month_year(self):
        self.assertEqual(
            anps_bsfv_outbox._occurred_at("02-03-2026"),
            "2026-03-02T00:00:00+05:30",
        )

    def test_utc_and_offset_aware_values_remain_absolute(self):
        self.assertEqual(
            anps_bsfv_outbox._occurred_at("2026-08-30T01:02:03Z"),
            "2026-08-30T01:02:03+00:00",
        )
        self.assertEqual(
            anps_bsfv_outbox._occurred_at(datetime(2026, 8, 30, 1, 2, 3, tzinfo=UTC)),
            "2026-08-30T01:02:03+00:00",
        )

    def test_midnight_boundary_and_invalid_date(self):
        self.assertEqual(
            anps_bsfv_outbox._occurred_at("01-01-2027"),
            "2027-01-01T00:00:00+05:30",
        )
        with self.assertRaisesRegex(ValueError, "invalid_business_datetime"):
            anps_bsfv_outbox._occurred_at("31-02-2026")

    def test_rapid_consecutive_events_have_valid_transport_timestamps(self):
        first = payment()
        second = payment()
        second["id"] = "pay-synthetic-2"
        second["receipt"] = "SYN/2"
        second["date"] = "30-08-2026 23:59:59"
        capture_state_changes(self.conn, {}, fee_state(first), config())
        capture_state_changes(self.conn, {}, fee_state(second), config())
        documents = [json.loads(row["payload"]) for row in self.rows()]
        self.assertEqual(len(documents), 2)
        for document in documents:
            self.assertIsNotNone(datetime.fromisoformat(document["occurred_at"]))
            self.assertIsNotNone(datetime.fromisoformat(document["created_at"].replace("Z", "+00:00")))
            self.assertIsNotNone(datetime.fromisoformat(document["published_at"].replace("Z", "+00:00")))

    def test_dead_letter_recovery_preserves_original_and_republishes_same_version(self):
        item = payment()
        item["date"] = "30-08-2026"
        capture_state_changes(self.conn, {}, fee_state(item), config())
        original = self.rows()[0]
        legacy_document = json.loads(original["payload"])
        legacy_document["occurred_at"] = "30-08-2026T00:00:00Z"
        legacy_document["data"]["payment_date"] = "30-08-2026"
        original_payload = anps_bsfv_outbox.canonical_bytes(legacy_document).decode()
        self.conn.execute("DROP TRIGGER bsfv_outbox_events_no_update")
        self.conn.execute(
            "UPDATE bsfv_outbox_events SET payload=?,occurred_at=? WHERE outbox_id=?",
            (original_payload, legacy_document["occurred_at"], original["outbox_id"]),
        )
        initialize_outbox(self.conn)
        self.conn.execute(
            "UPDATE bsfv_outbox_delivery SET delivery_status='DEAD_LETTER',"
            "attempt_count=1,failure_code='http_400',dead_letter_at=? WHERE outbox_id=?",
            ("2026-08-30T03:38:10Z", original["outbox_id"]),
        )
        recovery_id = anps_bsfv_outbox.prepare_dead_letter_recovery(
            self.conn, original["outbox_id"]
        )
        replacement = self.conn.execute(
            "SELECT * FROM bsfv_outbox_recovery_events WHERE recovery_id=?", (recovery_id,)
        ).fetchone()
        replacement_document = json.loads(replacement["payload"])
        self.assertEqual(self.rows()[0]["payload"], original_payload)
        self.assertNotEqual(replacement_document["event_id"], original["event_id"])
        self.assertEqual(replacement_document["source_version"], original["source_version"])
        self.assertEqual(replacement_document["aggregate_id"], original["aggregate_id"])
        self.assertEqual(
            replacement_document["occurred_at"], "2026-08-30T00:00:00+05:30"
        )
        self.assertEqual(
            anps_bsfv_outbox.prepare_dead_letter_recovery(self.conn, original["outbox_id"]),
            recovery_id,
        )
        result = dispatch_once(self.conn, config(True), lambda request, timeout: Response(202))
        self.assertTrue(result["recovery"])
        self.assertEqual(result["status"], "DELIVERED")
        delivery = self.conn.execute(
            "SELECT * FROM bsfv_outbox_delivery WHERE outbox_id=?", (original["outbox_id"],)
        ).fetchone()
        self.assertEqual(delivery["delivery_status"], "DEAD_LETTER")
        self.assertEqual(delivery["failure_code"], "http_400")

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
            IntegrationConfig(True, "", (), base.key_id, base.secret, base.school_id, base.session_map, secret_provider="synthetic"),
            IntegrationConfig(True, "http://unsafe", ("http://unsafe",), base.key_id, base.secret, base.school_id, base.session_map, secret_provider="synthetic"),
            IntegrationConfig(True, base.endpoint, base.approved_endpoints, "", base.secret, base.school_id, base.session_map, secret_provider="synthetic"),
            IntegrationConfig(True, base.endpoint, base.approved_endpoints, base.key_id, "", base.school_id, base.session_map, secret_provider="synthetic"),
        ]
        self.assertEqual([item.refusal_code() for item in cases], [
            "endpoint_not_approved", "tls_required", "key_id_missing", "hmac_secret_missing"
        ])

    def test_environment_enablement_and_secret_provider_fail_closed(self):
        from unittest.mock import patch

        with patch.dict(os.environ, {"ANPS_BSFV_INTEGRATION_ENABLED": "yes"}, clear=True):
            self.assertEqual(IntegrationConfig.from_env().refusal_code(), "integration_disabled")
        with patch.dict(os.environ, {"ANPS_BSFV_INTEGRATION_ENABLED": "true"}, clear=True):
            self.assertEqual(
                IntegrationConfig.from_env().refusal_code(), "secret_provider_unavailable"
            )

    def test_pilot_scope_and_activation_cutoff_fail_closed(self):
        base = config(True)
        missing_scope = IntegrationConfig(
            **{**base.__dict__, "allowed_event_types": ()}
        )
        invalid_scope = IntegrationConfig(
            **{**base.__dict__, "allowed_event_types": ("anps.staff.unknown",)}
        )
        missing_cutoff = IntegrationConfig(
            **{**base.__dict__, "pilot_not_before": ""}
        )
        self.assertEqual(
            missing_scope.refusal_code(), "event_type_allowlist_missing_or_invalid"
        )
        self.assertEqual(
            invalid_scope.refusal_code(), "event_type_allowlist_missing_or_invalid"
        )
        self.assertEqual(
            missing_cutoff.refusal_code(), "pilot_activation_cutoff_missing_or_invalid"
        )

    def test_external_secret_file_and_endpoint_validation_fail_closed(self):
        secret_file = Path(self.temp.name) / "key-a"
        secret_file.write_text("synthetic-external-secret-at-least-32-characters")
        secret_file.chmod(0o600)
        access_id_file = Path(self.temp.name) / "cf-access-client-id"
        access_id_file.write_text("synthetic-access-client-id")
        access_id_file.chmod(0o600)
        access_secret_file = Path(self.temp.name) / "cf-access-client-secret"
        access_secret_file.write_text("synthetic-access-client-secret-at-least-32")
        access_secret_file.chmod(0o600)
        environment = {
            "ANPS_BSFV_INTEGRATION_ENABLED": "true",
            "ANPS_BSFV_SECRET_PROVIDER": "external",
            "ANPS_BSFV_HMAC_SECRET_FILE": str(secret_file),
            "ANPS_BSFV_KEY_ID": "key-a",
            "ANPS_BSFV_ENDPOINT": "https://anpsfinance.thebrainerp.com/api/v1/integrations/anps/events",
            "ANPS_BSFV_APPROVED_ENDPOINTS": "https://anpsfinance.thebrainerp.com/api/v1/integrations/anps/events",
            "ANPS_BSFV_SCHOOL_ID": "school-synthetic",
            "ANPS_BSFV_SESSION_MAP": '{"2026-27":"session-synthetic"}',
            "ANPS_BSFV_CF_ACCESS_CLIENT_ID_FILE": str(access_id_file),
            "ANPS_BSFV_CF_ACCESS_CLIENT_SECRET_FILE": str(access_secret_file),
            "ANPS_BSFV_ALLOWED_EVENT_TYPES": "anps.fee_collection.created",
            "ANPS_BSFV_PILOT_NOT_BEFORE": "2026-08-30T00:00:00Z",
        }
        with patch.dict(os.environ, environment, clear=True):
            assert IntegrationConfig.from_env().refusal_code() is None
        secret_file.chmod(0o644)
        with patch.dict(os.environ, environment, clear=True):
            assert IntegrationConfig.from_env().refusal_code() == "hmac_secret_missing"
        unsafe = dict(environment)
        unsafe["ANPS_BSFV_ENDPOINT"] += "?redirect=https://example.invalid"
        unsafe["ANPS_BSFV_APPROVED_ENDPOINTS"] = unsafe["ANPS_BSFV_ENDPOINT"]
        with patch.dict(os.environ, unsafe, clear=True):
            assert IntegrationConfig.from_env().refusal_code() == "tls_required"

        secret_file.chmod(0o600)
        missing_edge = dict(environment)
        missing_edge.pop("ANPS_BSFV_CF_ACCESS_CLIENT_SECRET_FILE")
        with patch.dict(os.environ, missing_edge, clear=True):
            assert IntegrationConfig.from_env().refusal_code() == "edge_service_credentials_missing"

    def test_render_managed_secret_symlink_is_narrowly_accepted(self):
        render_root = Path(self.temp.name) / "etc-secrets"
        version_dir = render_root / "..2026_08_30_01_56_35.1234567890"
        version_dir.mkdir(parents=True)
        target = version_dir / "key-a"
        target.write_text("synthetic-render-secret-at-least-32-characters")
        target.chmod(0o640)
        projection = render_root / "key-a"
        projection.symlink_to(target)

        with patch.object(anps_bsfv_outbox, "RENDER_SECRETS_DIR", render_root):
            self.assertTrue(anps_bsfv_outbox._read_external_secret(str(projection), "key-a"))

            target.chmod(0o644)
            self.assertEqual(anps_bsfv_outbox._read_external_secret(str(projection), "key-a"), "")

            outside = Path(self.temp.name) / "outside-key-a"
            outside.write_text("synthetic-outside-secret-at-least-32-characters")
            outside.chmod(0o640)
            projection.unlink()
            projection.symlink_to(outside)
            self.assertEqual(anps_bsfv_outbox._read_external_secret(str(projection), "key-a"), "")

    def test_service_credentials_are_added_only_when_both_are_present(self):
        base = config()
        configured = IntegrationConfig(
            **{**base.__dict__, "access_client_id": "client-id", "access_client_secret": "client-secret"}
        )
        capture_state_changes(self.conn, {}, fee_state(), configured)
        document = json.loads(self.rows()[0]["payload"])
        headers = sign_headers(document, configured, "2026-08-28T12:00:00Z")
        self.assertEqual(headers["CF-Access-Client-Id"], "client-id")
        self.assertEqual(headers["CF-Access-Client-Secret"], "client-secret")

    def test_dispatcher_enforces_event_allowlist_and_activation_cutoff(self):
        configured = config(True)
        capture_state_changes(self.conn, {}, {**fee_state(), **staff_state()}, configured)
        first = dispatch_once(self.conn, configured, lambda request, timeout: Response(202))
        second = dispatch_once(self.conn, configured, lambda request, timeout: Response(202))
        self.assertEqual(first["status"], "DELIVERED")
        self.assertEqual(second, {"attempted": 0, "refused": None})
        pending = self.conn.execute(
            "SELECT e.event_type FROM bsfv_outbox_events e "
            "JOIN bsfv_outbox_delivery d USING(outbox_id) "
            "WHERE d.delivery_status='PENDING'"
        ).fetchall()
        self.assertEqual([row[0] for row in pending], ["anps.staff.created"])

        later_payment = payment()
        later_payment["id"] = "pay-synthetic-2"
        capture_state_changes(self.conn, {}, fee_state(later_payment), configured)
        future = IntegrationConfig(
            **{**configured.__dict__, "pilot_not_before": "2099-01-01T00:00:00Z"}
        )
        self.assertEqual(
            dispatch_once(self.conn, future, lambda request, timeout: Response(202)),
            {"attempted": 0, "refused": None},
        )

        metrics = pilot_metrics(self.conn, configured)
        self.assertTrue(metrics["scope_ready"])
        self.assertEqual(metrics["generated"], 2)
        self.assertEqual(metrics["delivered"], 1)
        self.assertEqual(metrics["pending"], 1)
        self.assertEqual(metrics["generated_amount"], "200.00")
        self.assertEqual(metrics["delivered_amount"], "100.00")

    def test_clean_and_existing_schema_migration_are_idempotent(self):
        initialize_outbox(self.conn)
        existing = sqlite3.connect(Path(self.temp.name) / "existing.db")
        existing.execute("CREATE TABLE app_state(key TEXT PRIMARY KEY,value TEXT NOT NULL)")
        initialize_outbox(existing)
        self.assertEqual(existing.execute("SELECT COUNT(*) FROM sqlite_master WHERE name LIKE 'bsfv_%'").fetchone()[0], 10)
        existing.close()


if __name__ == "__main__":
    unittest.main()
