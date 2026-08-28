# Phase 1.3 — Synthetic E2E qualification and shadow readiness

Status: **PASS — synthetic/local only**

ANPS frozen sender baseline: `b2052257fcde02231a7f40a0892090d83f7c5f4d`

BSFV frozen receiver baseline: `688407fe6ea832de9a073b2e2178bf52d4bc1d94`

## Safety and environment

Qualification used a disposable ANPS SQLite database and a localhost-only
PostgreSQL 16.4 database named `bsfv_phase13_synthetic`, stored on container
tmpfs. The BSFV schema was created through the frozen Alembic migration chain.
No production database, endpoint, DNS, credential or customer record was used.

The HMAC secret was generated in process, supplied only through runtime settings,
never printed or written to a file, cleared after the test, and not committed.
The dispatcher target was an approved synthetic HTTPS identity routed in-process
to the actual FastAPI application. The route still executed the normal HTTP body,
RFC 8785 digest, HMAC, key-ID, timestamp, schema, privacy, idempotency, ordering,
inbox and processing-state code. No sender or receiver validation was bypassed.

## End-to-end result

The actual ANPS state-diff builder, transactional outbox, dispatcher and signer
delivered all six event types to the frozen BSFV receiver:

| Lifecycle | Versions | Receiver result |
|---|---:|---|
| fee created → corrected → voided | 1 → 2 → 3 | 3/3 `READY` |
| staff created → updated → deactivated | 1 → 2 → 3 | 3/3 `READY` |

Fee facts remained three immutable evidence rows. Staff used an explicit durable
ID and contained only approved directory fields. Wire inspection found no salary,
payroll, bank, attendance, biometric, photo, authentication, phone, email,
guardian or unrelated student data.

## Idempotency, ordering and security

- Exact duplicate: `200 duplicate`; one receiver event remained.
- Same event ID with modified digest: `409 conflicting_event_id`; original evidence
  remained unchanged.
- Gap test: version 1 was `READY`; version 3 was stored `QUARANTINED` with
  `source_version_gap`.
- Under the frozen receiver's max-evidence ordering policy, later version 2 is
  also quarantined as stale because quarantined version 3 remains evidence and
  advances the observed maximum. A later distinct version 1 is rejected stale.
  Gap recovery therefore requires a future explicitly approved reconciliation/
  replay policy; Phase 1.3 did not alter this behavior.
- Clock skew at 299 seconds was accepted; 301 seconds was rejected.
- Invalid HMAC, tampered body and wrong key ID returned `401`.
- Unsupported schema and forbidden fields were quarantined with `409`.
- Oversized body returned `413`; wrong content type returned `415`.
- Sender classification: `400/401/409/413/415` → `DEAD_LETTER`, `429/500` →
  retryable `PENDING`.

## Continuity, retry and concurrency

With BSFV unavailable, the synthetic ANPS source mutation completed and its event
remained pending with a retryable failure. Reopening the disposable ANPS database
proved restart persistence; restored delivery succeeded. A timeout after receiver
acceptance led to a safe retry and `200 duplicate`, with one receiver event.

The full-jitter bounded retry metadata, next-attempt field and 12-attempt limit
were exercised without sleeping. A permanent synthetic timeout at the threshold
reached `DEAD_LETTER` while immutable outbox evidence and source business state
remained intact. Two concurrent receiver requests returned one `202` and one
`200`, leaving one logical event.

## Reconciliation and financial boundary

Healthy lifecycle reconciliation matched source and receiver event count, summed
fee evidence amount and highest fee version. Controlled comparisons detected all
four intended mismatch classes: missing event, count mismatch, amount mismatch
and version gap. No automatic repair or financial mutation occurred.

After 265 synthetic receiver evidence rows, domain counts were:

| Domain record | Count |
|---|---:|
| journal transactions | 0 |
| expenses | 0 |
| payroll records | 0 |
| treasury transactions (cash/bank/petty cash) | 0 |

No ledger, cash, bank, expense, payroll or treasury posting path was invoked.

## Monitor and observability

Before the performance batch, the actual read-only monitor reported 15 synthetic
events: 11 `READY`, 4 `QUARANTINED`, and 2 duplicate deliveries. Each row exposed
only safe metadata, a 12-character safe reference, version, status, time and lag;
no payload was returned.

The frozen UI synthetic preview was checked at 1440×900 and 390×844. It displayed
received/ready/quarantined/failed metrics, accepted and quarantined rows, duplicate
delivery, version, lag and safe references. It had no posting/approval control,
no sensitive payload, no horizontal mobile overflow and no unexplained console
warning/error. The mobile navigation drawer opened and closed correctly.

## Performance smoke

Using 250 additional synthetic events through the actual receiver and disposable
PostgreSQL database:

- throughput: **44.93 events/second**
- median request latency: **21.61 ms**
- p95 request latency: **25.50 ms**
- accepted: **250/250**

This is a local school-scale smoke result, not a production capacity guarantee.

## Shadow mode and kill switches

Future shadow operation must preserve three independent gates:

1. **ANPS delivery gate:** existing `ANPS_BSFV_INTEGRATION_ENABLED`, default
   `false`. Turning it off stops delivery while source operations and durable
   pending outbox retention continue.
2. **BSFV ingestion gate:** the frozen receiver requires an active, scoped
   `IntegrationSource`, an allowed key ID and a runtime key. The repository has no
   source row or key by default. A future pilot should add/approve an explicit
   receiver-wide default-off kill switch before production shadow delivery.
3. **BSFV domain-processing gate:** no domain processor or posting path exists.
   Any future implementation must have a separate default-off flag and must remain
   off throughout shadow mode.

Immediate synthetic kill controls are sender disablement, receiver source
deactivation/key revocation, and leaving domain processing absent/off. None stops
normal ANPS business operations or deletes pending/evidence rows.

## Remaining blockers before a real pilot

- Explicit production approval and named owners.
- Approved canonical school/session mappings and amount semantics.
- Dedicated production secret storage, rotation and revocation procedure.
- Approved HTTPS endpoint, DNS/edge controls and monitoring ownership.
- Explicit receiver-wide ingestion kill switch.
- Controlled gap/replay/reconciliation policy, including the documented late-v2
  behavior after quarantined v3 evidence.
- Retention, incident response, capacity and rollback runbooks.
- A separate authorization for production shadow delivery; initial synchronization
  and all financial posting remain prohibited.

Dedicated Approval Queue and dedicated Fuel Management remain absent.
