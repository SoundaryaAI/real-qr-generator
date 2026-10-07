"use client";

/**
 * Cloud QR Store — wraps the existing localStorage store with Supabase.
 *
 * When a user is signed in:
 *   - All reads come from Supabase (with an in-memory cache)
 *   - All writes go to Supabase AND update the cache
 *
 * When a user is NOT signed in (guest):
 *   - Falls back to localStorage (via the original qr-store helpers)
 */

import { getSupabaseClient } from "@/lib/supabase/client";
import { getStoredQrs, saveQr as saveLocalQr, deleteQr as deleteLocalQr } from "@/lib/storage/qr-store";
import { QRCodeRecord, ScanEvent } from "@/types/qr";

// ─── helpers ────────────────────────────────────────────────────────────────

function toRecord(row: Record<string, unknown>): QRCodeRecord {
  return {
    id: row.id as string,
    title: row.title as string,
    qrType: row.qr_type as "static" | "dynamic",
    contentType: (row.content_type as QRCodeRecord["contentType"]),
    rawPayload: ((row.content_data as Record<string, unknown>)?.rawPayload as string) ?? "",
    shortCode: row.short_code as string | undefined,
    destinationUrl: row.destination_url as string | undefined,
    contentData: (row.content_data as QRCodeRecord["contentData"]),
    design: (row.design as QRCodeRecord["design"]),
    createdAt: row.created_at as string,
    scanCount: (row.scan_count as number) ?? 0,
    isActive: (row.is_active as boolean) ?? true,
    expiresAt: row.expires_at as string | undefined,
    maxScans: row.max_scans as number | undefined,
    folder: (row.folder as string) ?? "General",
    tags: (row.tags as string[]) ?? [],
  };
}

function toDbRow(qr: QRCodeRecord, userId: string) {
  return {
    id: qr.id,
    user_id: userId,
    title: qr.title,
    short_code: qr.shortCode ?? qr.id.slice(0, 8),
    qr_type: qr.qrType,
    content_type: qr.contentType,
    destination_url: qr.destinationUrl ?? null,
    content_data: { ...qr.contentData, rawPayload: qr.rawPayload },
    design: qr.design,
    is_active: qr.isActive,
    expires_at: qr.expiresAt ?? null,
    max_scans: qr.maxScans ?? null,
    scan_count: qr.scanCount,
    folder: qr.folder ?? "General",
    tags: qr.tags ?? [],
  };
}

// ─── public API ─────────────────────────────────────────────────────────────

export async function getCloudQrs(userId: string | null): Promise<QRCodeRecord[]> {
  if (!userId) return getStoredQrs();

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCloudQrs error:", error.message);
    return getStoredQrs();
  }

  return (data ?? []).map(toRecord);
}

export async function saveCloudQr(qr: QRCodeRecord, userId: string | null): Promise<void> {
  if (!userId) {
    saveLocalQr(qr);
    return;
  }

  const supabase = getSupabaseClient();
  const row = toDbRow(qr, userId);

  const { error } = await supabase
    .from("qr_codes")
    .upsert(row, { onConflict: "id" });

  if (error) {
    console.error("saveCloudQr error:", error.message);
    // Fallback so the user doesn't lose data
    saveLocalQr(qr);
  }
}

export async function deleteCloudQr(id: string, userId: string | null): Promise<void> {
  if (!userId) {
    deleteLocalQr(id);
    return;
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("qr_codes")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("deleteCloudQr error:", error.message);
  }
}

// ─── Scan logging ─────────────────────────────────────────────────────────

export async function logCloudScan(scan: ScanEvent): Promise<void> {
  const supabase = getSupabaseClient();

  // Fire-and-forget — increment counter atomically
  await supabase.rpc("increment_qr_scans", { qr_id: scan.qrCodeId });

  // Insert scan event row
  await supabase.from("scans").insert({
    id: scan.id,
    qr_code_id: scan.qrCodeId,
    scanned_at: scan.scannedAt,
    country: scan.country,
    city: scan.city,
    device_type: scan.deviceType,
    os: scan.os,
    browser: scan.browser,
    referrer: scan.referrer,
  });
}

export async function getCloudScans(qrCodeId: string, userId: string | null): Promise<ScanEvent[]> {
  if (!userId) return [];

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("scans")
    .select("*")
    .eq("qr_code_id", qrCodeId)
    .order("scanned_at", { ascending: false })
    .limit(500);

  if (error) return [];

  return (data ?? []).map((row) => ({
    id: row.id as string,
    qrCodeId: row.qr_code_id as string,
    scannedAt: row.scanned_at as string,
    country: row.country as string,
    city: row.city as string,
    deviceType: row.device_type as string,
    os: row.os as string,
    browser: row.browser as string,
    referrer: row.referrer as string,
  }));
}
