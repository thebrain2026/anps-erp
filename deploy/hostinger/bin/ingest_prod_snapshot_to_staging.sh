#!/usr/bin/env bash
# Ingest a production ANPS snapshot into Hostinger ANPS staging ONLY.
# Never touches hotel/LayerX/Progati paths.
set -euo pipefail
BOUNDARY=/opt/thebrain/anps-erp
SOURCE="${1:?usage: ingest_prod_snapshot_to_staging.sh /path/to/anps_erp.db}"

bash "$BOUNDARY/bin/assert-anps-boundary.sh" "$BOUNDARY"
# Source may be outside boundary (download dir) — that is OK; destination must stay inside.
case "$(readlink -f "$SOURCE" 2>/dev/null || echo "$SOURCE")" in
  /opt/thebrain/haven-hotel-erp/*|/opt/thebrain/layerx-pro/*|/opt/thebrain/progati-agro/*|/opt/thebrain/royalgp-hotel-erp*)
    echo "REFUSING to read sibling project path as source"; exit 99 ;;
esac

STAMP=$(date -u +%Y%m%dT%H%M%SZ)
DEST="$BOUNDARY/staging/prod-snapshots"
mkdir -p "$DEST"
install -m 0600 "$SOURCE" "$DEST/anps_erp_${STAMP}.db"
chown anpserp:anpserp "$DEST/anps_erp_${STAMP}.db" 2>/dev/null || chown 999:999 "$DEST/anps_erp_${STAMP}.db" || true
ln -sfn "anps_erp_${STAMP}.db" "$DEST/anps_erp_latest.db"

docker compose --env-file "$BOUNDARY/secrets/secrets.env" -p anps_erp \
  -f "$BOUNDARY/staging/compose.yaml" exec -T \
  -e PYTHONPATH=/app \
  web python -u /data/migrate_sqlite_to_postgres.py /data/anps_erp_source.db

curl -fsS http://127.0.0.1:12784/api/health | python3 -c "import sys,json;d=json.load(sys.stdin);print({k:d.get(k) for k in ['ok','db_engine','fee_append_api','updated_at']});print('tables',{k:d.get('tables',{}).get(k) for k in ['students','fee_receipts','staff_members']})"
echo "INGEST_DONE stamp=$STAMP"
