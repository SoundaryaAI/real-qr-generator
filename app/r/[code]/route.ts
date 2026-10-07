import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

/**
 * Ultra-Fast Dynamic Redirect & Scan Tracking Engine
 *
 * Scanners hit: /r/[code]
 * The server looks up short_code in Supabase DB, inspects device headers,
 * logs the scan event asynchronously, and issues a 307 temporary redirect.
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
  const os = parser.getOS().name || "Unknown OS";
  const browser = parser.getBrowser().name || "Unknown Browser";

  // 2. Geo Headers (Vercel / Cloudflare IP headers)
  const country = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || "Unknown Country";
  const city = request.headers.get("x-vercel-ip-city") || "Unknown City";

  let targetUrl = "https://example.com";

  // 3. Supabase DB Lookup
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    });

    const { data: qr } = await supabase
      .from("qr_codes")
      .select("id, destination_url, is_active, content_data")
      .eq("short_code", code)
      .single();

    if (qr && qr.is_active && qr.destination_url) {
      targetUrl = qr.destination_url;

      // Asynchronous scan logging (does not block redirect response)
      (async () => {
        try {
          await supabase.rpc("increment_qr_scans", { qr_id: qr.id });
          await supabase.from("scans").insert({
            qr_code_id: qr.id,
            scanned_at: new Date().toISOString(),
            country,
            city,
            device_type: device,
            os,
            browser,
            referrer: request.headers.get("referer") || "Direct / Camera Scan",
          });
        } catch {
          // Non-blocking error handling
        }
      })();
    }
  }

  // 4. Fallback demo dynamic mapping if not found in DB
  if (targetUrl === "https://example.com") {
    if (code === "web2026") {
      targetUrl = "https://yourbrand.com";
    } else if (code.startsWith("app")) {
      if (os === "iOS") {
        targetUrl = "https://apps.apple.com";
      } else if (os === "Android") {
        targetUrl = "https://play.google.com";
      } else {
        targetUrl = "https://example.com/download";
      }
    }
  }

  // 5. Return 307 Temporary Redirect
  return NextResponse.redirect(new URL(targetUrl), 307);
}
