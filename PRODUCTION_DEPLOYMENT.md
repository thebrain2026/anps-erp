# ANPS ERP Production Deployment

This is the third, separate ERP project. Do not connect it to the old LayerX Pro ERP repository or the old ANPS School ERP repository.

## Current Production Files

- `anps-erp.html`
- `new-school-os.css`
- `new-school-os.js`
- `anps_erp_backend.py`
- `assets/anps-logo.png`
- `Dockerfile`
- `render.yaml`

## Local Run

Single computer:

```bash
./start-anps-erp.command
```

Open:

```text
http://127.0.0.1:4174/anps-erp.html#dashboard
```

Multi-computer on the same Wi-Fi/LAN:

```bash
./start-anps-erp-lan.command
```

Find this Mac's IP address from System Settings > Wi-Fi > Details, then open from another computer:

```text
http://YOUR-MAC-IP:4174/anps-erp.html#dashboard
```

## New GitHub Repository

Create a new GitHub repo, for example:

```text
anps-erp-production
```

Do not reuse:

- `layerx-pro-erp`
- `anps-school-erp`

Before pushing, check:

```bash
git remote -v
```

There should be no old remote. Add only the new third repo:

```bash
git remote add origin https://github.com/thebrain2026/anps-erp-production.git
git push -u origin main
```

## Render Deploy

Use Render Blueprint from `render.yaml`, or create a Docker Web Service manually.

Required settings:

```text
Runtime: Docker
Health Check Path: /api/health
Persistent Disk Mount: /data
```

Environment variables:

```text
ANPS_ERP_HOST=0.0.0.0
ANPS_ERP_PORT=4174
ANPS_ERP_DATA_DIR=/data
ANPS_ERP_DB=/data/anps_erp.db
ANPS_ERP_BACKUP_DIR=/data/backups
ANPS_ERP_UPLOAD_DIR=/data/uploads
ANPS_ERP_ALLOWED_ORIGINS=*
ANPS_ERP_API_TOKEN=
ANPS_ICICI_GATEWAY_ENABLED=false
ANPS_ICICI_MERCHANT_ID=
ANPS_ICICI_TERMINAL_ID=
ANPS_ICICI_ACCESS_CODE=
ANPS_ICICI_SECRET_KEY=
ANPS_ICICI_ENCRYPTION_KEY=
ANPS_ICICI_PAYMENT_URL=
ANPS_ICICI_RETURN_URL=https://YOUR-RENDER-SERVICE.onrender.com/api/payments/icici/callback
ANPS_ICICI_WEBHOOK_SECRET=
SMART_BUS_TRACKING_BASE_URL=https://YOUR-SMART-BUS-SERVICE.onrender.com
SMART_BUS_TRACKING_DASHBOARD_URL=https://YOUR-SMART-BUS-SERVICE.onrender.com/office-live-map.html
SMART_BUS_ERP_TOKEN=
```

ICICI payment gateway live korar age bank/gateway theke merchant id, terminal id, access code, secret key, encryption/signing key, payment URL, return/callback URL format, webhook/server-to-server response format, and test credentials nite hobe. Ei values Render environment-e boshbe; GitHub-e real secret value commit korben na.

Smart Bus Tracking integration-e ERP sudhu master data sync korbe. Live GPS, map refresh, stoppage calculation and student bus location API separate Smart Bus Tracking service-e thakbe. Same `SMART_BUS_ERP_TOKEN` Smart Bus service and ANPS ERP service du jaygay set korte hobe.

After deploy, open:

```text
https://YOUR-RENDER-SERVICE.onrender.com/anps-erp.html#dashboard
```

Health check:

```text
https://YOUR-RENDER-SERVICE.onrender.com/api/health
```

## Isolation Rule

The production Docker image copies only ANPS ERP files. Old project folders are excluded by `.dockerignore`, and the backend blocks old ERP paths with `403 Protected file`.

Runtime database:

```text
/data/anps_erp.db
```

It must not use:

```text
poultry_farm.db
school_erp.db
old-erp-archive
anps-school-erp-v2-clean
```

## Before Public Use

- Create staff users in User Access & Permission.
- Change the default admin password from inside the software.
- Keep Render account 2FA on.
- Keep the persistent disk enabled.
- Take backup before major imports.
