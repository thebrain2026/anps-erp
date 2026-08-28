"""Local synthetic compatibility check against a frozen BSFV Phase 1.1 tree."""

import argparse
import json
import sqlite3
import sys
from pathlib import Path

from anps_bsfv_outbox import IntegrationConfig, capture_state_changes, initialize_outbox


def fee(payment_id="PAY-SYN-1", amount="100.00"):
    return {
        "id": payment_id,
        "receipt": "SYN/1",
        "date": "2026-08-28",
        "amount": amount,
        "cashAmount": amount,
        "discountAmount": "0",
        "allocations": [{"id": "L1", "head": "Synthetic Tuition", "month": "AUG", "amount": amount}],
    }


def fee_state(item=None):
    return {"collectedPayments": {"2026-27": {"ADM-SYN-1": [item or fee()]}}}


def staff(status="Active", designation="Teacher"):
    return {"staffMembers": [{
        "staffId": "STF-SYN-1", "name": "Synthetic Person", "status": status,
        "designation": designation, "department": "Synthetic",
    }]}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("bsfv_backend", type=Path)
    args = parser.parse_args()
    sys.path.insert(0, str(args.bsfv_backend.resolve()))
    from app.api.v1.schemas.integration import EventEnvelope
    from app.services.integration import validate_contract

    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    initialize_outbox(conn)
    config = IntegrationConfig(False, "", (), "", "", "school-synthetic", {"2026-27": "session-synthetic"})
    capture_state_changes(conn, {}, fee_state(), config)
    capture_state_changes(conn, fee_state(), fee_state(fee(amount="120.00")), config)
    capture_state_changes(conn, fee_state(fee(amount="120.00")), {}, config)
    capture_state_changes(conn, {}, staff(), config)
    capture_state_changes(conn, staff(), staff(designation="Principal"), config)
    capture_state_changes(conn, staff(designation="Principal"), staff(status="Disabled", designation="Principal"), config)
    rows = conn.execute("SELECT payload FROM bsfv_outbox_events ORDER BY created_at,source_version").fetchall()
    assert len(rows) == 6
    for row in rows:
        envelope = EventEnvelope.model_validate(json.loads(row["payload"]))
        outcome = validate_contract(envelope, ["session-synthetic"])
        assert outcome.accepted, outcome.error_code
    print("frozen BSFV Phase 1.1 contract: 6/6 synthetic lifecycle events accepted")


if __name__ == "__main__":
    main()
