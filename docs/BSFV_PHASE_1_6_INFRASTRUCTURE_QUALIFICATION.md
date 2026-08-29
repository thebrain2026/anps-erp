# BSFV Phase 1.6 — ANPS-side infrastructure qualification

This phase performs synthetic security and capacity regression only. The ANPS
delivery gate remains OFF and no production endpoint, source mapping, HMAC key, DNS,
real event, historical import or financial processing is activated.

The future sender runtime must have an identity and secret projection separate from
ANPS human users and from BSFV portal authentication. It may reach only the exact
allowlisted HTTPS ingestion URL through the approved machine policy. The outbox uses
its own database tables inside ANPS but grants BSFV no database access. Unavailable
BSFV must preserve pending evidence while normal ANPS operation continues.

Authoritative values are still required for the canonical school ID and one active
academic-session mapping. No values may be derived from display names. Named Primary
operator, Backup operator, Security owner, Engineering escalation and School
operations contact assignments are also required before a pilot.

Phase 1.6 reuses `qualification/phase_1_5_readiness.py` for production-shaped
synthetic sender/receiver, backlog, kill-switch, key-lifecycle, privacy,
reconciliation and zero-financial-effect checks. Production A/B/C must be restored to
OFF/OFF/OFF after every test.

The harness accepts only explicitly disposable local database identifiers, including
`phase16`. Synthetic qualification measured 28.22 receiver events/second with 36.85
ms p95 latency and drained a 1,000-event sender backlog in 0.483 seconds. No real ANPS
record was read or transmitted, and no financial posting occurred.

The pre-existing AppleDouble exception set and
`android-school-app/gradle.properties` remain baseline-only and must not be staged or
committed. Dedicated Fuel Management and a dedicated Approval Queue remain absent.
