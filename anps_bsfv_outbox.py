"""ANPS -> BSFV transactional outbox foundation.

Delivery is deliberately disabled unless every production safety condition is
explicitly configured. Event facts are immutable; mutable delivery state lives
in a separate table.
"""

import base64
import hashlib
import hmac
import json
import os
import random
import re
import stat
import urllib.error
import urllib.request
import uuid
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from decimal import Decimal, InvalidOperation
from pathlib import Path
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo

import rfc8785


EVENT_TYPES = {
    "anps.fee_collection.created",
    "anps.fee_collection.baseline",
    "anps.fee_collection.corrected",
    "anps.fee_collection.voided",
    "anps.staff.created",
    "anps.staff.updated",
    "anps.staff.deactivated",
}
FORBIDDEN_KEYS = {
    "password", "passwordhash", "authtoken", "sessiontoken", "admincredentials",
    "biometricdata", "biometricid", "guardian", "guardiancontact", "phone", "mobile",
    "email", "photo", "attendance", "salary", "bankaccount", "payrollbank",
}
RETRYABLE_HTTP = {429, 500, 502, 503, 504}
NON_RETRYABLE_HTTP = {400, 401, 403, 409, 413, 415, 422}
MAX_ATTEMPTS = 12
BACKOFF_SECONDS = (5, 30, 120, 600, 3600, 21600, 43200, 86400)
INGESTION_PATH = "/api/v1/integrations/anps/events"
RENDER_SECRETS_DIR = Path("/etc/secrets")
ANPS_TIMEZONE = ZoneInfo("Asia/Kolkata")


SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS bsfv_source_versions (
    aggregate_type TEXT NOT NULL,
    aggregate_id TEXT NOT NULL,
    source_version INTEGER NOT NULL CHECK(source_version > 0),
    updated_at TEXT NOT NULL,
    PRIMARY KEY (aggregate_type, aggregate_id)
);
CREATE TABLE IF NOT EXISTS bsfv_outbox_events (
    outbox_id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL UNIQUE,
    mutation_key TEXT NOT NULL UNIQUE,
    schema_version TEXT NOT NULL,
    event_type TEXT NOT NULL,
    source_system TEXT NOT NULL,
    source_record_id TEXT NOT NULL,
    aggregate_type TEXT NOT NULL,
    aggregate_id TEXT NOT NULL,
    source_version INTEGER NOT NULL CHECK(source_version > 0),
    school_id TEXT NOT NULL,
    session_id TEXT,
    occurred_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    payload TEXT NOT NULL,
    payload_hash TEXT NOT NULL,
    trace_id TEXT,
    blocked_reason TEXT,
    UNIQUE (aggregate_type, aggregate_id, source_version)
);
CREATE TABLE IF NOT EXISTS bsfv_outbox_delivery (
    outbox_id TEXT PRIMARY KEY REFERENCES bsfv_outbox_events(outbox_id) ON DELETE RESTRICT,
    delivery_status TEXT NOT NULL CHECK(delivery_status IN ('PENDING','BLOCKED','IN_FLIGHT','DELIVERED','DEAD_LETTER')),
    attempt_count INTEGER NOT NULL DEFAULT 0 CHECK(attempt_count >= 0),
    next_attempt_at TEXT,
    last_attempt_at TEXT,
    delivered_at TEXT,
    dead_letter_at TEXT,
    failure_code TEXT,
    response_class TEXT,
    delivery_latency_ms INTEGER,
    updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_bsfv_outbox_delivery_ready
    ON bsfv_outbox_delivery(delivery_status, next_attempt_at);
CREATE INDEX IF NOT EXISTS idx_bsfv_outbox_event_aggregate
    ON bsfv_outbox_events(aggregate_type, aggregate_id, source_version);
CREATE TABLE IF NOT EXISTS bsfv_outbox_metrics (
    name TEXT PRIMARY KEY,
    value INTEGER NOT NULL DEFAULT 0 CHECK(value >= 0)
);
CREATE TRIGGER IF NOT EXISTS bsfv_outbox_events_no_update
BEFORE UPDATE ON bsfv_outbox_events BEGIN
    SELECT RAISE(ABORT, 'immutable_outbox_event');
END;
CREATE TRIGGER IF NOT EXISTS bsfv_outbox_events_no_delete
BEFORE DELETE ON bsfv_outbox_events BEGIN
    SELECT RAISE(ABORT, 'immutable_outbox_event');
END;
CREATE TABLE IF NOT EXISTS bsfv_outbox_recovery_events (
    recovery_id TEXT PRIMARY KEY,
    original_outbox_id TEXT NOT NULL UNIQUE REFERENCES bsfv_outbox_events(outbox_id) ON DELETE RESTRICT,
    event_id TEXT NOT NULL UNIQUE,
    payload TEXT NOT NULL,
    payload_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS bsfv_outbox_recovery_delivery (
    recovery_id TEXT PRIMARY KEY REFERENCES bsfv_outbox_recovery_events(recovery_id) ON DELETE RESTRICT,
    delivery_status TEXT NOT NULL CHECK(delivery_status IN ('PENDING','IN_FLIGHT','DELIVERED','DEAD_LETTER')),
    attempt_count INTEGER NOT NULL DEFAULT 0 CHECK(attempt_count >= 0),
    next_attempt_at TEXT,
    last_attempt_at TEXT,
    delivered_at TEXT,
    dead_letter_at TEXT,
    failure_code TEXT,
    response_class TEXT,
    delivery_latency_ms INTEGER,
    updated_at TEXT NOT NULL
);
CREATE TRIGGER IF NOT EXISTS bsfv_outbox_recovery_events_no_update
BEFORE UPDATE ON bsfv_outbox_recovery_events BEGIN
    SELECT RAISE(ABORT, 'immutable_recovery_event');
END;
CREATE TRIGGER IF NOT EXISTS bsfv_outbox_recovery_events_no_delete
BEFORE DELETE ON bsfv_outbox_recovery_events BEGIN
    SELECT RAISE(ABORT, 'immutable_recovery_event');
END;
"""


@dataclass(frozen=True)
class IntegrationConfig:
    enabled: bool
    endpoint: str
    approved_endpoints: tuple[str, ...]
    key_id: str
    secret: str
    school_id: str
    session_map: dict[str, str]
    source_system: str = "anps"
    secret_provider: str = "disabled"
    access_client_id: str = ""
    access_client_secret: str = ""
    allowed_event_types: tuple[str, ...] = ()
    pilot_not_before: str = ""

    @classmethod
    def from_env(cls):
        raw_map = os.environ.get("ANPS_BSFV_SESSION_MAP", "").strip()
        try:
            session_map = json.loads(raw_map) if raw_map else {}
        except json.JSONDecodeError:
            session_map = {}
        provider = os.environ.get("ANPS_BSFV_SECRET_PROVIDER", "disabled").strip().lower()
        key_id = os.environ.get("ANPS_BSFV_KEY_ID", "").strip()
        secret = ""
        if provider == "synthetic":
            secret = os.environ.get("ANPS_BSFV_HMAC_SECRET", "").strip()
        elif provider == "external":
            secret = _read_external_secret(os.environ.get("ANPS_BSFV_HMAC_SECRET_FILE", ""), key_id)
        access_client_id = _read_secret_file(
            os.environ.get("ANPS_BSFV_CF_ACCESS_CLIENT_ID_FILE", ""),
            "cf-access-client-id",
            16,
        ) if provider == "external" else ""
        access_client_secret = _read_secret_file(
            os.environ.get("ANPS_BSFV_CF_ACCESS_CLIENT_SECRET_FILE", ""),
            "cf-access-client-secret",
            32,
        ) if provider == "external" else ""
        return cls(
            enabled=os.environ.get("ANPS_BSFV_INTEGRATION_ENABLED", "false").lower() == "true",
            endpoint=os.environ.get("ANPS_BSFV_ENDPOINT", "").strip(),
            approved_endpoints=tuple(filter(None, (item.strip() for item in os.environ.get("ANPS_BSFV_APPROVED_ENDPOINTS", "").split(",")))),
            key_id=key_id,
            secret=secret,
            school_id=os.environ.get("ANPS_BSFV_SCHOOL_ID", "").strip(),
            session_map=session_map if isinstance(session_map, dict) else {},
            source_system=os.environ.get("ANPS_BSFV_SOURCE_SYSTEM", "anps").strip() or "anps",
            secret_provider=provider,
            access_client_id=access_client_id,
            access_client_secret=access_client_secret,
            allowed_event_types=tuple(
                filter(
                    None,
                    (
                        item.strip()
                        for item in os.environ.get(
                            "ANPS_BSFV_ALLOWED_EVENT_TYPES", ""
                        ).split(",")
                    ),
                )
            ),
            pilot_not_before=_canonical_utc_timestamp(
                os.environ.get("ANPS_BSFV_PILOT_NOT_BEFORE", "")
            ),
        )

    def refusal_code(self):
        if not self.enabled:
            return "integration_disabled"
        if self.secret_provider not in {"external", "synthetic"}:
            return "secret_provider_unavailable"
        if not self.endpoint or self.endpoint not in self.approved_endpoints:
            return "endpoint_not_approved"
        parsed = urlsplit(self.endpoint)
        if (
            parsed.scheme != "https"
            or not parsed.hostname
            or parsed.username
            or parsed.password
            or parsed.query
            or parsed.fragment
            or parsed.path != INGESTION_PATH
        ):
            return "tls_required"
        if not self.key_id:
            return "key_id_missing"
        if not self.secret:
            return "hmac_secret_missing"
        if self.secret_provider == "external" and (
            not self.access_client_id or not self.access_client_secret
        ):
            return "edge_service_credentials_missing"
        if not self.school_id:
            return "school_mapping_missing"
        if not self.allowed_event_types or any(
            event_type not in EVENT_TYPES for event_type in self.allowed_event_types
        ):
            return "event_type_allowlist_missing_or_invalid"
        if not self.pilot_not_before:
            return "pilot_activation_cutoff_missing_or_invalid"
        return None


def _canonical_utc_timestamp(value):
    try:
        parsed = datetime.fromisoformat(str(value).strip().replace("Z", "+00:00"))
    except ValueError:
        return ""
    if parsed.tzinfo is None:
        return ""
    return parsed.astimezone(UTC).isoformat().replace("+00:00", "Z")


def _read_secret_file(filename, expected_name, minimum_length):
    """Read one exact external secret file and fail closed on unsafe metadata."""
    if not filename or not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]{0,127}", expected_name):
        return ""
    path = Path(filename)
    try:
        if not path.is_absolute() or not path.is_file():
            return ""
        if path.name != expected_name:
            return ""
        resolved = path.resolve(strict=True)
        metadata = path.stat()
        mode = stat.S_IMODE(metadata.st_mode)
        if path.is_symlink():
            if not _is_render_managed_secret(path, resolved, metadata, mode):
                return ""
        elif mode & 0o077:
            return ""
        if metadata.st_size > 4096:
            return ""
        value = path.read_text(encoding="utf-8").strip()
    except (OSError, UnicodeError):
        return ""
    return value if len(value) >= minimum_length else ""


def _is_render_managed_secret(path, resolved, metadata, mode):
    """Accept only Render's exact, read-only /etc/secrets projection shape."""
    try:
        relative_target = resolved.relative_to(RENDER_SECRETS_DIR)
    except ValueError:
        return False
    return (
        path.parent == RENDER_SECRETS_DIR
        and len(relative_target.parts) == 2
        and re.fullmatch(
            r"\.\.\d{4}_\d{2}_\d{2}_\d{2}_\d{2}_\d{2}\.\d+",
            relative_target.parts[0],
        )
        and relative_target.parts[1] == path.name
        and stat.S_ISREG(metadata.st_mode)
        and mode == 0o640
        and metadata.st_uid in {0, os.geteuid()}
        and metadata.st_gid in os.getgroups()
        and os.access(path, os.R_OK)
    )


def _read_external_secret(filename, expected_key_id):
    """Read the HMAC file whose basename must equal its approved key ID."""
    return _read_secret_file(filename, expected_key_id, 32)


def utc_now():
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


def b64url(value):
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def canonical_bytes(document):
    return rfc8785.dumps(document)


def payload_digest(canonical):
    return b64url(hashlib.sha256(canonical).digest())


def sign_headers(document, config, signed_at=None):
    signed_at = signed_at or utc_now()
    digest = payload_digest(canonical_bytes(document))
    signing_input = f"POST\n{INGESTION_PATH}\n{config.key_id}\n{signed_at}\n{document['event_id']}\n{digest}\n".encode()
    signature = b64url(hmac.new(config.secret.encode(), signing_input, hashlib.sha256).digest())
    headers = {
        "Content-Type": "application/json",
        "X-ANPS-Key-ID": config.key_id,
        "X-ANPS-Signed-At": signed_at,
        "X-ANPS-Event-ID": document["event_id"],
        "X-ANPS-Payload-SHA256": digest,
        "X-ANPS-Signature": f"v1={signature}",
    }
    if config.access_client_id and config.access_client_secret:
        headers["CF-Access-Client-Id"] = config.access_client_id
        headers["CF-Access-Client-Secret"] = config.access_client_secret
    return headers


def initialize_outbox(conn):
    conn.executescript(SCHEMA_SQL)


def _metric(conn, name, amount=1):
    conn.execute(
        "INSERT INTO bsfv_outbox_metrics(name,value) VALUES (?,?) "
        "ON CONFLICT(name) DO UPDATE SET value=value+excluded.value",
        (name, amount),
    )


def _normalized_key(value):
    return "".join(ch for ch in str(value).lower() if ch.isalnum())


def _contains_forbidden(value):
    if isinstance(value, dict):
        return any(_normalized_key(key) in FORBIDDEN_KEYS or _contains_forbidden(item) for key, item in value.items())
    if isinstance(value, list):
        return any(_contains_forbidden(item) for item in value)
    return False


def _decimal(value):
    if isinstance(value, float):
        raise ValueError("money_must_not_be_float")
    try:
        amount = Decimal(str(value or "0").replace(",", ""))
    except InvalidOperation as exc:
        raise ValueError("invalid_money") from exc
    if not amount.is_finite() or amount.as_tuple().exponent < -2:
        raise ValueError("invalid_money")
    return format(amount.quantize(Decimal("0.01")), ".2f")


def _fee_records(state):
    records = {}
    for session, students in (state.get("collectedPayments") or {}).items():
        if not isinstance(students, dict):
            continue
        for admission_no, payments in students.items():
            for payment in payments or []:
                if not isinstance(payment, dict):
                    continue
                payment_id = str(payment.get("id") or "").strip()
                if payment_id:
                    records[payment_id] = (str(session), str(admission_no), payment)
    return records


def _staff_records(state):
    records = {}
    for staff in state.get("staffMembers") or state.get("staff") or []:
        if not isinstance(staff, dict):
            continue
        staff_id = str(staff.get("staffId") or staff.get("id") or staff.get("staff_id") or "").strip()
        if staff_id:
            records[staff_id] = staff
    return records


def _stable(value):
    return json.dumps(value, sort_keys=True, ensure_ascii=False, separators=(",", ":"))


def _parse_business_datetime(value):
    """Parse ANPS business time without treating India-local values as UTC."""
    if isinstance(value, datetime):
        parsed = value
    else:
        text = str(value or "").strip()
        if not text:
            return datetime.now(UTC)
        parsed = None
        for pattern in (
            "%d-%m-%YT%H:%M:%SZ",
            "%d-%m-%YT%H:%M:%S",
            "%d-%m-%Y %H:%M:%S",
            "%d-%m-%Y",
        ):
            try:
                parsed = datetime.strptime(text, pattern)
                break
            except ValueError:
                pass
        if parsed is None:
            try:
                parsed = datetime.fromisoformat(text.replace("Z", "+00:00"))
            except ValueError as exc:
                raise ValueError("invalid_business_datetime") from exc
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=ANPS_TIMEZONE)
    return parsed


def _rfc3339(value):
    return _parse_business_datetime(value).isoformat(timespec="seconds")


def _business_date(value):
    return _parse_business_datetime(value).astimezone(ANPS_TIMEZONE).date().isoformat()


def _occurred_at(value):
    return _rfc3339(value)


def _fee_payload(payment_id, session, admission_no, payment, reason=None):
    allocations = []
    for index, item in enumerate(payment.get("allocations") or []):
        if not isinstance(item, dict):
            continue
        amount = _decimal(item.get("amount"))
        if Decimal(amount) <= 0:
            continue
        allocations.append({
            "line_id": str(item.get("id") or f"{payment_id}:{index + 1}"),
            "fee_head_id": str(item.get("feeHeadId")) if item.get("feeHeadId") else None,
            "fee_head_name": str(item.get("head") or item.get("feeHead") or "").strip(),
            "fee_month": str(item.get("month") or "").strip() or None,
            "amount": amount,
        })
    allocations.sort(
        key=lambda item: (
            item["line_id"],
            item["fee_head_id"] or "",
            item["fee_head_name"],
            item["fee_month"] or "",
            item["amount"],
        )
    )
    cash = _decimal(payment.get("cashAmount"))
    bank = _decimal(payment.get("bankAmount"))
    tenders = []
    if Decimal(cash) > 0:
        tenders.append({"type": "cash", "amount": cash})
    if Decimal(bank) > 0:
        bank_tender = {"type": "bank", "amount": bank}
        source_bank_id = str(
            payment.get("bankAccountId") or payment.get("bank_account_id") or ""
        ).strip()
        if not source_bank_id:
            raise ValueError("source_bank_id_required")
        bank_tender["source_bank_id"] = source_bank_id
        tenders.append(bank_tender)
    net_paid = _decimal(payment.get("amount") or (Decimal(cash) + Decimal(bank)))
    discount = _decimal(payment.get("discountAmount"))
    payload = {
        "session": session,
        "payment_id": payment_id,
        "receipt_no": str(payment.get("receipt") or "").strip(),
        "admission_no": admission_no,
        "payment_date": _business_date(payment.get("date")),
        "currency": "INR",
        "net_paid": net_paid,
        "discount": discount,
        "tenders": tenders,
        "allocations": allocations,
        "reason": reason,
    }
    if not payload["receipt_no"] or not payload["payment_date"] or not tenders or not allocations:
        raise ValueError("incomplete_fee_identity_or_breakdown")
    if sum((Decimal(item["amount"]) for item in tenders), Decimal(0)) != Decimal(net_paid):
        raise ValueError("tender_total_mismatch")
    if sum((Decimal(item["amount"]) for item in allocations), Decimal(0)) != Decimal(net_paid) + Decimal(discount):
        raise ValueError("allocation_total_mismatch")
    return payload


def build_fee_baseline_envelope(conn, payment_id, session, admission_no, payment, config=None):
    """Build, but never enqueue or transmit, an explicitly versioned final-state baseline."""
    config = config or IntegrationConfig.from_env()
    row = conn.execute(
        "SELECT source_version FROM bsfv_source_versions "
        "WHERE aggregate_type='fee_collection' AND aggregate_id=?",
        (payment_id,),
    ).fetchone()
    if not row or int(row[0]) < 1:
        raise ValueError("baseline_source_version_missing")
    data = _fee_payload(payment_id, session, admission_no, payment)
    now = utc_now()
    envelope = {
        "contract": "school-finance-integration",
        "schema_version": "1.0",
        "event_id": uuid.uuid4().hex,
        "event_type": "anps.fee_collection.baseline",
        "source_system": config.source_system,
        "source_record_id": payment_id,
        "aggregate_type": "fee_collection",
        "aggregate_id": payment_id,
        "source_version": int(row[0]),
        "school_id": config.school_id,
        "created_at": now,
        "occurred_at": _occurred_at(payment.get("date")),
        "published_at": now,
        "trace_id": uuid.uuid4().hex,
        "data": data,
    }
    if session:
        envelope["data"]["session"] = config.session_map.get(session, session)
    if _contains_forbidden(envelope["data"]):
        raise ValueError("invalid_or_sensitive_event")
    return envelope


def _staff_payload(staff_id, staff, reason=None):
    status = str(staff.get("status") or ("Disabled" if staff.get("disabled") else "Active")).lower()
    if status not in {"active", "disabled", "inactive"}:
        status = "active"
    return {
        "staff_id": staff_id,
        "employee_code": str(staff.get("employeeCode") or "").strip() or None,
        "display_name": str(staff.get("name") or staff.get("staffName") or "").strip(),
        "employment_status": status,
        "department": str(staff.get("department") or "").strip() or None,
        "designation": str(staff.get("designation") or "").strip() or None,
        "role_name": str(staff.get("role") or staff.get("roleName") or "").strip() or None,
        "joining_date": str(staff.get("joiningDate") or "")[:10] or None,
        "leaving_date": str(staff.get("leavingDate") or "")[:10] or None,
        "reason": reason,
    }


def _next_version(conn, aggregate_type, aggregate_id, now):
    row = conn.execute(
        "SELECT source_version FROM bsfv_source_versions WHERE aggregate_type=? AND aggregate_id=?",
        (aggregate_type, aggregate_id),
    ).fetchone()
    version = (row[0] if row else 0) + 1
    conn.execute(
        "INSERT INTO bsfv_source_versions VALUES (?,?,?,?) ON CONFLICT(aggregate_type,aggregate_id) DO UPDATE SET source_version=excluded.source_version, updated_at=excluded.updated_at",
        (aggregate_type, aggregate_id, version, now),
    )
    return version


def _insert_event(conn, event_type, aggregate_type, aggregate_id, data, config, session_id=None, occurred_at=None):
    if event_type not in EVENT_TYPES or _contains_forbidden(data):
        raise ValueError("invalid_or_sensitive_event")
    now = utc_now()
    mutation_hash = hashlib.sha256(_stable({"event_type": event_type, "aggregate_id": aggregate_id, "data": data}).encode()).hexdigest()
    mutation_key = f"{aggregate_type}:{aggregate_id}:{mutation_hash}"
    if conn.execute("SELECT 1 FROM bsfv_outbox_events WHERE mutation_key=?", (mutation_key,)).fetchone():
        _metric(conn, "duplicate_accepted")
        return False
    version = _next_version(conn, aggregate_type, aggregate_id, now)
    event_id = uuid.uuid4().hex
    trace_id = uuid.uuid4().hex
    envelope = {
        "contract": "school-finance-integration", "schema_version": "1.0", "event_id": event_id,
        "event_type": event_type, "source_system": config.source_system,
        "source_record_id": aggregate_id, "aggregate_type": aggregate_type, "aggregate_id": aggregate_id,
        "source_version": version, "school_id": config.school_id,
        "created_at": now, "occurred_at": _occurred_at(occurred_at), "published_at": now,
        "trace_id": trace_id, "data": data,
    }
    canonical = canonical_bytes(envelope)
    blocked = None
    if not config.school_id:
        blocked = "school_mapping_missing"
    if session_id and not config.session_map.get(session_id):
        blocked = "session_mapping_missing"
    if session_id:
        envelope["data"]["session"] = config.session_map.get(session_id, session_id)
        canonical = canonical_bytes(envelope)
    outbox_id = uuid.uuid4().hex
    conn.execute(
        "INSERT INTO bsfv_outbox_events VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        (outbox_id, event_id, mutation_key, "1.0", event_type, config.source_system, aggregate_id,
         aggregate_type, aggregate_id, version, config.school_id, config.session_map.get(session_id) if session_id else None,
         _occurred_at(occurred_at), now, canonical.decode(), payload_digest(canonical), trace_id, blocked),
    )
    status = "BLOCKED" if blocked else "PENDING"
    conn.execute(
        "INSERT INTO bsfv_outbox_delivery(outbox_id,delivery_status,next_attempt_at,failure_code,updated_at) VALUES (?,?,?,?,?)",
        (outbox_id, status, now if status == "PENDING" else None, blocked, now),
    )
    _metric(conn, "created")
    return True


