"""Timetable merge: day replace, parallel languages, delete tombstones."""

from __future__ import annotations

import importlib.util
import sys
import types
from datetime import timezone
from pathlib import Path


def _install_import_stubs():
    if not hasattr(__import__("datetime"), "UTC"):
        import datetime as dt

        dt.UTC = timezone.utc  # type: ignore[attr-defined]

    def _noop(*_args, **_kwargs):
        return None

    outbox = types.ModuleType("anps_bsfv_outbox")
    outbox.IntegrationConfig = type("IntegrationConfig", (), {})
    outbox.capture_state_changes = _noop
    outbox.dispatcher_loop = _noop
    outbox.initialize_outbox = _noop
    outbox.pilot_metrics = _noop
    sys.modules["anps_bsfv_outbox"] = outbox

    db = types.ModuleType("anps_db")
    db.connect = _noop
    db.database_label = lambda *_a, **_k: "test"
    db.db_error_types = lambda: (Exception,)
    db.table_exists = lambda *_a, **_k: False
    db.table_has_column = lambda *_a, **_k: False
    db.using_postgres = lambda: False
    sys.modules["anps_db"] = db

    sys.modules.setdefault("psycopg", types.ModuleType("psycopg"))
    sys.modules.setdefault("psycopg2", types.ModuleType("psycopg2"))
    sys.modules.setdefault("rfc8785", types.ModuleType("rfc8785"))


def _load_backend():
    _install_import_stubs()
    sys.modules.pop("anps_erp_backend_under_test", None)
    path = Path(__file__).resolve().parents[1] / "anps_erp_backend.py"
    spec = importlib.util.spec_from_file_location("anps_erp_backend_under_test", path)
    module = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    sys.modules["anps_erp_backend_under_test"] = module
    spec.loader.exec_module(module)
    return module


def _entry(class_section, day, period, subject, teacher, updated_at, entry_id=None):
    return {
        "id": entry_id or f"{class_section}-{day}-P{period}-{subject}",
        "classSection": class_section,
        "day": day,
        "period": period,
        "subject": subject,
        "teacher": teacher,
        "updatedAt": updated_at,
        "source": "Main ERP",
    }


def test_newer_day_replace_drops_removed_period():
    backend = _load_backend()
    server = [
        _entry("Class IV Amber", "Wednesday", 1, "Science", "T1", "2026-09-20T10:00:00Z"),
        _entry("Class IV Amber", "Wednesday", 7, "Mathematics", "T2", "2026-09-20T10:00:00Z"),
        _entry("Class IV Amber", "Wednesday", 8, "Mathematics", "T2", "2026-09-20T10:00:00Z", "orphan-math"),
    ]
    incoming = [
        _entry("Class IV Amber", "Wednesday", 1, "Science", "T1", "2026-09-26T12:00:00Z"),
        _entry("Class IV Amber", "Wednesday", 7, "Mathematics", "T2", "2026-09-26T12:00:00Z"),
    ]
    merged = backend.merge_class_timetable_entries(server, incoming)
    periods = {(int(e["period"]), e["subject"]) for e in merged}
    assert periods == {(1, "Science"), (7, "Mathematics")}
    assert "orphan-math" not in {e["id"] for e in merged}


def test_parallel_hindi_bengali_same_period_both_kept():
    backend = _load_backend()
    server = [
        _entry("Class IV Amber", "Thursday", 5, "Hindi", "T1", "2026-09-20T10:00:00Z", "hindi"),
    ]
    incoming = [
        _entry("Class IV Amber", "Thursday", 5, "Hindi", "T1", "2026-09-26T12:00:00Z", "hindi"),
        _entry("Class IV Amber", "Thursday", 5, "Bengali", "T2", "2026-09-26T12:00:00Z", "bengali"),
    ]
    merged = backend.merge_class_timetable_entries(server, incoming)
    subjects = {e["subject"] for e in merged if int(e["period"]) == 5}
    assert subjects == {"Hindi", "Bengali"}


def test_same_period_same_subject_newer_wins():
    backend = _load_backend()
    server = [_entry("Class V A", "Tuesday", 1, "Eng", "T1", "2026-09-20T10:00:00Z", "a")]
    incoming = [_entry("Class V A", "Tuesday", 1, "Eng", "T9", "2026-09-24T12:00:00Z", "b")]
    merged = backend.merge_class_timetable_entries(server, incoming)
    assert len(merged) == 1
    assert merged[0]["id"] == "b"
    assert merged[0]["teacher"] == "T9"


def test_different_days_are_preserved():
    backend = _load_backend()
    server = [_entry("Class V A", "Monday", 1, "Eng", "T1", "2026-09-20T10:00:00Z")]
    incoming = [_entry("Class V A", "Tuesday", 1, "Math", "T2", "2026-09-24T12:00:00Z")]
    merged = backend.merge_class_timetable_entries(server, incoming)
    assert {e["day"] for e in merged} == {"Monday", "Tuesday"}


def test_older_client_cannot_overwrite_newer_day():
    backend = _load_backend()
    server = [
        _entry("Class V A", "Wednesday", 1, "Eng", "T1", "2026-09-24T15:00:00Z"),
        _entry("Class V A", "Wednesday", 2, "Math", "T2", "2026-09-24T15:00:00Z"),
    ]
    incoming = [_entry("Class V A", "Wednesday", 1, "Eng", "T1", "2026-09-10T10:00:00Z")]
    merged = backend.merge_class_timetable_entries(server, incoming)
    periods = {(int(e["period"]), e["subject"]) for e in merged if e["day"] == "Wednesday"}
    assert periods == {(1, "Eng"), (2, "Math")}


def test_deleted_ids_are_removed():
    backend = _load_backend()
    server = [
        _entry("Class IV Amber", "Thursday", 5, "Hindi", "T1", "2026-09-26T12:00:00Z", "keep"),
        _entry("Class IV Amber", "Thursday", 8, "Mathematics", "T2", "2026-09-26T12:00:00Z", "drop"),
    ]
    incoming = [
        _entry("Class IV Amber", "Thursday", 5, "Hindi", "T1", "2026-09-26T12:00:00Z", "keep"),
        _entry("Class IV Amber", "Thursday", 8, "Mathematics", "T2", "2026-09-26T12:00:00Z", "drop"),
    ]
    merged = backend.merge_class_timetable_entries(server, incoming, deleted_ids={"drop": "2026-09-26T12:01:00Z"})
    assert {e["id"] for e in merged} == {"keep"}
