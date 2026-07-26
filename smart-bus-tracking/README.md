# ANPS Smart Bus Tracking

Cloudflare Pages app for student-wise bus location.

## Required Cloudflare env

- `SMART_BUS_ERP_TOKEN` - same token configured in ERP Render env.
- `SMART_BUS_DRIVER_PIN` - separate Driver GPS PIN for route selection and trip start.
- Optional KV binding: `SMART_BUS_KV` for persistent synced master data.

Driver GPS supports office-signed vehicle links and separate PIN login for route selection. Do not share the ERP token with drivers.

## ERP env after deploy

- `SMART_BUS_TRACKING_BASE_URL=https://<cloudflare-pages-url>`
- `SMART_BUS_TRACKING_DASHBOARD_URL=https://<cloudflare-pages-url>/office-live-map.html`
- `SMART_BUS_ERP_TOKEN=<same token>`
