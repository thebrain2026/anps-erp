#!/usr/bin/env bash
# Cut over anps.thebrainerp.com → Hostinger ANPS web (127.0.0.1:12784)
# via the existing shared Cloudflare Tunnel (haven/royalgp/progati).
#
# Requires CF_API_TOKEN with:
#   - Zone:DNS:Edit for thebrainerp.com
#   - Account:Cloudflare Tunnel:Edit on a0bba4c2…
#
#   export CF_API_TOKEN=...
#   sudo ./cutover_cloudflare_anps.sh
set -euo pipefail

ACCOUNT_ID="${CF_ACCOUNT_ID:-a0bba4c2021a9450c28c91c50759a21c}"
ZONE_ID="${CF_ZONE_ID:-2d486f68c16d98b4c8e8a46e1ee0813e}"
TUNNEL_ID="${CF_TUNNEL_ID:-3530c7ea-4ce4-465b-b5e2-010ef69fb0ea}"
HOSTNAME="${CF_HOSTNAME:-anps.thebrainerp.com}"
ORIGIN="${CF_ORIGIN:-http://127.0.0.1:12784}"
TUNNEL_DNS="${TUNNEL_ID}.cfargotunnel.com"
: "${CF_API_TOKEN:?Set CF_API_TOKEN}"

API="https://api.cloudflare.com/client/v4"
AUTH=(-H "Authorization: Bearer ${CF_API_TOKEN}" -H "Content-Type: application/json")
WORKDIR="${TMPDIR:-/tmp}/anps-cutover-$$"
mkdir -p "$WORKDIR"
trap 'rm -rf "$WORKDIR"' EXIT

echo "=== preflight staging origin ==="
curl -fsS "$ORIGIN/api/health" | python3 -c 'import sys,json;d=json.load(sys.stdin);assert d.get("ok") and d.get("db_engine")=="postgres" and d.get("fee_append_api") is False;assert d["tables"]["fee_receipts"]==1537;print("ORIGIN_OK", d.get("updated_at"))'

echo "=== fetch current tunnel config ==="
curl -fsS "${AUTH[@]}" "$API/accounts/$ACCOUNT_ID/cfd_tunnel/$TUNNEL_ID/configurations" >"$WORKDIR/tunnel_cfg.json"
HOSTNAME="$HOSTNAME" ORIGIN="$ORIGIN" WORKDIR="$WORKDIR" python3 - <<'PY'
import json, os, copy
wd=os.environ["WORKDIR"]
cfg=json.load(open(f"{wd}/tunnel_cfg.json"))
config=copy.deepcopy((cfg.get("result") or {}).get("config") or {})
ingress=config.get("ingress") or []
host=os.environ["HOSTNAME"]
origin=os.environ["ORIGIN"]
kept=[i for i in ingress if i.get("hostname") not in (None,"",host) and not str(i.get("service","")).startswith("http_status:")]
order=["haven.thebrainerp.com","royalgp.thebrainerp.com","progatiagro.thebrainerp.com", host]
by={i.get("hostname"): i for i in kept}
extras=[i for i in kept if i.get("hostname") not in order]
new=[]
for h in order:
    if h==host:
        new.append({"hostname": host, "service": origin})
    elif h in by:
        new.append({"hostname": h, "service": by[h]["service"]})
new.extend(extras)
new.append({"service": "http_status:404"})
need={"haven.thebrainerp.com","royalgp.thebrainerp.com","progatiagro.thebrainerp.com"}
missing=need-{i.get("hostname") for i in new}
if missing:
    raise SystemExit(f"REFUSING: would drop sibling hostnames {missing}")
config["ingress"]=new
json.dump({"config": config}, open(f"{wd}/tunnel_put.json","w"))
print("INGRESS", json.dumps([{"hostname":i.get("hostname"),"service":i.get("service")} for i in new], indent=2))
PY

echo "=== put tunnel config ==="
curl -fsS -X PUT "${AUTH[@]}" --data-binary @"$WORKDIR/tunnel_put.json" \
  "$API/accounts/$ACCOUNT_ID/cfd_tunnel/$TUNNEL_ID/configurations" \
  | python3 -c 'import sys,json;d=json.load(sys.stdin);assert d.get("success");print("TUNNEL_CONFIG_OK")'

echo "=== upsert DNS CNAME ==="
curl -fsS "${AUTH[@]}" "$API/zones/$ZONE_ID/dns_records?name=$HOSTNAME" >"$WORKDIR/dns_exist.json"
HOSTNAME="$HOSTNAME" TUNNEL_DNS="$TUNNEL_DNS" ZONE_ID="$ZONE_ID" API="$API" WORKDIR="$WORKDIR" python3 - <<'PY'
import json, os, urllib.request
api=os.environ["API"]; zone=os.environ["ZONE_ID"]; host=os.environ["HOSTNAME"]
content=os.environ["TUNNEL_DNS"]; token=os.environ["CF_API_TOKEN"]; wd=os.environ["WORKDIR"]
headers={"Authorization":f"Bearer {token}","Content-Type":"application/json"}
exist=json.load(open(f"{wd}/dns_exist.json"))
recs=exist.get("result") or []
payload={"type":"CNAME","name":host,"content":content,"proxied":True,"ttl":1}
def call(method, url, data=None):
    req=urllib.request.Request(url, data=None if data is None else json.dumps(data).encode(), headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())
if recs:
    rid=recs[0]["id"]
    open("/tmp/anps_dns_rollback.json","w").write(json.dumps(recs[0], indent=2))
    print("updating record", rid, "was", recs[0].get("type"), recs[0].get("content"))
    out=call("PUT", f"{api}/zones/{zone}/dns_records/{rid}", payload)
else:
    print("creating record")
    out=call("POST", f"{api}/zones/{zone}/dns_records", payload)
assert out.get("success"), out
print("DNS_OK", out["result"]["content"], "proxied", out["result"]["proxied"])
PY

echo "=== wait for health via public hostname ==="
for i in $(seq 1 36); do
  BODY=$(curl -fsS --max-time 20 "https://$HOSTNAME/api/health" 2>/dev/null || echo '{}')
  OK=$(printf '%s' "$BODY" | python3 -c 'import json,sys;d=json.load(sys.stdin);print("1" if d.get("ok") and d.get("db_engine")=="postgres" else "0")' 2>/dev/null || echo 0)
  if [ "$OK" = "1" ]; then
    printf '%s' "$BODY" | python3 -c 'import sys,json;d=json.load(sys.stdin);print("CUTOVER_LIVE", {k:d.get(k) for k in ["ok","db_engine","fee_append_api","updated_at"]});print("receipts", d.get("tables",{}).get("fee_receipts"))'
    echo "CUTOVER_DONE"
    exit 0
  fi
  echo "wait $i ..."
  sleep 5
done
echo "CUTOVER_DNS_UPDATED_BUT_HEALTH_NOT_YET_POSTGRES — check tunnel/DNS propagation"
exit 2
