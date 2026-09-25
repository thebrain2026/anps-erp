"""ANPS_WRITE_DISABLED freezes mutating API calls without breaking health."""

from __future__ import annotations

import importlib.util
import os
import sys
import types
from datetime import timezone
from pathlib import Path
from unittest import mock


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
    sys.modules.pop("anps_erp_backend_write_disabled_test", None)
    path = Path(__file__).resolve().parents[1] / "anps_erp_backend.py"
    spec = importlib.util.spec_from_file_location("anps_erp_backend_write_disabled_test", path)
    module = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    sys.modules["anps_erp_backend_write_disabled_test"] = module
    spec.loader.exec_module(module)
    return module


def test_write_disabled_defaults_off():
    with mock.patch.dict(os.environ, {}, clear=False):
        os.environ.pop("ANPS_WRITE_DISABLED", None)
        backend = _load_backend()
        assert backend.WRITE_DISABLED is False


def test_write_disabled_truthy_and_message():
    with mock.patch.dict(
        os.environ,
        {
            "ANPS_WRITE_DISABLED": "true",
            "ANPS_WRITE_DISABLED_MESSAGE": "",
            "ANPS_CANONICAL_LIVE_HOST": "",
        },
        clear=False,
    ):
        backend = _load_backend()
        assert backend.WRITE_DISABLED is True
        assert "thebrainerp.com" in backend.WRITE_DISABLED_MESSAGE
        assert backend.CANONICAL_LIVE_HOST == "https://anps.thebrainerp.com"


def test_authorized_write_returns_503_when_frozen():
    with mock.patch.dict(os.environ, {"ANPS_WRITE_DISABLED": "1"}, clear=False):
        backend = _load_backend()

        class FakeHandler:
            def __init__(self):
                self.payload = None
                self.status = None

            def json_response(self, payload, status=200):
                self.payload = payload
                self.status = status

        handler = FakeHandler()
        ok = backend.SchoolERPHandler.write_frozen_response(handler)
        assert ok is False
        assert handler.status == 503
        assert handler.payload["error"] == "write_disabled"
        assert handler.payload["maintenance"] is True
