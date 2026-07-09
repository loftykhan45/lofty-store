import { NextRequest, NextResponse } from "next/server";

// Set ADMIN_USER / ADMIN_PASSWORD in the environment on the VPS (see
// deploy/ecosystem.config.js and deploy/README.md) — these defaults are only
// for local development and must not be relied on in production.
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "lofty2026";

export function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf-8");
    const sepIndex = decoded.indexOf(":");
    const user = decoded.slice(0, sepIndex);
    const pass = decoded.slice(sepIndex + 1);
    if (user === ADMIN_USER && pass === ADMIN_PASSWORD) {
      return NextResponse.next();
    }
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Lofty Store Admin"' },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
