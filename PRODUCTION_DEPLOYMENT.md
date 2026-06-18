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
```

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
