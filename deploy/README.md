# Deploying lofty-store (Next.js version) to the VPS

This replaces the old static-file deploy. The site is now a **persistent
Node.js process** (Next.js, built with `npm run build`, run with `npm start`,
supervised by PM2) sitting behind Caddy as a reverse proxy — not plain files
served by `file_server` anymore.

Throughout, `<DEPLOY_USER>` means whatever unix user will own
`/var/www/lofty-store` on the VPS. Use the **same user** everywhere below
(git clone, npm/pm2, and the webhook service) so file permissions don't
mismatch.

## One-time setup (run on the VPS as `<DEPLOY_USER>`)

```bash
sudo mkdir -p /var/www/lofty-store
sudo chown <DEPLOY_USER>:<DEPLOY_USER> /var/www/lofty-store
git clone https://github.com/loftykhan45/lofty-store.git /var/www/lofty-store
cd /var/www/lofty-store

npm ci
npm run build
```

If `npm ci` fails compiling `better-sqlite3` (a native module), install build
tools and retry:

```bash
sudo apt-get update && sudo apt-get install -y build-essential python3
npm ci
```

Install PM2 and start the app:

```bash
sudo npm install -g pm2
pm2 start deploy/ecosystem.config.js
pm2 save
pm2 startup   # prints a one-time sudo command — run it, then `pm2 save` again
              # so the app survives a VPS reboot
```

The app now listens on `127.0.0.1:3000`. Merge `deploy/Caddyfile.snippet`
into the existing Caddyfile — **replace** the old `file_server` block for
`lofty.24-144-105-14.sslip.io`, don't create a second site block — then:

```bash
sudo systemctl reload caddy
```

Visit `https://lofty.24-144-105-14.sslip.io/` to confirm it's live.

## Manual update (works right now, no extra services needed)

Whenever there's a new commit on `main`:

```bash
/var/www/lofty-store/deploy/deploy.sh
```

This pulls, rebuilds, and does a zero-downtime PM2 reload. It preserves
`data/lofty.db` (the order database) — deploys never wipe it.

## Automatic update on every push (optional, recommended)

1. Pick a random secret, e.g. `openssl rand -hex 20`.
2. Edit `deploy/lofty-deploy-hook.service`: set `WEBHOOK_SECRET` to that
   value, and replace `<DEPLOY_USER>` with the real username. If node/npm/pm2
   were installed via nvm rather than a system package, add nvm's bin
   directory to the `PATH=` line too (`which node` as `<DEPLOY_USER>` to find
   it) — systemd services don't get your shell's normal PATH.
3. Install and start the listener:
   ```bash
   sudo cp /var/www/lofty-store/deploy/lofty-deploy-hook.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable --now lofty-deploy-hook
   ```
4. In GitHub: repo → Settings → Webhooks → Add webhook
   - Payload URL: `https://lofty.24-144-105-14.sslip.io/deploy-hook`
   - Content type: `application/json`
   - Secret: the same random value from step 1
   - Events: just "push"
5. Push to `main` — Caddy forwards `/deploy-hook` to the listener, which
   verifies GitHub's signature and runs `deploy.sh` (build takes maybe
   30-90s; the listener allows up to 5 minutes before giving up).

The listener only accepts requests with a valid HMAC signature from GitHub,
and only acts on pushes to `main`, so it's safe to expose the path publicly.

## Rolling back a bad deploy

```bash
cd /var/www/lofty-store
git log --oneline -5          # find the last good commit
git reset --hard <good-sha>
npm ci && npm run build
pm2 reload lofty-store-app --update-env
```

Check `pm2 logs lofty-store-app` if the app won't start after a deploy.
