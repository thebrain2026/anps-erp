# ANPS ERP Backend Plan

This backend is separate from old ANPS school ERP folders and archives.

## Main Files

- `anps-erp.html`
- `new-school-os.js`
- `new-school-os.css`
- `anps_erp_backend.py`
- `assets/anps-logo.png`

## Runtime Data

- Database: `anps-erp-data/anps_erp.db`
- Backups: `anps-erp-data/backups/`
- Uploads: `anps-erp-data/uploads/`
- API token: `anps-erp-data/.api_token`

## Run

```bash
./start-anps-erp.command
```

Then open:

```text
http://127.0.0.1:4174/anps-erp.html#dashboard
```

## Rule

Do not use old `old-erp-archive` databases or old ANPS ERP deployment folders for this software.
