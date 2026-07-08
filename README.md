# Deploying lofty-store to the VPS

This site is plain static HTML/CSS/JS — no build step. Caddy just serves the
files directly; "deploying" means getting the latest git commit onto disk.

## One-time setup (run on the VPS, as whatever user owns Caddy)

```bash
sudo mkdir -p /var/www/lofty-store
sudo chown $USER:$USER /var/www/lofty-store
git clone https://github.com/loftykhan45/lofty-store.git /var/www/lofty-store
chmod +x /var/www/lofty-store/deploy/deploy.sh
```

Merge `deploy/Caddyfile.snippet` into the existing Caddyfile (the site block
for `lofty.24-144-105-14.sslip.io` — don't create a second one), then:

```bash
sudo systemctl reload caddy
```

## Manual update (works right now, no extra services needed)

Whenever there's a new commit on `main`:

```bash
/var/www/lofty-store/deploy/deploy.sh
```

## Automatic update on every push (optional, recommended)

1. Pick a random secret, e.g. `openssl rand -hex 20`.
2. Edit `deploy/lofty-deploy-hook.service`: set `WEBHOOK_SECRET` to that value.
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
   verifies GitHub's signature and runs `deploy.sh`.

The listener only accepts requests with a valid HMAC signature from GitHub,
and only acts on pushes to `main`, so it's safe to expose the path publicly.
