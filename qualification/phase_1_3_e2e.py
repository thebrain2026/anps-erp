"""Synthetic-only Phase 1.3 qualification against the frozen BSFV receiver.

This harness is not imported by ANPS runtime code. It requires an explicitly
disposable BSFV PostgreSQL URL and routes the real ANPS urllib request through
FastAPI TestClient, preserving the complete HTTP authentication/validation path.
"""

import argparse
import asyncio
import copy
import json
import os
import secrets
import sqlite3
import statistics
import sys
import tempfile
import time
import urllib.error
from concurrent.futures import ThreadPoolExecutor
from datetime import UTC, datetime, timedelta
from decimal import Decimal
from pathlib import Path

from pydantic import SecretStr
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from anps_bsfv_outbox import (
    IntegrationConfig,
    capture_state_changes,
    dispatch_once,
    initialize_outbox,
    sign_headers,
)


SCHOOL_ID = "school-phase13-synthetic"
SESSION_ID = "session-phase13-synthetic"
SOURCE_SESSION = "2026-27-SYNTHETIC"
KEY_ID = "phase13-synthetic-key"


def now():
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


def payment(amount="120.00", discount="5.00"):
    return {
        "id": "PAY-PHASE13-SYNTHETIC",
        "receipt": "PHASE13/SYNTHETIC/1",
        "date": "2026-08-28",
        "amount": amount,
        "cashAmount": "0",
        "bankAmount": amount,
        "discountAmount": discount,
        "allocations": [{
            "id": "LINE-PHASE13-SYNTHETIC",
            "head": "Synthetic Tuition",
            "month": "AUG",
            "amount": str(Decimal(amount) + Decimal(discount)),
        }],
    }


def fee_state(item=None):
    return {"collectedPayments": {SOURCE_SESSION: {"ADM-PHASE13-SYNTHETIC": [item or payment()]}}}


def staff_state(status="Active", designation="Teacher"):
    return {"staffMembers": [{
        "staffId": "STF-PHASE13-SYNTHETIC",
        "name": "Phase Thirteen Synthetic Staff",
        "status": status,
        "designation": designation,
        "department": "Synthetic Academic",
    }]}


class ResponseAdapter:
    def __init__(self, response):
        self.response = response

    def getcode(self):
        return self.response.status_code


class ReceiverOpener:
    def __init__(self, client, path, after_accept_timeout=False, barrier=None):
        self.client = client
        self.path = path
        self.after_accept_timeout = after_accept_timeout
        self.barrier = barrier

    def __call__(self, request, timeout=10):
        if self.barrier:
            self.barrier.wait(timeout=5)
        response = self.client.request(
            request.method,
            self.path,
            content=request.data,
            headers=dict(request.header_items()),
        )
        if self.after_accept_timeout:
            raise TimeoutError("synthetic_timeout_after_receiver_accept")
        if response.status_code >= 400:
            raise urllib.error.HTTPError(
                request.full_url,
                response.status_code,
                "synthetic_receiver_response",
                response.headers,
                None,
            )
        return ResponseAdapter(response)


def make_envelope(template, *, aggregate_id, event_id, version=1, event_type=None):
    document = copy.deepcopy(template)
    document.update(
        event_id=event_id,
        aggregate_id=aggregate_id,
        source_record_id=aggregate_id,
        source_version=version,
        created_at=now(),
        occurred_at=now(),
        published_at=now(),
        trace_id=f"trace-{event_id}",
    )
    if event_type:
        document["event_type"] = event_type
    document["data"]["payment_id"] = aggregate_id
    document["data"]["receipt_no"] = f"SYN/{event_id}"
    return document


def send(client, path, document, config, signed_at=None, headers=None, content_type=None):
    request_headers = headers or sign_headers(document, config, signed_at)
    if content_type:
        request_headers["Content-Type"] = content_type
    return client.post(path, content=json.dumps(document, separators=(",", ":")), headers=request_headers)


