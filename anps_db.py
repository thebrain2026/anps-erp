"""ANPS ERP DB connection: SQLite (default) or PostgreSQL (ANPS_DB_ENGINE=postgres)."""

from __future__ import annotations

import os
import re
import sqlite3
from pathlib import Path

DB_ENGINE = (os.environ.get("ANPS_DB_ENGINE") or "sqlite").strip().lower()
DATABASE_URL = (os.environ.get("DATABASE_URL") or os.environ.get("ANPS_DATABASE_URL") or "").strip()
DATA_DIR = Path(os.environ.get("ANPS_ERP_DATA_DIR", Path(__file__).resolve().parent / "anps-erp-data"))
DB_PATH = Path(os.environ.get("ANPS_ERP_DB", DATA_DIR / "anps_erp.db")).resolve()

_USE_POSTGRES = DB_ENGINE in {"postgres", "postgresql", "pg"} and bool(DATABASE_URL)


def using_postgres() -> bool:
    return _USE_POSTGRES


def database_label() -> str:
    if _USE_POSTGRES:
        return "postgresql"
    return str(DB_PATH)


def _rewrite_sql_for_postgres(sql: str) -> str:
    text = sql
    text = text.replace("?", "%s")
    text = re.sub(r"\bCOLLATE\s+NOCASE\b", "", text, flags=re.IGNORECASE)
    text = re.sub(
        r"INSERT\s+OR\s+REPLACE\s+INTO\s+auth_sessions\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)",
        r"INSERT INTO auth_sessions (\1) VALUES (\2) "
        r"ON CONFLICT (token) DO UPDATE SET "
        r"user_json = EXCLUDED.user_json, expires_at = EXCLUDED.expires_at",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )
    text = re.sub(r"\bexcluded\.", "EXCLUDED.", text)
    # ANPS stores timestamps as TEXT; avoid timestamp-vs-text operator errors.
    text = re.sub(
        r"\bCURRENT_TIMESTAMP\b",
        "CAST(CURRENT_TIMESTAMP AS TEXT)",
        text,
        flags=re.IGNORECASE,
    )
    return text


def _rewrite_ddl_for_postgres(script: str) -> str:
    text = script
    text = re.sub(
        r"INTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT",
        "BIGSERIAL PRIMARY KEY",
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(r"\bCOLLATE\s+NOCASE\b", "", text, flags=re.IGNORECASE)
    text = re.sub(
        r"\bCURRENT_TIMESTAMP\b",
        "CAST(CURRENT_TIMESTAMP AS TEXT)",
        text,
        flags=re.IGNORECASE,
    )
    return text


class CompatRow:
    """sqlite3.Row-like: supports both row['col'] and row[0]."""

    __slots__ = ("_names", "_values", "_map")

    def __init__(self, names, values):
        self._names = names
        self._values = values
        self._map = dict(zip(names, values))

    def __getitem__(self, key):
        if isinstance(key, int):
            return self._values[key]
        return self._map[key]

    def __iter__(self):
        return iter(self._values)

    def keys(self):
        return self._names

    def get(self, key, default=None):
        return self._map.get(key, default)


def _compat_row_factory(cursor):
    names = [col.name for col in cursor.description] if cursor.description else []

    def make_row(values):
        return CompatRow(names, values)

    return make_row


class _PgCursor:
    def __init__(self, cur):
        self._cur = cur

    def fetchone(self):
        return self._cur.fetchone()

    def fetchall(self):
        return self._cur.fetchall()

    def __iter__(self):
        return iter(self._cur)


class _PgConnection:
    def __init__(self, conn):
        self._conn = conn

    def execute(self, sql, params=None):
        sql_pg = _rewrite_sql_for_postgres(sql)
        if params is None:
            cur = self._conn.execute(sql_pg)
        else:
            cur = self._conn.execute(sql_pg, tuple(params))
        return _PgCursor(cur)

    def executescript(self, script: str):
        rewritten = _rewrite_ddl_for_postgres(script)
        parts = [p.strip() for p in rewritten.split(";")]
        for part in parts:
            if part:
                self._conn.execute(part)

    def commit(self):
        self._conn.commit()

    def rollback(self):
        self._conn.rollback()

    def close(self):
        self._conn.close()

    def __enter__(self):
        self._conn.__enter__()
        return self

    def __exit__(self, exc_type, exc, tb):
        return self._conn.__exit__(exc_type, exc, tb)


def connect():
    if _USE_POSTGRES:
        import psycopg

        raw = psycopg.connect(DATABASE_URL, row_factory=_compat_row_factory)
        return _PgConnection(raw)

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, timeout=20)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA busy_timeout = 5000")
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def table_has_column(conn, table, column):
    if _USE_POSTGRES:
        row = conn.execute(
            """
            SELECT 1 AS ok
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = ? AND column_name = ?
            """,
            (table, column),
        ).fetchone()
        return bool(row)
    return any(row["name"] == column for row in conn.execute(f"PRAGMA table_info({table})").fetchall())


def table_exists(conn, table: str) -> bool:
    if _USE_POSTGRES:
        row = conn.execute(
            """
            SELECT 1 AS ok
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = ?
            """,
            (table,),
        ).fetchone()
        return bool(row)
    row = conn.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name = ?",
        (table,),
    ).fetchone()
    return bool(row)


def db_error_types():
    types = [sqlite3.Error]
    if _USE_POSTGRES:
        try:
            import psycopg

            types.append(psycopg.Error)
        except Exception:
            pass
    return tuple(types)
