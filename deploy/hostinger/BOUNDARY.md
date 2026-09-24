# ANPS boundary on Hostinger VPS — full protection

**Absolute root (only):** `/opt/thebrain/anps-erp`  
**Compose project:** `anps_erp`  
**Containers:** `anps-erp-web`, `anps-erp-postgres`  
**Volume:** `anps_erp_pgdata`  
**Networks:** `anps_erp_private` (internal), `anps_erp_edge`  
**Host port:** `127.0.0.1:12784` only  

## Hard rules

1. Never read/write/delete under:
   - `/opt/thebrain/haven-hotel-erp`
   - `/opt/thebrain/royalgp-hotel-erp*`
   - `/opt/thebrain/layerx-pro`
   - `/opt/thebrain/progati-agro`
   - `/opt/thebrain/backups` (shared host backups tree — not ANPS)
2. Never attach ANPS containers to another project's Docker network or volume.
3. Never publish Postgres to `0.0.0.0` / public NIC.
4. Never run `docker compose` for ANPS with a project name other than `anps_erp`.
5. Secrets live only in `/opt/thebrain/anps-erp/secrets` (mode `700` / files `600`).

## Layers of protection

| Layer | What |
|-------|------|
| Path | Dedicated tree owned by `anpserp` host user; mode `750` / secrets `700` |
| Docker names | Prefixed `anps_erp_*` / `anps-erp-*` only |
| Network | Private internal DB net; edge net not joined by hotel/LayerX |
| Caps | `cap_drop: ALL` (+ minimal postgres caps) |
| Rootfs | `read_only: true` + tmpfs |
| Bind | Single bind: `shared/data` → `/data` |
| Port | Loopback-only `12784` |
| Guard script | Refuses commands whose target path escapes the boundary |

## Apply / verify

```bash
sudo /opt/thebrain/anps-erp/bin/apply-boundary.sh
sudo /opt/thebrain/anps-erp/bin/verify-boundary.sh
```
