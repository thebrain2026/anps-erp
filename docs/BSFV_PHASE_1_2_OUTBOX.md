# Phase 1.2 — BSFV transactional outbox and disabled dispatcher

## Safety boundary

This phase adds source-side durable evidence only. `ANPS_BSFV_INTEGRATION_ENABLED`
defaults to `false`; the server does not start a dispatcher, no endpoint or HMAC
secret is supplied, and no initial sync or historical-data scan exists. Normal
ANPS state saves never call BSFV. BSFV being offline therefore cannot prevent fee
or staff work; eligible events remain pending in the same SQLite database.

Production delivery, credentials, source activation, DNS, ledger posting, payroll
mutation, dedicated Approval Queue, and dedicated Fuel Management are excluded.

## Transaction and storage model

`write_state` compares the prior authoritative state to the accepted new state and
inserts lifecycle events before the SQLite transaction commits. A rollback rolls
back both business state and event creation. `bsfv_outbox_events` contains immutable
event facts and is protected from update/delete by database triggers. Mutable
attempt state is isolated in `bsfv_outbox_delivery`; monotonic aggregate versions
are held in `bsfv_source_versions`.

Uniqueness covers event ID, deterministic mutation key, and aggregate/version.
Retries reuse the immutable envelope and create only fresh signed transport
headers. No hard-delete path is provided.

## Lifecycle and privacy

Supported events are exactly:

- `anps.fee_collection.created`
- `anps.fee_collection.corrected`
- `anps.fee_collection.voided`
- `anps.staff.created`
- `anps.staff.updated`
- `anps.staff.deactivated`

Fee events require a durable payment ID and carry only canonical session/payment/
receipt/admission references, INR decimal amounts, tenders, allocations, date and
lifecycle reason. There is no refund event. Staff events require an explicit staff
ID and exclude phone, email, salary, payroll, bank, password, biometric, attendance,
photo and authorization data. Name-derived fallback IDs are never published.

Canonical school/session mapping is explicit. Missing mappings produce a durable
`BLOCKED` delivery state and safe failure code; blocked rows cannot be dispatched.

## Signing contract

The implementation uses `rfc8785` for JSON Canonicalization Scheme bytes, SHA-256
for the unpadded base64url payload digest, and HMAC-SHA256 for the signature. The
exact signing input is:

```text
POST
/api/v1/integrations/anps/events
<key-id>
<signed-at>
<event-id>
<payload-digest>
```

with a terminal newline. Secrets are runtime-only and are never stored in outbox
tables, payloads, logs, metrics, fixtures or repository configuration.

## Dispatcher refusal and delivery policy

`dispatch_once` refuses unless all of these hold:

1. the enable flag is true;
2. the exact HTTPS endpoint is included in the approved endpoint list;
3. key ID and HMAC secret are present;
4. canonical school configuration is present.

`200` duplicate and `202` accepted are terminal success. `429` and `5xx` use
bounded full-jitter exponential retry with at most 12 attempts. Other `4xx`,
including authentication, conflict, content and size failures, are retained as
dead-letter evidence. Attempt count, safe failure/response class and latency are
stored without payloads or secrets.

## Configuration names (intentionally unset unless shown)

```text
ANPS_BSFV_INTEGRATION_ENABLED=false
ANPS_BSFV_ENDPOINT=
ANPS_BSFV_APPROVED_ENDPOINTS=
ANPS_BSFV_KEY_ID=
ANPS_BSFV_HMAC_SECRET=
ANPS_BSFV_SCHOOL_ID=
ANPS_BSFV_SESSION_MAP=
ANPS_BSFV_SOURCE_SYSTEM=anps
```

Do not enable these settings without a separately approved production phase.
