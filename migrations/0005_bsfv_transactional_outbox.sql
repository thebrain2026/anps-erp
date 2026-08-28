-- Phase 1.2 forward-only migration; mirrored by initialize_outbox for this monolith.
CREATE TABLE IF NOT EXISTS bsfv_source_versions (
    aggregate_type TEXT NOT NULL, aggregate_id TEXT NOT NULL,
    source_version INTEGER NOT NULL CHECK(source_version > 0), updated_at TEXT NOT NULL,
    PRIMARY KEY (aggregate_type, aggregate_id)
);
CREATE TABLE IF NOT EXISTS bsfv_outbox_events (
    outbox_id TEXT PRIMARY KEY, event_id TEXT NOT NULL UNIQUE, mutation_key TEXT NOT NULL UNIQUE,
    schema_version TEXT NOT NULL, event_type TEXT NOT NULL, source_system TEXT NOT NULL,
    source_record_id TEXT NOT NULL, aggregate_type TEXT NOT NULL, aggregate_id TEXT NOT NULL,
    source_version INTEGER NOT NULL CHECK(source_version > 0), school_id TEXT NOT NULL,
    session_id TEXT, occurred_at TEXT NOT NULL, created_at TEXT NOT NULL, payload TEXT NOT NULL,
    payload_hash TEXT NOT NULL, trace_id TEXT, blocked_reason TEXT,
    UNIQUE (aggregate_type, aggregate_id, source_version)
);
CREATE TABLE IF NOT EXISTS bsfv_outbox_delivery (
    outbox_id TEXT PRIMARY KEY REFERENCES bsfv_outbox_events(outbox_id) ON DELETE RESTRICT,
    delivery_status TEXT NOT NULL CHECK(delivery_status IN ('PENDING','BLOCKED','IN_FLIGHT','DELIVERED','DEAD_LETTER')),
    attempt_count INTEGER NOT NULL DEFAULT 0 CHECK(attempt_count >= 0), next_attempt_at TEXT,
    last_attempt_at TEXT, delivered_at TEXT, dead_letter_at TEXT, failure_code TEXT,
    response_class TEXT, delivery_latency_ms INTEGER, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_bsfv_outbox_delivery_ready ON bsfv_outbox_delivery(delivery_status, next_attempt_at);
CREATE INDEX IF NOT EXISTS idx_bsfv_outbox_event_aggregate ON bsfv_outbox_events(aggregate_type, aggregate_id, source_version);
CREATE TABLE IF NOT EXISTS bsfv_outbox_metrics (
    name TEXT PRIMARY KEY, value INTEGER NOT NULL DEFAULT 0 CHECK(value >= 0)
);
CREATE TRIGGER IF NOT EXISTS bsfv_outbox_events_no_update BEFORE UPDATE ON bsfv_outbox_events BEGIN
    SELECT RAISE(ABORT, 'immutable_outbox_event');
END;
CREATE TRIGGER IF NOT EXISTS bsfv_outbox_events_no_delete BEFORE DELETE ON bsfv_outbox_events BEGIN
    SELECT RAISE(ABORT, 'immutable_outbox_event');
END;
