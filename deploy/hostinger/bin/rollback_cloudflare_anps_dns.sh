#!/usr/bin/env bash
# Rollback anps.thebrainerp.com DNS to Render (pre-cutover).
# Requires CF_API_TOKEN with Zone:DNS:Edit.
# Prefer restoring from /tmp/anps_dns_rollback.json if present.
set -euo pipefail
ZONE_ID="${CF_ZONE_ID:-2d486f68c16d98b4c8e8a46e1ee0813e}"
HOSTNAME="${CF_HOSTNAME:-anps.thebrainerp.com}"
RENDER_TARGET="${CF_RENDER_TARGET:-anps-erp.onrender.com}"
: "${CF_API_TOKEN:?Set CF_API_TOKEN}"
API="https://api.cloudflare.com/client/v4"
AUTH=(-H "Authorization: Bearer ${CF_API_TOKEN}" -H "Content-Type: application/json")

EXIST=$(curl -fsS "${AUTH[@]}" "$API/zones/$ZONE_ID/dns_records?name=$HOSTNAME")
python3 - <<PY
import json, os, urllib.request
api="$API"; zone="$ZONE_ID"; host="$HOSTNAME"; token=os.environ["CF_API_TOKEN"]
headers={"Authorization":f"Bearer {token}","Content-Type":"application/json"}
exist=json.loads('''$EXIST''')
recs=exist.get("result") or []
assert recs, "no DNS record for "+host
rid=recs[0]["id"]
backup="/tmp/anps_dns_rollback.json"
if os.path.exists(backup):
    payload=json.load(open(backup))
    body={"type":payload["type"],"name":payload["name"],"content":payload["content"],"proxied":payload.get("proxied",True),"ttl":payload.get("ttl",1)}
else:
    body={"type":"CNAME","name":host,"content":"$RENDER_TARGET","proxied":True,"ttl":1}
req=urllib.request.Request(f"{api}/zones/{zone}/dns_records/{rid}", data=json.dumps(body).encode(), headers=headers, method="PUT")
with urllib.request.urlopen(req, timeout=30) as r:
    out=json.loads(r.read().decode())
assert out.get("success"), out
print("DNS_ROLLBACK_OK", out["result"]["content"])
PY
