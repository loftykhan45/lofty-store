// Lofty Store — GitHub webhook listener.
// Listens on localhost only; Caddy reverse-proxies /deploy-hook to it.
// On a verified push to main, runs deploy.sh (build + PM2 reload).
//
// Setup:
//   1. npm install (no deps needed, uses only node builtins)
//   2. Set WEBHOOK_SECRET below (or via env var) to a random string.
//   3. Add the same secret as the webhook secret in
//      GitHub repo -> Settings -> Webhooks -> Add webhook:
//        Payload URL: https://lofty.24-144-105-14.sslip.io/deploy-hook
//        Content type: application/json
//        Secret: <same random string>
//        Events: just "push"
//   4. Run this as a systemd service (see lofty-deploy-hook.service).

const http = require("http");
const crypto = require("crypto");
const { execFile } = require("child_process");

const PORT = process.env.DEPLOY_HOOK_PORT || 7777;
const SECRET = process.env.WEBHOOK_SECRET || "CHANGE_ME_TO_A_RANDOM_SECRET";
const DEPLOY_SCRIPT = process.env.DEPLOY_SCRIPT || "/var/www/lofty-store/deploy/deploy.sh";
const BRANCH = "refs/heads/main";

function verifySignature(payload, signature) {
  if (!signature) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/deploy-hook") {
    res.writeHead(404).end("not found");
    return;
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    const signature = req.headers["x-hub-signature-256"];
    if (!verifySignature(body, signature)) {
      console.error("Rejected webhook: bad signature");
      res.writeHead(401).end("bad signature");
      return;
    }

    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      res.writeHead(400).end("bad payload");
      return;
    }

    if (payload.ref !== BRANCH) {
      res.writeHead(200).end("ignored (not main)");
      return;
    }

    res.writeHead(200).end("deploying");
    console.log(`${new Date().toISOString()} push to main, running deploy script`);
    execFile(DEPLOY_SCRIPT, { timeout: 5 * 60 * 1000 }, (err, stdout, stderr) => {
      if (err) {
        console.error("Deploy failed:", err.message, stderr);
        return;
      }
      console.log(stdout.trim());
    });
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Deploy webhook listening on 127.0.0.1:${PORT}`);
});
