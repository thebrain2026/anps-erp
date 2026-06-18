FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV ANPS_ERP_HOST=0.0.0.0
ENV ANPS_ERP_PORT=4174
ENV ANPS_ERP_DATA_DIR=/data
ENV ANPS_ERP_DB=/data/anps_erp.db
ENV ANPS_ERP_BACKUP_DIR=/data/backups
ENV ANPS_ERP_UPLOAD_DIR=/data/uploads

WORKDIR /app

COPY anps-erp.html new-school-os.css new-school-os.js anps_erp_backend.py ./
COPY assets ./assets

RUN useradd --system --create-home --home-dir /home/anps anps \
    && mkdir -p /data/backups /data/uploads \
    && chown -R anps:anps /app /data

USER anps

EXPOSE 4174

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import json, urllib.request; data=json.load(urllib.request.urlopen('http://127.0.0.1:4174/api/health', timeout=3)); raise SystemExit(0 if data.get('ok') else 1)"

CMD ["python", "anps_erp_backend.py"]
