#!/usr/bin/env bash
# Verify ANPS isolation: path perms, no shared nets/volumes with siblings, loopback port.
set -euo pipefail
BOUNDARY=/opt/thebrain/anps-erp
FAIL=0

ok() { echo "OK  $*"; }
bad() { echo "BAD $*"; FAIL=1; }

[[ -d "$BOUNDARY" ]] && ok "boundary dir exists" || bad "missing $BOUNDARY"

# Sibling trees must still exist (we did not delete them) and we must not own them.
for sib in haven-hotel-erp layerx-pro progati-agro; do
  if [[ -e "/opt/thebrain/$sib" ]]; then
    owner="$(stat -c '%U' "/opt/thebrain/$sib" 2>/dev/null || true)"
    if [[ "$owner" == "anpserp" ]]; then
      bad "sibling $sib unexpectedly owned by anpserp"
    else
      ok "sibling $sib present and not owned by anpserp ($owner)"
    fi
  fi
done

# Secrets mode
if [[ -d "$BOUNDARY/secrets" ]]; then
  mode="$(stat -c '%a' "$BOUNDARY/secrets")"
  [[ "$mode" == "700" ]] && ok "secrets mode 700" || bad "secrets mode=$mode want 700"
fi

# Compose project containers
for c in anps-erp-web anps-erp-postgres; do
  if docker inspect "$c" >/dev/null 2>&1; then
    ok "container $c exists"
  else
    bad "container $c missing"
  fi
done

# Web must not mount sibling paths
if docker inspect anps-erp-web >/dev/null 2>&1; then
  mounts="$(docker inspect anps-erp-web --format '{{range .Mounts}}{{.Source}} {{end}}')"
  echo "mounts: $mounts"
  for badsrc in haven-hotel-erp royalgp-hotel-erp layerx-pro progati-agro; do
    case "$mounts" in
      *"$badsrc"*) bad "web mounts sibling path containing $badsrc" ;;
    esac
  done
  case "$mounts" in
    */opt/thebrain/anps-erp/shared/data*) ok "web bind is ANPS data only (or includes it)" ;;
    *) bad "web missing ANPS shared/data bind" ;;
  esac

  ports="$(docker port anps-erp-web 2>/dev/null || true)"
  echo "ports: $ports"
  echo "$ports" | grep -q '127.0.0.1:12784' && ok "loopback 12784" || bad "expected 127.0.0.1:12784"
  echo "$ports" | grep -qE '0\.0\.0\.0:|:::' && bad "web published on public interface" || ok "no public bind detected"
fi

# Postgres must not publish host ports
if docker inspect anps-erp-postgres >/dev/null 2>&1; then
  pp="$(docker port anps-erp-postgres 2>/dev/null || true)"
  [[ -z "$pp" ]] && ok "postgres has no host ports" || bad "postgres host ports: $pp"
  nets="$(docker inspect anps-erp-postgres --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}')"
  echo "postgres nets: $nets"
  case "$nets" in
    *anps_erp_private*) ok "postgres on anps_erp_private" ;;
    *) bad "postgres not on anps_erp_private" ;;
  esac
  for foreign in royalgp haven layerx progati; do
    case "$nets" in
      *"$foreign"*) bad "postgres joined foreign net matching $foreign" ;;
    esac
  done
fi

# Volume name isolation
docker volume inspect anps_erp_pgdata >/dev/null 2>&1 && ok "volume anps_erp_pgdata" || bad "missing anps_erp_pgdata"

if [[ "$FAIL" -ne 0 ]]; then
  echo "BOUNDARY_VERIFY_FAILED"
  exit 1
fi
echo "BOUNDARY_VERIFY_PASSED"
