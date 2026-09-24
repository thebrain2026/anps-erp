#!/usr/bin/env bash
# Apply filesystem + ownership boundary for ANPS only. Never touches sibling trees.
set -euo pipefail
BOUNDARY=/opt/thebrain/anps-erp
FORBIDDEN=(haven-hotel-erp royalgp-hotel-erp layerx-pro progati-agro layerx-tenants)

echo "Applying ANPS boundary at $BOUNDARY"

# Refuse if somehow pointed at a sibling.
for name in "${FORBIDDEN[@]}"; do
  case "$BOUNDARY" in
    */"$name"|*/"$name"/*) echo "REFUSING boundary=$BOUNDARY"; exit 2 ;;
  esac
done

if [[ ! -d "$BOUNDARY" ]]; then
  echo "missing $BOUNDARY"; exit 2
fi

# Dedicated host user/group (UID aligned with container anps=999 when possible).
if ! getent group anpserp >/dev/null; then
  groupadd --system --gid 979 anpserp || groupadd --system anpserp
fi
if ! id anpserp >/dev/null 2>&1; then
  # Prefer 999 if free (matches image user); else let system pick.
  if ! getent passwd 999 >/dev/null; then
    useradd --system --uid 999 --gid anpserp --home-dir "$BOUNDARY" --shell /usr/sbin/nologin anpserp
  else
    useradd --system --gid anpserp --home-dir "$BOUNDARY" --shell /usr/sbin/nologin anpserp
  fi
fi

install -d -m 0750 -o root -g anpserp "$BOUNDARY"
install -d -m 0750 -o anpserp -g anpserp "$BOUNDARY/shared" "$BOUNDARY/shared/data" \
  "$BOUNDARY/shared/data/backups" "$BOUNDARY/shared/data/uploads" \
  "$BOUNDARY/logs" "$BOUNDARY/releases" "$BOUNDARY/staging"
install -d -m 0700 -o root -g anpserp "$BOUNDARY/secrets"
install -d -m 0750 -o root -g anpserp "$BOUNDARY/bin"

# Ownership for runtime data (container may run as uid 999).
chown -R anpserp:anpserp "$BOUNDARY/shared" "$BOUNDARY/logs" "$BOUNDARY/staging" || true
# If container user is 999 and differs from anpserp uid, also chown data to 999 for write.
ANPS_UID="$(id -u anpserp)"
if [[ "$ANPS_UID" != "999" ]]; then
  echo "NOTE: host anpserp uid=$ANPS_UID; ensuring shared/data writable by container uid 999"
  chown -R 999:999 "$BOUNDARY/shared/data" || true
fi

chmod 0750 "$BOUNDARY"
chmod 0700 "$BOUNDARY/secrets"
chmod 0640 "$BOUNDARY/secrets/"* 2>/dev/null || true
chmod 0750 "$BOUNDARY/shared" "$BOUNDARY/releases" "$BOUNDARY/staging" "$BOUNDARY/logs" "$BOUNDARY/bin"

# Drop a sticky marker so operators see the fence.
cat > "$BOUNDARY/README.BOUNDARY" <<'EOF'
ANPS BOUNDARY — DO NOT MIX WITH OTHER PROJECTS
Root: /opt/thebrain/anps-erp
Forbidden: haven-hotel-erp, royalgp-hotel-erp*, layerx-pro, progati-agro
Compose project must be: anps_erp
See deploy/hostinger/BOUNDARY.md
EOF
chown root:anpserp "$BOUNDARY/README.BOUNDARY"
chmod 0640 "$BOUNDARY/README.BOUNDARY"

echo "ANPS filesystem boundary applied."