def capture_state_changes(conn, old_state, new_state, config=None):
    config = config or IntegrationConfig.from_env()
    old_state, new_state = old_state or {}, new_state or {}
    missing_payment_ids = sum(
        1
        for students in (new_state.get("collectedPayments") or {}).values()
        if isinstance(students, dict)
        for payments in students.values()
        for payment in (payments or [])
        if isinstance(payment, dict) and not str(payment.get("id") or "").strip()
    )
    missing_staff_ids = sum(
        1
        for staff in (new_state.get("staffMembers") or new_state.get("staff") or [])
        if isinstance(staff, dict)
        and not str(staff.get("staffId") or staff.get("id") or staff.get("staff_id") or "").strip()
    )
    if missing_payment_ids:
        _metric(conn, "blocked_missing_payment_identity", missing_payment_ids)
    if missing_staff_ids:
        _metric(conn, "blocked_missing_staff_identity", missing_staff_ids)
    old_fees, new_fees = _fee_records(old_state), _fee_records(new_state)
    for payment_id in sorted(new_fees):
        session, admission, payment = new_fees[payment_id]
        prior = old_fees.get(payment_id)
        if prior:
            prior_session, prior_admission, prior_payment = prior
            try:
                prior_finance_state = _fee_payload(
                    payment_id, prior_session, prior_admission, prior_payment
                )
                current_finance_state = _fee_payload(
                    payment_id, session, admission, payment
                )
            except ValueError:
                _metric(conn, "blocked_invalid_fee_contract")
                continue
            if _stable(prior_finance_state) == _stable(current_finance_state):
                continue
        lifecycle = "corrected" if prior else "created"
        reason = "Source payment corrected" if prior else None
        try:
            data = _fee_payload(payment_id, session, admission, payment, reason)
            _insert_event(conn, f"anps.fee_collection.{lifecycle}", "fee_collection", payment_id, data, config, session, payment.get("date"))
        except ValueError:
            _metric(conn, "blocked_invalid_fee_contract")
            continue
    for payment_id in sorted(set(old_fees) - set(new_fees)):
        session, admission, payment = old_fees[payment_id]
        try:
            data = _fee_payload(payment_id, session, admission, payment, "Source payment voided")
            _insert_event(conn, "anps.fee_collection.voided", "fee_collection", payment_id, data, config, session)
        except ValueError:
            _metric(conn, "blocked_invalid_fee_contract")
            continue
    old_staff, new_staff = _staff_records(old_state), _staff_records(new_state)
    for staff_id in sorted(new_staff):
        prior = old_staff.get(staff_id)
        if prior and _stable(prior) == _stable(new_staff[staff_id]):
            continue
        data = _staff_payload(staff_id, new_staff[staff_id])
        if not data["display_name"]:
            _metric(conn, "blocked_invalid_staff_contract")
            continue
        old_status = str((prior or {}).get("status") or "active").lower()
        if prior and old_status == "active" and data["employment_status"] in {"disabled", "inactive"}:
            lifecycle, data["reason"] = "deactivated", "Source staff deactivated"
        else:
            lifecycle = "updated" if prior else "created"
        _insert_event(conn, f"anps.staff.{lifecycle}", "staff", staff_id, data, config)
    for staff_id in sorted(set(old_staff) - set(new_staff)):
        data = _staff_payload(staff_id, old_staff[staff_id], "Source staff deactivated")
        data["employment_status"] = "inactive"
        _insert_event(conn, "anps.staff.deactivated", "staff", staff_id, data, config)


