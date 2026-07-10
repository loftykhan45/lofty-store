#!/usr/bin/env bash
# Lofty Store — deploy/update script (Next.js version).
# Pulls the latest from GitHub, rebuilds, and reloads the running app via PM2.
#
# First-time setup on the VPS (replace <DEPLOY_USER> with whatever unix user
# will own /var/www/lofty-store — reuse the same user for the app process and
# this script/webhook so file permissions stay consistent):
#
#   sudo mkdir -p /var/www/lofty-store
#   sudo chown <DEPLOY_USER>:<DEPLOY_USER> /var/www/lofty-store
#   git clone https://github.com/loftykhan45/lofty-store.git /var/www/lofty-store
#   cd /var/www/lofty-store
#   npm ci
#   npm run build
#   npm install -g pm2          # if not already installed
#   pm2 start deploy/ecosystem.config.js
#   pm2 save
#   pm2 startup                 # one-time: run the sudo command it prints, then `pm2 save` again
#
# better-sqlite3 is a native module — if `npm ci` fails compiling it, run:
#   sudo apt-get update && sudo apt-get install -y build-essential python3
# and retry.
#
# After first-time setup, this script handles every subsequent deploy
# (run manually, or automatically via the webhook listener — see README.md).

set -euo pipefail

SITE_DIR="/var/www/lofty-store"
BRANCH="main"

cd "$SITE_DIR"
git fetch --quiet origin "$BRANCH"
git reset --hard "origin/$BRANCH"

# Keep the SQLite database, installed deps, and Next.js build cache across
# deploys — they're gitignored (untracked), so a plain `git clean -fd` would
# otherwise delete them, wiping every order on every deploy.
git clean -fd -e data -e node_modules -e .next

# Next.js's on-disk image optimizer cache (.next/cache/images) is keyed by
# request URL+params, not by the source file's content hash, and is served
# unconditionally for its max-age (4h) once populated. Since public/img/*
# assets get overwritten in place (same filename, new content) rather than
# renamed, a stale cached thumbnail can outlive the file it was generated
# from across a deploy. Clear it every deploy so a swapped-in photo is never
# served stale — this doesn't touch the rest of the .next build cache.
rm -rf .next/cache/images

npm ci
npm run build

# Zero-downtime reload: PM2 swaps in the freshly-built process.
pm2 reload lofty-store-app --update-env

echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) deployed $(git rev-parse --short HEAD)"
