// PM2 process definition for the Lofty Store Next.js app.
// Start once: pm2 start deploy/ecosystem.config.js
// Persist across reboots (one-time): pm2 save && pm2 startup   (then run the
// sudo command pm2 startup prints, then `pm2 save` again)
//
// IMPORTANT: ADMIN_USER / ADMIN_PASSWORD below protect the /admin orders
// portal (HTTP Basic Auth, see middleware.ts). Change these before deploying
// — the defaults baked into the app if these are unset are publicly known
// (they're in this open-source repo) and must not be relied on in production.
module.exports = {
  apps: [
    {
      name: "lofty-store-app",
      script: "npm",
      args: "start",
      cwd: __dirname + "/..",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        ADMIN_USER: "admin",
        ADMIN_PASSWORD: "CHANGE_ME_BEFORE_DEPLOY",
      },
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
