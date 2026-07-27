# ANPS Smart Bus Tracking

Cloudflare Pages app for student-wise bus location.

## Required Cloudflare env

- `SMART_BUS_ERP_TOKEN` - same token configured in ERP Render env.
- Optional KV binding: `SMART_BUS_KV` for persistent synced master data.

Driver GPS uses a driver code before route selection. Default code is `2244`; office can change it from Driver/Vehicle Status. Do not share the ERP token with drivers.

## ERP env after deploy

- `SMART_BUS_TRACKING_BASE_URL=https://<cloudflare-pages-url>`
- `SMART_BUS_TRACKING_DASHBOARD_URL=https://<cloudflare-pages-url>/office-live-map.html`
- `SMART_BUS_ERP_TOKEN=<same token>`