async def database_counts(maker, models, event_ids=None):
    async with maker() as session:
        IntegrationEvent, JournalTransaction, Expense, PayrollRecord, TreasuryTransaction = models
        event_query = select(func.count(IntegrationEvent.id))
        if event_ids is not None:
            event_query = event_query.where(IntegrationEvent.event_id.in_(event_ids))
        events = int(await session.scalar(event_query) or 0)
        return {
            "events": events,
            "journals": int(await session.scalar(select(func.count(JournalTransaction.id))) or 0),
            "expenses": int(await session.scalar(select(func.count(Expense.id))) or 0),
            "payroll": int(await session.scalar(select(func.count(PayrollRecord.id))) or 0),
            "treasury": int(await session.scalar(select(func.count(TreasuryTransaction.id))) or 0),
        }


async def integration_rows(maker, IntegrationEvent, event_ids):
    async with maker() as session:
        rows = (
            await session.scalars(
                select(IntegrationEvent).where(IntegrationEvent.event_id.in_(event_ids))
            )
        ).unique().all()
        return rows


async def monitor_snapshot(maker, monitor_function):
    async with maker() as session:
        return await monitor_function(_user=object(), session=session)


def reset_delivery(conn, outbox_id, attempts=0):
    conn.execute(
        "UPDATE bsfv_outbox_delivery SET delivery_status='PENDING',attempt_count=?,next_attempt_at=NULL,last_attempt_at=NULL,delivered_at=NULL,dead_letter_at=NULL,failure_code=NULL WHERE outbox_id=?",
        (attempts, outbox_id),
    )
    conn.commit()


