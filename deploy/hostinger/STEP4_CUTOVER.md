# Step 4 — Cloudflare cutover (BLOCKED on API token)

**Status:** prepared, **not executed**  
**Reason:** no Cloudflare API token with write access on account `a0bba4c2021a9450c28c91c50759a21c` (zone `thebrainerp.com` + tunnel edit).

## Current routing

| Host | Path today |
|------|------------|
| `anps.thebrainerp.com` | CNAME → `anps-erp.onrender.com` (Render still live) |
| Shared VPS tunnel `3530c7ea-…` | `haven`→12781, `royalgp`→12780, `progatiagro`→12783 |
| ANPS staging | ready on `127.0.0.1:12784` (Postgres, freeze parity, smoke PASSED) |

## What to provide (one token)

Cloudflare Dashboard → My Profile → API Tokens → Create Token:

- **Zone** `thebrainerp.com`: DNS **Edit**
- **Account** (Samrathazra2008… / `a0bba4c2…`): Cloudflare Tunnel **Edit**

Then:

```bash
export CF_API_TOKEN='...'
sudo /opt/thebrain/anps-erp/bin/cutover_cloudflare_anps.sh
```

## Manual dashboard alternative (same effect)

1. Zero Trust → Networks → Tunnels → tunnel `3530c7ea-…` → Public Hostname  
   Add: `anps.thebrainerp.com` → `http://127.0.0.1:12784`  
   Keep haven / royalgp / progatiagro unchanged.
2. DNS → `anps` CNAME → `3530c7ea-4ce4-465b-b5e2-010ef69fb0ea.cfargotunnel.com` (Proxied).
3. Verify: `https://anps.thebrainerp.com/api/health` shows `"db_engine":"postgres"`.
4. Keep Render service running for rollback.

## Rollback

```bash
export CF_API_TOKEN='...'
sudo /opt/thebrain/anps-erp/bin/rollback_cloudflare_anps_dns.sh
# and remove the anps public hostname from the tunnel if needed
```

## Do not

- Enable `ANPS_FEE_APPEND_API`
- Restart/edit hotel / LayerX / Progati / RoyalGP
- Delete Render disk yet
