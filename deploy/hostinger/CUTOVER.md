# Hostinger one-step cutover (ANPS only)

**Server:** Hostinger VPS `srv1954636` (`62.72.12.5`)  
**Isolated root:** `/opt/thebrain/anps-erp`  
**Compose project:** `anps_erp`  
**Host port:** `127.0.0.1:12784` → container `4174`  
**Must not touch:** `haven-hotel-erp`, `royalgp-hotel-erp`, `layerx-pro`, `progati-agro`, or their volumes/networks.

## Staging (before DNS)

1. Build image on VPS from release tarball / git.
2. Put secrets in `/opt/thebrain/anps-erp/secrets/secrets.env` (mode 600).
3. `docker compose --env-file secrets/secrets.env -f deploy/hostinger/compose.yaml up -d`
4. Copy SQLite snapshot into staging and run migrator.
5. `curl -sS http://127.0.0.1:12784/api/health` → `ok: true`, `db_engine: postgres`, `fee_append_api: false`

## Production cutover (short freeze)

See also `FREEZE.md` for the live freeze packet / office notice.

1. Announce freeze; take Render `/data` SQLite + uploads backup. ← **Step 2 done 2026-09-24** (freeze DB + receipt under Mac `freeze-20260924/`; uploads optional/manual).
2. Final migrator run into ANPS Postgres volume only.
3. Smoke: login, fee read, notice.
4. Point Cloudflare / tunnel for `anps.thebrainerp.com` → `http://127.0.0.1:12784`.
5. Keep Render live briefly as rollback; do not delete Render disk yet.
6. After 24–48h healthy → stop Render web if desired (saves Render cost; no Managed Postgres purchase).

## Rollback

- Re-point DNS/tunnel to Render.
- ANPS VPS stack can stay up unused; do not drop other projects' containers.