def _retry_at(attempt):
    cap = BACKOFF_SECONDS[min(max(attempt - 1, 0), len(BACKOFF_SECONDS) - 1)]
    return (datetime.now(UTC) + timedelta(seconds=random.uniform(0, cap))).isoformat().replace("+00:00", "Z")


def prepare_dead_letter_recovery(conn, original_outbox_id):
    """Create immutable replacement evidence without changing the dead letter."""
    initialize_outbox(conn)
    row = conn.execute(
        "SELECT e.*,d.delivery_status,d.failure_code FROM bsfv_outbox_events e "
        "JOIN bsfv_outbox_delivery d USING(outbox_id) WHERE e.outbox_id=?",
        (original_outbox_id,),
    ).fetchone()
    if not row or row["delivery_status"] != "DEAD_LETTER":
        raise ValueError("recovery_requires_dead_letter")
    if row["failure_code"] != "http_400" or row["event_type"] != "anps.fee_collection.created":
        raise ValueError("recovery_scope_not_approved")
    existing = conn.execute(
        "SELECT recovery_id FROM bsfv_outbox_recovery_events WHERE original_outbox_id=?",
        (original_outbox_id,),
    ).fetchone()
    if existing:
        return existing[0]
    document = json.loads(row["payload"])
    document["event_id"] = uuid.uuid4().hex
    document["occurred_at"] = _rfc3339(document["occurred_at"])
    document["data"]["payment_date"] = _business_date(document["data"]["payment_date"])
    now = utc_now()
    document["created_at"] = now
    document["published_at"] = now
    canonical = canonical_bytes(document)
    recovery_id = uuid.uuid4().hex
    conn.execute(
        "INSERT INTO bsfv_outbox_recovery_events VALUES (?,?,?,?,?,?)",
        (recovery_id, original_outbox_id, document["event_id"], canonical.decode(),
         payload_digest(canonical), now),
    )
    conn.execute(
        "INSERT INTO bsfv_outbox_recovery_delivery"
        "(recovery_id,delivery_status,next_attempt_at,updated_at) VALUES (?,?,?,?)",
        (recovery_id, "PENDING", now, now),
    )
    return recovery_id


