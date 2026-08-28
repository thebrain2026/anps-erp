# BSFV Phase 1.5 — ANPS sender readiness (no real delivery)

The production delivery gate remains `ANPS_BSFV_INTEGRATION_ENABLED=false`.
No production credential, endpoint activation, DNS change, real event, initial sync,
or finance-domain processing is authorized.

The external-secret adapter reads `ANPS_BSFV_HMAC_SECRET_FILE` only when provider is
`external`. The file must be an absolute, non-symlink regular file, at most 4 KiB,
owner-only, valid UTF-8, and at least 32 characters after trimming. The file is
projected read-only by an approved external secret-manager agent. Direct environment
HMAC values are accepted only by the synthetic provider for tests; they are not a
production path.

Future production configuration design (values intentionally blank/disabled):

```text
ANPS_BSFV_INTEGRATION_ENABLED=false
ANPS_BSFV_SECRET_PROVIDER=external
ANPS_BSFV_HMAC_SECRET_FILE=/absolute/read-only/secret-mount/<key-id>
ANPS_BSFV_KEY_ID=<approved-key-id>
ANPS_BSFV_ENDPOINT=https://anpsfinance.thebrainerp.com/api/v1/integrations/anps/events
ANPS_BSFV_APPROVED_ENDPOINTS=https://anpsfinance.thebrainerp.com/api/v1/integrations/anps/events
ANPS_BSFV_SCHOOL_ID=<approved-canonical-id>
ANPS_BSFV_SESSION_MAP=<approved-source-to-canonical-id-map>
```

The sender rejects non-HTTPS URLs, unexpected paths, user information, queries,
fragments, missing mappings, missing/unsafe secrets and malformed enable flags.
The endpoint remains unconfigured in production. Unknown sessions remain blocked.

Rotation: introduce B at both secret mounts and receiver metadata; verify synthetic or
staging overlap; switch sender key ID/file to B; mark A RETIRING with a deadline;
verify; revoke A and remove its file. Emergency response begins by turning the ANPS
sender gate OFF. Normal ANPS operation continues while the outbox remains pending.

Proposed future pilot is one ANPS school/session and fee-created events only, with no
history, staff, correction/void, ledger posting or payroll mutation. Production Gate
A, BSFV Gate B and domain Gate C remain OFF/OFF/OFF after Phase 1.5.
