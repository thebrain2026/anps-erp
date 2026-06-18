# ANPS ERP

Independent Alfred Nobel Public School ERP deployment package.

This repository is separate from:

- LayerX Pro ERP
- old ANPS School ERP

## Run Locally

```bash
./start-anps-erp.command
```

Open:

```text
http://127.0.0.1:4174/anps-erp.html#dashboard
```

## LAN / Multi-Computer

```bash
./start-anps-erp-lan.command
```

Open from another computer on the same network:

```text
http://YOUR-MAC-IP:4174/anps-erp.html#dashboard
```

## Render

Deploy with `render.yaml`.

The app runs with:

- Frontend: `anps-erp.html`
- Backend: `anps_erp_backend.py`
- Database: `/data/anps_erp.db` on Render persistent disk