def _dispatch_recovery_once(conn, config, opener=None):
    placeholders = ",".join("?" for _ in config.allowed_event_types)
    row = conn.execute(
        "SELECT r.*,d.attempt_count,e.event_type,e.created_at AS original_created_at "
        "FROM bsfv_outbox_recovery_events r "
        "JOIN bsfv_outbox_recovery_delivery d USING(recovery_id) "
        "JOIN bsfv_outbox_events e ON e.outbox_id=r.original_outbox_id "
        "WHERE d.delivery_status='PENDING' "
        "AND (d.next_attempt_at IS NULL OR d.next_attempt_at<=?) "
        "AND e.created_at>=? "
        f"AND e.event_type IN ({placeholders}) ORDER BY r.created_at LIMIT 1",
        (utc_now(), config.pilot_not_before, *config.allowed_event_types),
    ).fetchone()
    if not row:
        return None
    document = json.loads(row["payload"])
    request = urllib.request.Request(
        config.endpoint,
        data=canonical_bytes(document),
        headers=sign_headers(document, config),
        method="POST",
    )
    attempt = row["attempt_count"] + 1
    started = datetime.now(UTC)
    try:
        status = (opener or urllib.request.urlopen)(request, timeout=10).getcode()
    except urllib.error.HTTPError as exc:
        status = exc.code
    except (TimeoutError, urllib.error.URLError, OSError):
        status = 503
    latency = int((datetime.now(UTC) - started).total_seconds() * 1000)
    now = utc_now()
    if status in {200, 202}:
        state, failure, next_at, delivered, dead = "DELIVERED", None, None, now, None
    elif status in RETRYABLE_HTTP and attempt < MAX_ATTEMPTS:
        state, failure, next_at, delivered, dead = "PENDING", f"http_{status}", _retry_at(attempt), None, None
    else:
        state, failure, next_at, delivered, dead = "DEAD_LETTER", f"http_{status or 'network'}", None, None, now
    conn.execute(
        "UPDATE bsfv_outbox_recovery_delivery SET delivery_status=?,attempt_count=?,"
        "next_attempt_at=?,last_attempt_at=?,delivered_at=?,dead_letter_at=?,failure_code=?,"
        "response_class=?,delivery_latency_ms=?,updated_at=? WHERE recovery_id=?",
        (state, attempt, next_at, now, delivered, dead, failure,
         f"{status // 100}xx" if status else "network", latency, now, row["recovery_id"]),
    )
    return {"attempted": 1, "status": state, "response_class": f"{status // 100}xx", "recovery": True}


