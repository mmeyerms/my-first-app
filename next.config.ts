import type { NextConfig } from "next";

/**
 * Global response headers — defense in depth. The middleware.ts ALSO sets
 * these on every HTML response, but headers() here catches static assets
 * and any edge cases where the middleware might not run (e.g. specific
 * error pages).
 *
 * CSP is intentionally NOT set here — CSP has runtime-specific parts
 * (script-src for Vercel Live analytics etc.) that are easier to manage in
 * middleware.ts. If you want CSP on ALL responses without middleware,
 * duplicate the CSP_DIRECTIVES from middleware.ts here.
 */
const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Remove the X-Powered-By: Next.js disclosure header.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
