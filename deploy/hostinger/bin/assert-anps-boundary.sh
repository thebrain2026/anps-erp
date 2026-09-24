#!/usr/bin/env bash
# Refuse any path argument outside /opt/thebrain/anps-erp.
set -euo pipefail
BOUNDARY="${ANPS_BOUNDARY_ROOT:-/opt/thebrain/anps-erp}"
FORBIDDEN_PREFIXES=(
  /opt/thebrain/haven-hotel-erp
  /opt/thebrain/royalgp-hotel-erp
  /opt/thebrain/layerx-pro
  /opt/thebrain/progati-agro
  /opt/thebrain/layerx-tenants
)

die() { echo "ANPS_BOUNDARY_REFUSED: $*" >&2; exit 99; }

require_inside() {
  local target="$1"
  local resolved
  resolved="$(readlink -f -- "$target" 2>/dev/null || realpath -- "$target" 2>/dev/null || echo "$target")"
  case "$resolved" in
    "$BOUNDARY"|"$BOUNDARY"/*) ;;
    *) die "path escapes boundary: $resolved (must stay under $BOUNDARY)" ;;
  esac
  local p
  for p in "${FORBIDDEN_PREFIXES[@]}"; do
    case "$resolved" in
      "$p"|"$p"/*) die "forbidden sibling path: $resolved" ;;
    esac
  done
}

if [[ $# -lt 1 ]]; then
  die "usage: assert-anps-boundary.sh <path> [more paths...]"
fi

for arg in "$@"; do
  require_inside "$arg"
done

echo "ANPS_BOUNDARY_OK: $* under $BOUNDARY"