def dispatch_once(conn, config=None, opener=None):
    config = config or IntegrationConfig.from_env()
    refusal = config.refusal_code()
    if refusal:
        return {"attempted": 0, "refused": refusal}
    initialize_outbox(conn)
    recovery = _dispatch_recovery_once(conn, config, opener)
    if recovery:
        return recovery
    placeholders = ",".join("?" for _ in config.allowed_event_types)
    row = conn.execute(
        "SELECT e.*,d.attempt_count FROM bsfv_outbox_events e "
        "JOIN bsfv_outbox_delivery d USING(outbox_id) "
        "WHERE d.delivery_status='PENDING' "
        "AND (d.next_attempt_at IS NULL OR d.next_attempt_at<=?) "
        "AND e.created_at>=? "
        f"AND e.event_type IN ({placeholders}) "
        "ORDER BY e.created_at LIMIT 1",
        (utc_now(), config.pilot_not_before, *config.allowed_event_types),
    ).fetchone()
    if not row:
        return {"attempted": 0, "refused": None}
    document = json.loads(row["payload"])
    body = canonical_bytes(document)
    request = urllib.request.Request(config.endpoint, data=body, headers=sign_headers(document, config), method="POST")
    attempt = row["attempt_count"] + 1
    started = datetime.now(UTC)
    status = 0
    try:
        response = (opener or urllib.request.urlopen)(request, timeout=10)
        status = response.getcode()
    except urllib.error.HTTPError as exc:
        status = exc.code
    except (TimeoutError, urllib.error.URLError, OSError):
        status = 503
    latency = int((datetime.now(UTC) - started).total_seconds() * 1000)
    now = utc_now()
    if status in {200, 202}:
        delivery_status, failure, next_at, delivered, dead = "DELIVERED", None, None, now, None
    elif status in RETRYABLE_HTTP and attempt < MAX_ATTEMPTS:
        delivery_status, failure, next_at, delivered, dead = "PENDING", f"http_{status}", _retry_at(attempt), None, None
    else:
        delivery_status, failure, next_at, delivered, dead = "DEAD_LETTER", f"http_{status or 'network'}", None, None, now
    conn.execute(
        "UPDATE bsfv_outbox_delivery SET delivery_status=?,attempt_count=?,next_attempt_at=?,last_attempt_at=?,delivered_at=?,dead_letter_at=?,failure_code=?,response_class=?,delivery_latency_ms=?,updated_at=? WHERE outbox_id=?",
        (delivery_status, attempt, next_at, now, delivered, dead, failure, f"{status // 100}xx" if status else "network", latency, now, row["outbox_id"]),
    )
    _metric(conn, f"response_{status // 100}xx" if status else "response_network")
    _metric(conn, "delivery_latency_ms", latency)
    if delivery_status == "DELIVERED":
        _metric(conn, "delivered")
    elif delivery_status == "DEAD_LETTER":
        _metric(conn, "dead_letter")
    else:
        _metric(conn, "retry")
    return {"attempted": 1, "status": delivery_status, "response_class": f"{status // 100}xx"}


