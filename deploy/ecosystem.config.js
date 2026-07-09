// PM2 process definition for the Lofty Store Next.js app.
// Start once: pm2 start deploy/ecosystem.config.js
// Persist across reboots (one-time): pm2 save && pm2 startup   (then run the
// sudo command pm2 startup prints, then `pm2 save` again)
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
      },
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