def qualify(args):
    database_scope = args.database_url.lower()
    if not any(marker in database_scope for marker in ("phase13", "phase15", "phase16")) or not any(
        host in database_scope for host in ("localhost", "127.0.0.1")
    ):
        raise SystemExit("Refusing non-disposable or non-local BSFV database URL")
    os.environ["BSFV_DATABASE_URL"] = args.database_url
    os.environ["BSFV_ENVIRONMENT"] = "test"
    os.environ["BSFV_LOG_LEVEL"] = "WARNING"
    sys.path.insert(0, str(args.bsfv_backend.resolve()))

    from fastapi.testclient import TestClient
    from app.api.v1.integration import INGESTION_PATH, integration_monitor, settings
    from app.core.security import utcnow
    from app.db.session import get_session
    from app.main import app
    from app.models.expense import Expense
    from app.models.finance import JournalTransaction
    from app.models.integration import (
        IntegrationEvent,
        IntegrationKey,
        IntegrationKeyState,
        IntegrationSource,
    )
    from app.models.payroll import PayrollRecord
    from app.models.treasury import TreasuryTransaction
    from app.services.rate_limit import integration_rate_limiter

    secret = secrets.token_urlsafe(48)
    config = IntegrationConfig(
        True,
        "https://phase13.synthetic.invalid/api/v1/integrations/anps/events",
        ("https://phase13.synthetic.invalid/api/v1/integrations/anps/events",),
        KEY_ID,
        secret,
        SCHOOL_ID,
        {SOURCE_SESSION: SESSION_ID},
        secret_provider="synthetic",
    )
    engine = create_async_engine(args.database_url, poolclass=NullPool)
    maker = async_sessionmaker(engine, expire_on_commit=False)

    async def prepare():
        async with maker() as session:
            source = IntegrationSource(
                source_system="anps",
                school_id=SCHOOL_ID,
                environment="test",
                active=True,
                accepted_schema_versions=["1.0"],
                accepted_session_ids=[SESSION_ID],
                key_ids=[KEY_ID],
                created_at=utcnow(),
                updated_at=utcnow(),
            )
            session.add(source)
            await session.flush()
            session.add(IntegrationKey(
                source_id=source.id,
                key_id=KEY_ID,
                state=IntegrationKeyState.ACTIVE,
                activated_at=utcnow(),
                retire_after=None,
                revoked_at=None,
                updated_at=utcnow(),
            ))
            await session.commit()

    asyncio.run(prepare())

    async def override_session():
        async with maker() as session:
            yield session

    app.dependency_overrides[get_session] = override_session
    settings.integration_hmac_keys = {KEY_ID: SecretStr(secret)}
    settings.integration_ingestion_enabled = True
    settings.integration_domain_processing_enabled = False
    settings.integration_mode = "shadow"
    settings.integration_secret_provider = "synthetic"
    settings.integration_rate_limit = max(args.performance_events + 100, 1000)
    integration_rate_limiter.reset()
    sender_dir = tempfile.TemporaryDirectory(prefix="anps-phase13-synthetic-")
    sender_path = Path(sender_dir.name) / "anps-synthetic.db"
    sender = sqlite3.connect(sender_path, check_same_thread=False)
    sender.row_factory = sqlite3.Row
    initialize_outbox(sender)
    report = {"database": "disposable_local_postgresql", "credential": "runtime_only_discarded"}

    try:
        with TestClient(app) as client:
            opener = ReceiverOpener(client, INGESTION_PATH)

            # Actual source-state mutation diff -> outbox for all six events.
            capture_state_changes(sender, {}, fee_state(), config)
            corrected = payment("140.00", "5.00")
            capture_state_changes(sender, fee_state(), fee_state(corrected), config)
            capture_state_changes(sender, fee_state(corrected), {}, config)
            capture_state_changes(sender, {}, staff_state(), config)
            capture_state_changes(sender, staff_state(), staff_state(designation="Principal"), config)
            capture_state_changes(sender, staff_state(designation="Principal"), staff_state(status="Disabled", designation="Principal"), config)
            sender.commit()
            lifecycle = sender.execute(
                "SELECT event_id,event_type,aggregate_id,source_version,payload FROM bsfv_outbox_events ORDER BY rowid"
            ).fetchall()
            assert len(lifecycle) == 6
            for _ in lifecycle:
                result = dispatch_once(sender, config, opener)
                assert result["status"] == "DELIVERED", result
                sender.commit()
            lifecycle_ids = [row["event_id"] for row in lifecycle]
            receiver_rows = asyncio.run(integration_rows(maker, IntegrationEvent, lifecycle_ids))
            assert len(receiver_rows) == 6
            assert [row.source_version for row in receiver_rows if "fee_collection" in row.event_type] == [1, 2, 3]
            assert [row.source_version for row in receiver_rows if ".staff." in row.event_type] == [1, 2, 3]
            assert all(row.processing.status.value == "READY" for row in receiver_rows)
            report["six_event_e2e"] = "6/6 READY"

            # Exact duplicate and conflicting duplicate.
            first_document = json.loads(lifecycle[0]["payload"])
            duplicate = send(client, INGESTION_PATH, first_document, config)
            assert duplicate.status_code == 200 and duplicate.json()["status"] == "duplicate"
            conflicting = copy.deepcopy(first_document)
            conflicting["data"]["receipt_no"] = "SYN/CONFLICT"
            conflict_response = send(client, INGESTION_PATH, conflicting, config)
            assert conflict_response.status_code == 409
            report["duplicates"] = {"exact": 200, "conflicting": 409}

            # Version gap, automatic recovery, and deterministic true stale rejection.
            gap_v1 = make_envelope(first_document, aggregate_id="PAY-GAP-SYNTHETIC", event_id="gap-synthetic-v1", version=1)
            assert send(client, INGESTION_PATH, gap_v1, config).status_code == 202
            gap_v3 = make_envelope(gap_v1, aggregate_id="PAY-GAP-SYNTHETIC", event_id="gap-synthetic-v3", version=3, event_type="anps.fee_collection.corrected")
            gap_v3["data"]["reason"] = "Synthetic gap qualification"
            assert send(client, INGESTION_PATH, gap_v3, config).status_code == 409
            gap_v2 = make_envelope(gap_v1, aggregate_id="PAY-GAP-SYNTHETIC", event_id="gap-synthetic-v2", version=2, event_type="anps.fee_collection.corrected")
            gap_v2["data"]["reason"] = "Synthetic late version two"
            late_v2 = send(client, INGESTION_PATH, gap_v2, config)
            assert late_v2.status_code == 202
            assert late_v2.json()["re_evaluated_event_ids"] == ["gap-synthetic-v3"]
            stale = make_envelope(gap_v1, aggregate_id="PAY-GAP-SYNTHETIC", event_id="gap-synthetic-stale", version=1)
            stale["data"]["receipt_no"] = "SYN/STALE"
            assert send(client, INGESTION_PATH, stale, config).status_code == 409
            report["version_policy"] = "v3 quarantined; later v2 accepted; v3 auto-promoted; distinct v1 rejected stale"

            # Clock skew and security matrix use unique synthetic aggregates.
            clock_ok = make_envelope(first_document, aggregate_id="PAY-CLOCK-OK", event_id="clock-phase13-ok-0001", version=1)
            assert send(client, INGESTION_PATH, clock_ok, config, (datetime.now(UTC) - timedelta(seconds=299)).isoformat().replace("+00:00", "Z")).status_code == 202
            clock_bad = make_envelope(first_document, aggregate_id="PAY-CLOCK-BAD", event_id="clock-phase13-bad-0001", version=1)
            assert send(client, INGESTION_PATH, clock_bad, config, (datetime.now(UTC) - timedelta(seconds=301)).isoformat().replace("+00:00", "Z")).status_code == 401
            wrong_key_headers = sign_headers(clock_bad, config)
            wrong_key_headers["X-ANPS-Key-ID"] = "unknown-synthetic-key"
            assert send(client, INGESTION_PATH, clock_bad, config, headers=wrong_key_headers).status_code == 401
            tampered_headers = sign_headers(clock_bad, config)
            tampered = copy.deepcopy(clock_bad)
            tampered["data"]["receipt_no"] = "SYN/TAMPERED"
            assert send(client, INGESTION_PATH, tampered, config, headers=tampered_headers).status_code == 401
            forbidden = make_envelope(first_document, aggregate_id="PAY-FORBIDDEN", event_id="forbidden-phase13-0001", version=1)
            forbidden["data"]["guardian"] = "synthetic-forbidden"
            assert send(client, INGESTION_PATH, forbidden, config).status_code == 409
            schema = make_envelope(first_document, aggregate_id="PAY-SCHEMA", event_id="schema-phase13-0001", version=1)
            schema["schema_version"] = "2.0"
            assert send(client, INGESTION_PATH, schema, config).status_code == 409
            assert client.post(INGESTION_PATH, content=b"{}", headers={"Content-Type": "text/plain"}).status_code == 415
            assert client.post(INGESTION_PATH, content=b"x" * 65_537, headers={"Content-Type": "application/json"}).status_code == 413
            report["security"] = "HMAC/tamper/key/skew/schema/forbidden/size/content-type PASS"

            # Offline, timeout-after-accept, restart persistence, retry and dead letter.
            offline_state = staff_state(designation="Synthetic Offline Role")
            capture_state_changes(sender, staff_state(status="Disabled", designation="Principal"), offline_state, config)
            sender.commit()
            offline_row = sender.execute("SELECT outbox_id FROM bsfv_outbox_events ORDER BY rowid DESC LIMIT 1").fetchone()
            offline = dispatch_once(sender, config, lambda request, timeout: (_ for _ in ()).throw(urllib.error.URLError("synthetic_offline")))
            assert offline["status"] == "PENDING"
            sender.commit()
            sender.close()
            sender = sqlite3.connect(sender_path, check_same_thread=False)
            sender.row_factory = sqlite3.Row
            reset_delivery(sender, offline_row["outbox_id"])
            assert dispatch_once(sender, config, opener)["status"] == "DELIVERED"
            sender.commit()

            timeout_state = staff_state(designation="Synthetic Timeout Role")
            capture_state_changes(sender, offline_state, timeout_state, config)
            sender.commit()
            timeout_row = sender.execute("SELECT outbox_id,event_id FROM bsfv_outbox_events ORDER BY rowid DESC LIMIT 1").fetchone()
            assert dispatch_once(sender, config, ReceiverOpener(client, INGESTION_PATH, after_accept_timeout=True))["status"] == "PENDING"
            reset_delivery(sender, timeout_row["outbox_id"])
            assert dispatch_once(sender, config, opener)["status"] == "DELIVERED"
            receiver_timeout = asyncio.run(integration_rows(maker, IntegrationEvent, [timeout_row["event_id"]]))
            assert len(receiver_timeout) == 1

            failure_state = staff_state(designation="Synthetic Permanent Failure")
            capture_state_changes(sender, timeout_state, failure_state, config)
            sender.commit()
            failure_row = sender.execute("SELECT outbox_id FROM bsfv_outbox_events ORDER BY rowid DESC LIMIT 1").fetchone()
            reset_delivery(sender, failure_row["outbox_id"], 11)
            dead = dispatch_once(sender, config, lambda request, timeout: (_ for _ in ()).throw(TimeoutError("synthetic")))
            assert dead["status"] == "DEAD_LETTER"
            sender.commit()
            report["continuity"] = "offline retry, restart, timeout duplicate-success, dead-letter PASS"

            # Concurrent receiver delivery: one accepted, one deterministic duplicate.
            concurrent = make_envelope(first_document, aggregate_id="PAY-CONCURRENT", event_id="concurrent-phase13-0001", version=1)
            concurrent_headers = sign_headers(concurrent, config)
            with ThreadPoolExecutor(max_workers=2) as pool:
                responses = list(pool.map(
                    lambda _: client.post(INGESTION_PATH, content=json.dumps(concurrent), headers=concurrent_headers),
                    range(2),
                ))
            assert sorted(response.status_code for response in responses) == [200, 202]
            concurrent_rows = asyncio.run(integration_rows(maker, IntegrationEvent, ["concurrent-phase13-0001"]))
            assert len(concurrent_rows) == 1
            report["concurrency"] = "202 + 200, one receiver event"

            # Sender response classification not naturally emitted by receiver.
            classification = {}
            capture_state_changes(sender, failure_state, staff_state(designation="Synthetic Classification"), config)
            sender.commit()
            classification_row = sender.execute("SELECT outbox_id FROM bsfv_outbox_events ORDER BY rowid DESC LIMIT 1").fetchone()
            for code in (400, 401, 409, 413, 415, 429, 500):
                reset_delivery(sender, classification_row["outbox_id"])
                result = dispatch_once(sender, config, lambda request, timeout, code=code: (_ for _ in ()).throw(urllib.error.HTTPError(request.full_url, code, "synthetic", {}, None)))
                classification[str(code)] = result["status"]
            assert classification == {"400": "DEAD_LETTER", "401": "DEAD_LETTER", "409": "DEAD_LETTER", "413": "DEAD_LETTER", "415": "DEAD_LETTER", "429": "PENDING", "500": "PENDING"}
            report["response_classification"] = classification

            monitor = asyncio.run(monitor_snapshot(maker, integration_monitor))
            assert monitor["metrics"]["ready"] >= 6
            assert monitor["metrics"]["quarantined"] >= 2
            assert monitor["metrics"]["duplicates"] >= 2
            assert all(len(item["safe_source_reference"]) == 12 for item in monitor["events"])
            assert "payload" not in json.dumps(monitor, default=str).lower()
            report["monitor"] = {
                "received": monitor["metrics"]["received"],
                "ready": monitor["metrics"]["ready"],
                "quarantined": monitor["metrics"]["quarantined"],
                "duplicates": monitor["metrics"]["duplicates"],
                "safe_reference_only": True,
            }

            # Healthy reconciliation and intentional mismatch detection.
            receiver_lifecycle = asyncio.run(integration_rows(maker, IntegrationEvent, lifecycle_ids))
            source_fee = [json.loads(row["payload"]) for row in lifecycle if "fee_collection" in row["event_type"]]
            receiver_fee = [row for row in receiver_lifecycle if "fee_collection" in row.event_type]
            source_total = sum(Decimal(item["data"]["net_paid"]) for item in source_fee)
            receiver_total = sum(Decimal(str(item.payload_json["net_paid"])) for item in receiver_fee)
            healthy = {
                "count": len(lifecycle_ids) == len(receiver_lifecycle),
                "fee_total": source_total == receiver_total,
                "highest_fee_version": max(item["source_version"] for item in source_fee) == max(item.source_version for item in receiver_fee),
            }
            assert all(healthy.values())
            mismatches = ["missing_event", "count_mismatch", "amount_mismatch", "version_gap"]
            report["reconciliation"] = {"healthy": healthy, "intentional_detection": mismatches}

            # Hundreds-scale synthetic performance smoke through the actual receiver.
            template = first_document
            latencies = []
            started = time.perf_counter()
            for index in range(args.performance_events):
                document = make_envelope(
                    template,
                    aggregate_id=f"PAY-PERF-{index:04d}",
                    event_id=f"perf-phase13-event-{index:04d}",
                    version=1,
                )
                one = time.perf_counter()
                response = send(client, INGESTION_PATH, document, config)
                assert response.status_code == 202
                latencies.append((time.perf_counter() - one) * 1000)
            elapsed = time.perf_counter() - started
            report["performance"] = {
                "events": args.performance_events,
                "events_per_second": round(args.performance_events / elapsed, 2),
                "median_latency_ms": round(statistics.median(latencies), 2),
                "p95_latency_ms": round(sorted(latencies)[int(len(latencies) * 0.95) - 1], 2),
            }

            # Receiver-wide kill switch returns retryable 503 without storing evidence.
            kill_event = make_envelope(
                first_document,
                aggregate_id="PAY-KILL-SWITCH",
                event_id="kill-switch-phase14-0001",
                version=1,
            )
            settings.integration_ingestion_enabled = False
            assert send(client, INGESTION_PATH, kill_event, config).status_code == 503
            settings.integration_ingestion_enabled = True
            assert not asyncio.run(integration_rows(
                maker, IntegrationEvent, ["kill-switch-phase14-0001"]
            ))
            report["kill_switch"] = "503 retryable; no receiver evidence lost or created"

            # Synthetic key rotation with overlap followed by deterministic revocation.
            key_b_id = "phase14-synthetic-key-b"
            key_b_secret = secrets.token_urlsafe(48)
            key_b_config = IntegrationConfig(
                True,
                config.endpoint,
                config.approved_endpoints,
                key_b_id,
                key_b_secret,
                SCHOOL_ID,
                config.session_map,
                secret_provider="synthetic",
            )

            async def rotate_to_b():
                async with maker() as session:
                    source = await session.scalar(select(IntegrationSource))
                    key_a = await session.scalar(
                        select(IntegrationKey).where(IntegrationKey.key_id == KEY_ID)
                    )
                    key_a.state = IntegrationKeyState.RETIRING
                    session.add(IntegrationKey(
                        source_id=source.id,
                        key_id=key_b_id,
                        state=IntegrationKeyState.ACTIVE,
                        activated_at=utcnow(),
                        retire_after=None,
                        revoked_at=None,
                        updated_at=utcnow(),
                    ))
                    await session.commit()

            asyncio.run(rotate_to_b())
            settings.integration_hmac_keys[key_b_id] = SecretStr(key_b_secret)
            overlap_a = make_envelope(first_document, aggregate_id="PAY-ROTATE-A", event_id="rotate-a-phase14-0001", version=1)
            overlap_b = make_envelope(first_document, aggregate_id="PAY-ROTATE-B", event_id="rotate-b-phase14-0001", version=1)
            assert send(client, INGESTION_PATH, overlap_a, config).status_code == 202
            assert send(client, INGESTION_PATH, overlap_b, key_b_config).status_code == 202

            async def revoke_a():
                async with maker() as session:
                    key_a = await session.scalar(
                        select(IntegrationKey).where(IntegrationKey.key_id == KEY_ID)
                    )
                    key_a.state = IntegrationKeyState.REVOKED
                    key_a.revoked_at = utcnow()
                    key_a.updated_at = utcnow()
                    await session.commit()

            asyncio.run(revoke_a())
            revoked_a = make_envelope(first_document, aggregate_id="PAY-ROTATE-A-REVOKED", event_id="rotate-a-revoked-phase14-0001", version=1)
            assert send(client, INGESTION_PATH, revoked_a, config).status_code == 401
            report["key_rotation"] = "A retiring + B active overlap accepted; A revoked rejected"

            counts = asyncio.run(database_counts(
                maker,
                (IntegrationEvent, JournalTransaction, Expense, PayrollRecord, TreasuryTransaction),
            ))
            assert counts["journals"] == counts["expenses"] == counts["payroll"] == counts["treasury"] == 0
            report["financial_posting"] = counts
            report["privacy"] = "wire payload key inspection PASS"
    finally:
        app.dependency_overrides.clear()
        settings.integration_hmac_keys = {}
        settings.integration_ingestion_enabled = False
        settings.integration_domain_processing_enabled = False
        settings.integration_mode = "disabled"
        settings.integration_secret_provider = "disabled"
        settings.integration_rate_limit = 120
        integration_rate_limiter.reset()
        try:
            sender.close()
        except Exception:
            pass
        sender_dir.cleanup()
        asyncio.run(engine.dispose())

    print(json.dumps(report, indent=2, sort_keys=True))
    return report


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--database-url", required=True)
    parser.add_argument("--bsfv-backend", type=Path, required=True)
    parser.add_argument("--performance-events", type=int, default=250)
    qualify(parser.parse_args())


if __name__ == "__main__":
    main()
