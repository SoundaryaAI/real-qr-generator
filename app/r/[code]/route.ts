import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

export const runtime = "nodejs";

/**
 * Ultra-Fast Dynamic Redirect & Scan Tracking Engine
 *
 * Scanners hit: /r/[code]
 * The server inspects device headers, evaluates smart routing rules,
 * logs the scan asynchronously, and issues a 307 temporary redirect.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // 1. Extract Device, OS, Browser
  const userAgent = request.headers.get("user-agent") || "";
  const parser = new UAParser(userAgent);
  const device = parser.getDevice().type || "desktop";
  const os = parser.getOS().name || "Unknown";
  const browser = parser.getBrowser().name || "Unknown";

  // 2. Zero-Cost Free Edge Geo Headers (Vercel provides these natively for $0)
  const country = request.headers.get("x-vercel-ip-country") || "US";
  const city = request.headers.get("x-vercel-ip-city") || "New York";

  // 3. Smart Routing Resolution (Demo dynamic mapping)
  let targetUrl = "https://example.com";

  // Check known demo codes
  if (code === "web2026") {
    targetUrl = "https://yourbrand.com";
  } else if (code.startsWith("app")) {
    // Smart Routing: OS detection
    if (os === "iOS") {
      targetUrl = "https://apps.apple.com";
    } else if (os === "Android") {
      targetUrl = "https://play.google.com";
    } else {
      targetUrl = "https://example.com/download";
    }
  }

  // 4. Return 307 Temporary Redirect (preserves request method and tells browsers not to permanently cache)
  return NextResponse.redirect(new URL(targetUrl), 307);
}
