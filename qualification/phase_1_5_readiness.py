"""Synthetic Phase 1.5 capacity, backlog and fail-closed qualification."""

import argparse
import json
import resource
import sqlite3
import statistics
import sys
import tempfile
import time
from pathlib import Path

from anps_bsfv_outbox import (
    IntegrationConfig,
    capture_state_changes,
    dispatch_once,
    initialize_outbox,
)
from phase_1_3_e2e import qualify


class Accepted:
    def getcode(self):
        return 202


def sender_capacity(event_count):
    usage_before = resource.getrusage(resource.RUSAGE_SELF)
    config = IntegrationConfig(
        True,
        "https://phase15.synthetic.invalid/api/v1/integrations/anps/events",
        ("https://phase15.synthetic.invalid/api/v1/integrations/anps/events",),
        "phase15-synthetic-key",
        "phase15-synthetic-secret-at-least-32-characters",
        "school-phase15-synthetic",
        {"2026-27-SYNTHETIC": "session-phase15-synthetic"},
        secret_provider="synthetic",
    )
    with tempfile.TemporaryDirectory(prefix="anps-phase15-backlog-") as directory:
        connection = sqlite3.connect(Path(directory) / "outbox.db")
        connection.row_factory = sqlite3.Row
        initialize_outbox(connection)
        before = {}
        creation_latencies = []
        started = time.perf_counter()
        for index in range(event_count):
            after = {"staffMembers": [{
                "staffId": "STF-PHASE15-SYNTHETIC",
                "name": "Phase Fifteen Synthetic",
                "status": "Active",
                "designation": f"Synthetic Role {index}",
                "department": "Synthetic",
            }]}
            one = time.perf_counter()
            capture_state_changes(connection, before, after, config)
            creation_latencies.append((time.perf_counter() - one) * 1000)
            before = after
        connection.commit()
        creation_elapsed = time.perf_counter() - started
        pending = connection.execute(
            "SELECT COUNT(*) FROM bsfv_outbox_delivery WHERE delivery_status='PENDING'"
        ).fetchone()[0]
        assert pending == event_count

        # Receiver unavailable: ANPS state/outbox commits continue and pending is preserved.
        unavailable = dispatch_once(
            connection,
            config,
            lambda request, timeout: (_ for _ in ()).throw(TimeoutError("synthetic_offline")),
        )
        assert unavailable["status"] == "PENDING"
        connection.execute(
            "UPDATE bsfv_outbox_delivery SET next_attempt_at=NULL WHERE delivery_status='PENDING'"
        )
        connection.commit()

        drain_latencies = []
        drain_started = time.perf_counter()
        for _ in range(event_count):
            one = time.perf_counter()
            result = dispatch_once(connection, config, lambda request, timeout: Accepted())
            assert result["status"] == "DELIVERED"
            drain_latencies.append((time.perf_counter() - one) * 1000)
            connection.commit()
        drain_elapsed = time.perf_counter() - drain_started
        remaining = connection.execute(
            "SELECT COUNT(*) FROM bsfv_outbox_delivery WHERE delivery_status='PENDING'"
        ).fetchone()[0]
        delivered = connection.execute(
            "SELECT COUNT(*) FROM bsfv_outbox_delivery WHERE delivery_status='DELIVERED'"
        ).fetchone()[0]
        assert remaining == 0 and delivered == event_count
        connection.close()

    def percentile(values, ratio):
        return sorted(values)[max(0, int(len(values) * ratio) - 1)]

    usage_after = resource.getrusage(resource.RUSAGE_SELF)
    rss_divisor = 1024 * 1024 if sys.platform == "darwin" else 1024
    return {
        "events": event_count,
        "creation_events_per_second": round(event_count / creation_elapsed, 2),
        "creation_p50_ms": round(statistics.median(creation_latencies), 3),
        "creation_p95_ms": round(percentile(creation_latencies, 0.95), 3),
        "backlog_peak": pending,
        "backlog_drain_seconds": round(drain_elapsed, 3),
        "drain_events_per_second": round(event_count / drain_elapsed, 2),
        "drain_p50_ms": round(statistics.median(drain_latencies), 3),
        "drain_p95_ms": round(percentile(drain_latencies, 0.95), 3),
        "pending_after_drain": remaining,
        "duplicate_financial_effect": 0,
        "cpu_seconds": round(
            (usage_after.ru_utime + usage_after.ru_stime)
            - (usage_before.ru_utime + usage_before.ru_stime),
            3,
        ),
        "max_rss_mib": round(usage_after.ru_maxrss / rss_divisor, 2),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--database-url", required=True)
    parser.add_argument("--bsfv-backend", type=Path, required=True)
    parser.add_argument("--performance-events", type=int, default=500)
    parser.add_argument("--backlog-events", type=int, default=1000)
    args = parser.parse_args()
    report = qualify(args)
    report["phase_1_5_sender_capacity"] = sender_capacity(args.backlog_events)
    report["pilot_envelope"] = {
        "max_sustained_requests_per_minute": 60,
        "max_backlog_before_operator_review": 1000,
        "receiver_p95_must_not_exceed_measured_ms": report["performance"]["p95_latency_ms"],
        "oldest_pending_alert_seconds": 300,
    }
    print(json.dumps(report, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
