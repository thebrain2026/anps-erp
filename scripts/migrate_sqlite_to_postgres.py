#!/usr/bin/env python3
"""One-shot: copy ANPS app_state (+ optional table rebuild) from SQLite → Postgres.

Usage (inside web container or host with deps):
  ANPS_DB_ENGINE=postgres DATABASE_URL=postgresql://... \\
    python scripts/migrate_sqlite_to_postgres.py /path/to/anps_erp.db

Does NOT touch other projects' databases.
"""

from __future__ import annotations

import argparse
import json
import os
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("sqlite_path", type=Path)
    args = parser.parse_args()

    os.environ["ANPS_DB_ENGINE"] = "postgres"
    if not (os.environ.get("DATABASE_URL") or os.environ.get("ANPS_DATABASE_URL")):
        raise SystemExit("DATABASE_URL is required")

    from anps_db import connect, using_postgres
    from anps_erp_backend import STATE_KEY, init_db, sync_state_tables, ensure_state_school

    if not using_postgres():
        raise SystemExit("engine did not select postgres")

    sqlite_path = args.sqlite_path.resolve()
    if not sqlite_path.exists():
        raise SystemExit(f"missing sqlite file: {sqlite_path}")

    src = sqlite3.connect(f"file:{sqlite_path}?mode=ro", uri=True)
    src.row_factory = sqlite3.Row
    row = src.execute(
        "SELECT value, updated_at FROM app_state WHERE key = ?",
        (STATE_KEY,),
    ).fetchone()
    src.close()
    if not row:
        raise SystemExit("no app_state row in sqlite")

    state = ensure_state_school(json.loads(row["value"]))
    print(f"loaded app_state bytes={len(row['value'])} updated_at={row['updated_at']}")

    init_db()
    with connect() as conn:
        conn.execute(
            """
            INSERT INTO app_state (key, value, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(key) DO UPDATE SET
                value = excluded.value,
                updated_at = excluded.updated_at
            """,
            (STATE_KEY, json.dumps(state, ensure_ascii=False, separators=(",", ":")), row["updated_at"]),
        )
        sync_state_tables(conn, state)
        conn.commit()

    with connect() as conn:
        students = conn.execute("SELECT COUNT(*) FROM students").fetchone()[0]
        receipts = conn.execute("SELECT COUNT(*) FROM fee_receipts").fetchone()[0]
        staff = conn.execute("SELECT COUNT(*) FROM staff_members").fetchone()[0]
    print(f"migrate_ok students={students} fee_receipts={receipts} staff={staff}")


if __name__ == "__main__":
    main()