def dispatcher_loop(
    stop_event,
    connection_factory,
    config_factory=IntegrationConfig.from_env,
    dispatcher=dispatch_once,
    idle_seconds=5,
):
    """Deliver eligible outbox events without affecting the ANPS request path."""
    while not stop_event.is_set():
        config = config_factory()
        if not config.enabled:
            return
        conn = None
        attempted = 0
        try:
            conn = connection_factory()
            result = dispatcher(conn, config=config)
            conn.commit()
            attempted = int(result.get("attempted", 0))
        except Exception:
            if conn is not None:
                conn.rollback()
        finally:
            if conn is not None:
                conn.close()
        stop_event.wait(1 if attempted else idle_seconds)


def safe_metrics(conn):
    initialize_outbox(conn)
    counts = {row[0].lower(): row[1] for row in conn.execute("SELECT delivery_status,COUNT(*) FROM bsfv_outbox_delivery GROUP BY delivery_status")}
    for row in conn.execute("SELECT name,value FROM bsfv_outbox_metrics"):
        counts[row[0]] = row[1]
    counts.setdefault("created", 0)
    counts.setdefault("duplicate_accepted", 0)
    counts.setdefault("retry", 0)
    counts.setdefault("delivered", 0)
    counts.setdefault("dead_letter", 0)
    return counts


