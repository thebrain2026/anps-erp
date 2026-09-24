# ANPS cutover freeze (Step 2)

**Status:** FREEZE OPEN  
**Declared:** 2026-09-24 20:58 IST (`2026-09-24T15:28:36Z`)  
**Live authority until DNS cutover:** Render (`anps.thebrainerp.com`)  
**DNS:** not switched

## Office instruction (send as-is)

> ANPS ERP **freeze** চলছে (Hostinger cutover)।  
> এখন থেকে নতুন **fee save / Collect Fees / data write** করবেন না।  
> Login ও report **দেখা** চলবে।  
> Cutover শেষ হওয়ার খবর না পাওয়া পর্যন্ত write বন্ধ রাখুন।

## Freeze artifacts (Mac)

Directory: `anps-erp-data-standalone-backup/freeze-20260924/`

| File | Purpose |
|------|---------|
| `anps_erp_freeze_final.db` | Final SQLite freeze DB (80,519,168 bytes) |
| `FREEZE_RECEIPT.json` | Checksums + live parity proof |
| `anps_state_freeze_export.json` | Read-only `/api/export-state` (secondary; fee tables live in SQLite) |

**SHA-256:** `03b784a63082f5dfe0e758098f15c1abb792cce702cd92f6cb3db4729ff4f1f5`  
**Integrity:** OK  
**Live match at declare:** students 218 / receipts 1537 / allocations 3521 / `updated_at=2026-09-24 10:13:19`

## Uploads

Local `uploads/` mirrors are empty. If production needs Render `/data/uploads`, pull via Render Shell before Step 4 (DNS). Fee ledger does not depend on uploads for cutover.

## During freeze

- Do **not** enable `ANPS_FEE_APPEND_API`
- Do **not** switch Cloudflare / DNS yet
- Do **not** touch hotel / LayerX / Progati / RoyalGP
- Re-check live health before Step 3: `updated_at` and receipt count must still match receipt

## Next

**Step 3** — final migrator run of `anps_erp_freeze_final.db` into Hostinger ANPS Postgres only.
