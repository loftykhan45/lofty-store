#!/usr/bin/env bash
# Lofty Store — deploy/update script.
# Pulls the latest site from GitHub into the directory Caddy serves.
#
# First-time setup on the VPS:
#   sudo mkdir -p /var/www/lofty-store
#   sudo chown $USER:$USER /var/www/lofty-store
#   git clone https://github.com/loftykhan45/lofty-store.git /var/www/lofty-store
#
# Then run this script any time to update, or wire it to run automatically
# (see systemd unit + timer below, or the webhook option).

set -euo pipefail

SITE_DIR="/var/www/lofty-store"
BRANCH="main"

cd "$SITE_DIR"
git fetch --quiet origin "$BRANCH"
git reset --hard "origin/$BRANCH"
git clean -fd

# Static site, no build step — Caddy's file_server picks up the new files
# immediately. Reload Caddy only if you also keep its Caddyfile in this repo.
if [ -f "$SITE_DIR/Caddyfile" ]; then
  sudo systemctl reload caddy
fi

echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) deployed $(git rev-parse --short HEAD)"