def pilot_metrics(conn, config=None):
    """Return PII-free sender evidence for the explicitly configured pilot window."""
    config = config or IntegrationConfig.from_env()
    initialize_outbox(conn)
    if not config.allowed_event_types or not config.pilot_not_before:
        return {
            "scope_ready": False,
            "refused": config.refusal_code(),
            "allowed_event_types": list(config.allowed_event_types),
            "pilot_not_before": config.pilot_not_before or None,
            "generated": 0,
            "delivered": 0,
            "pending": 0,
            "blocked": 0,
            "dead_letter": 0,
            "failed_attempts": 0,
            "generated_amount": "0.00",
            "delivered_amount": "0.00",
        }
    placeholders = ",".join("?" for _ in config.allowed_event_types)
    rows = conn.execute(
        "SELECT e.payload,e.created_at,d.delivery_status,d.attempt_count,"
        "d.failure_code,d.delivered_at FROM bsfv_outbox_events e "
        "JOIN bsfv_outbox_delivery d USING(outbox_id) "
        f"WHERE e.created_at>=? AND e.event_type IN ({placeholders})",
        (config.pilot_not_before, *config.allowed_event_types),
    ).fetchall()
    counts = {"delivered": 0, "pending": 0, "blocked": 0, "dead_letter": 0}
    generated_amount = Decimal("0.00")
    delivered_amount = Decimal("0.00")
    failed_attempts = 0
    latest_created_at = None
    latest_delivered_at = None
    for row in rows:
        status = str(row[2]).lower()
        if status in counts:
            counts[status] += 1
        if row[4]:
            failed_attempts += int(row[3] or 0)
        try:
            amount = Decimal(str(json.loads(row[0]).get("data", {}).get("net_paid", "0.00")))
        except (InvalidOperation, TypeError, ValueError, json.JSONDecodeError):
            amount = Decimal("0.00")
        generated_amount += amount
        if status == "delivered":
            delivered_amount += amount
        latest_created_at = max(filter(None, (latest_created_at, row[1])), default=None)
        latest_delivered_at = max(filter(None, (latest_delivered_at, row[5])), default=None)
    return {
        "scope_ready": True,
        "refused": config.refusal_code(),
        "allowed_event_types": list(config.allowed_event_types),
        "pilot_not_before": config.pilot_not_before,
        "generated": len(rows),
        **counts,
        "failed_attempts": failed_attempts,
        "generated_amount": f"{generated_amount:.2f}",
        "delivered_amount": f"{delivered_amount:.2f}",
        "latest_created_at": latest_created_at,
        "latest_delivered_at": latest_delivered_at,
    }
