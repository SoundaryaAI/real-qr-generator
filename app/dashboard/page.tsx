"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { QRCodeRecord } from "@/types/qr";
import {
  getStoredQrs,
  saveQr,
  deleteQr,
  logMockScan,
  DEFAULT_DESIGN,
} from "@/lib/storage/qr-store";
import { Button, Input } from "@/components/ui";
import {
  Search,
  Plus,
  BarChart2,
  Trash2,
  ExternalLink,
  Edit3,
  Power,
  Zap,
  Lock,
  Sparkles,
  Play,
  Check,
  Globe,
  Tag,
} from "lucide-react";

export default function DashboardPage() {
  const [qrs, setQrs] = useState<QRCodeRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "dynamic" | "static">("all");
  const [editingQr, setEditingQr] = useState<QRCodeRecord | null>(null);
  const [newDestinationUrl, setNewDestinationUrl] = useState("");
  const [simulatingId, setSimulatingId] = useState<string | null>(null);

  // Load stored QRs
  useEffect(() => {
    let list = getStoredQrs();
    if (list.length === 0) {
      // Seed sample QR codes if empty so the intern can see a populated dashboard
      const samples: QRCodeRecord[] = [
        {
          id: "qr_demo_1",
          title: "Main Website Landing Page",
          qrType: "dynamic",
          contentType: "url",
          rawPayload: "https://yourbrand.com",
          shortCode: "web2026",
          destinationUrl: "https://yourbrand.com",
          contentData: { type: "url", url: "https://yourbrand.com" },
          design: DEFAULT_DESIGN,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          scanCount: 142,
          isActive: true,
          tags: ["Marketing", "Hero"],
        },
        {
          id: "qr_demo_2",
          title: "Office Guest Wi-Fi",
          qrType: "static",
          contentType: "wifi",
          rawPayload: "WIFI:T:WPA;S:HQ_Guest;P:Welcome2026;;",
          contentData: {
            type: "wifi",
            wifi: { ssid: "HQ_Guest", password: "Welcome2026", encryption: "WPA", hidden: false },
          },
          design: {
            ...DEFAULT_DESIGN,
            dotsColor: "#0d9488",
            bgColor: "#f0fdfa",
            frameStyle: "none",
            frameText: "SCAN ME",
            frameColor: "#0d9488",
          },
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          scanCount: 89,
          isActive: true,
          tags: ["Office", "Internal"],
        },
      ];
      samples.forEach((s) => saveQr(s));
      list = samples;
    }
    setQrs(list);
  }, []);

  const refreshList = () => {
    setQrs(getStoredQrs());
  };

  // Toggle QR Active State
  const toggleActive = (qr: QRCodeRecord) => {
    const updated = { ...qr, isActive: !qr.isActive };
    saveQr(updated);
    refreshList();
  };

  // Delete QR
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this QR code?")) {
      deleteQr(id);
      refreshList();
    }
  };

  // Save edited destination URL
  const handleSaveDestination = () => {
    if (!editingQr) return;
    const updated = {
      ...editingQr,
      destinationUrl: newDestinationUrl,
      rawPayload: newDestinationUrl,
    };
    saveQr(updated);
    setEditingQr(null);
    refreshList();
  };

  // Trigger Mock Real-time Scan
  const handleSimulateScan = (id: string) => {
    setSimulatingId(id);
    logMockScan(id);
    refreshList();
    setTimeout(() => setSimulatingId(null), 1000);
  };

  // Filter QRs
  const filtered = qrs.filter((qr) => {
    const matchesSearch =
      qr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (qr.shortCode && qr.shortCode.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" ? true : qr.qrType === filterType;
    return matchesSearch && matchesType;
  });

  const totalScans = qrs.reduce((acc, curr) => acc + (curr.scanCount || 0), 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header & Metrics Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            QR Campaign Dashboard
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage your dynamic & static QR codes, update destinations live, and monitor real-time scans.
          </p>
        </div>

        <Link href="/">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            <span>Create New QR</span>
          </Button>
        </Link>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total QR Codes
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {qrs.length}
          </div>
          <span className="text-[11px] text-slate-400">Active campaigns</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Scans Logged
          </span>
          <div className="text-2xl font-black text-brand-600 mt-1">{totalScans}</div>
          <span className="text-[11px] text-slate-400">Zero scan limits applied</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Dynamic Redirects
          </span>
          <div className="text-2xl font-black text-amber-500 mt-1">
            {qrs.filter((q) => q.qrType === "dynamic").length}
          </div>
          <span className="text-[11px] text-slate-400">Editable without reprinting</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaigns, tags, short codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        {/* Segmented Filter */}
        <div className="flex rounded-xl bg-slate-200 dark:bg-slate-800 p-1 w-full sm:w-auto">
          {[
            { id: "all", label: "All Codes" },
            { id: "dynamic", label: "Dynamic Only" },
            { id: "static", label: "Static Only" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterType(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === f.id
                  ? "bg-white dark:bg-slate-900 text-brand-600 shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* QR Codes List / Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No QR codes found
            </p>
            <p className="text-xs text-slate-400 mt-1">Try modifying your search or filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((qr) => (
              <div
                key={qr.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all"
              >
                {/* QR Basic Info */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: qr.design.bgColor || "#ffffff",
                      borderColor: qr.design.dotsColor || "#0f172a",
                    }}
                  >
                    <span
                      className="text-xs font-black"
                      style={{ color: qr.design.dotsColor || "#0f172a" }}
                    >
                      QR
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {qr.title}
                      </h3>
                      {qr.qrType === "dynamic" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Zap className="w-2.5 h-2.5" />
                          Dynamic
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          <Lock className="w-2.5 h-2.5" />
                          Static
                        </span>
                      )}

                      {!qr.isActive && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-500/10 text-rose-600">
                          Deactivated
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                      <span>Type: {qr.contentType}</span>
                      <span>•</span>
                      <span className="truncate max-w-xs">
                        {qr.destinationUrl || qr.rawPayload}
                      </span>
                    </div>

                    {/* Short link badge */}
                    {qr.shortCode && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-[11px] font-mono text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-900">
                          /r/{qr.shortCode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metrics & Actions */}
                <div className="flex items-center gap-4">
                  {/* Scan Counter */}
                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {qr.scanCount || 0}
                    </span>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                      Total Scans
                    </span>
                  </div>

                  {/* Actions Group */}
                  <div className="flex items-center gap-1.5">
                    {/* Simulate Scan Button */}
                    <button
                      type="button"
                      onClick={() => handleSimulateScan(qr.id)}
                      disabled={simulatingId === qr.id}
                      className="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs font-semibold flex items-center gap-1"
                      title="Simulate a live phone camera scan event"
                    >
                      <Play className="w-3.5 h-3.5 text-brand-500" />
                      <span className="hidden sm:inline">
                        {simulatingId === qr.id ? "Scanned!" : "Test Scan"}
                      </span>
                    </button>

                    {/* Deep Analytics Link */}
                    <Link href={`/analytics/${qr.id}`}>
                      <Button variant="outline" size="sm">
                        <BarChart2 className="w-3.5 h-3.5 text-brand-600" />
                        <span>Analytics</span>
                      </Button>
                    </Link>

                    {/* Edit Destination (Dynamic Only) */}
                    {qr.qrType === "dynamic" && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingQr(qr);
                          setNewDestinationUrl(qr.destinationUrl || "");
                        }}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        title="Edit Destination URL"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Toggle Active */}
                    <button
                      type="button"
                      onClick={() => toggleActive(qr)}
                      className={`p-2 rounded-xl transition-all ${
                        qr.isActive
                          ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          : "text-slate-400 hover:bg-slate-100"
                      }`}
                      title={qr.isActive ? "Deactivate QR" : "Activate QR"}
                    >
                      <Power className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(qr.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                      title="Delete QR"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dynamic URL Modal */}
      {editingQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Edit Dynamic Destination
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update where <strong className="text-slate-700 dark:text-slate-200">{editingQr.title}</strong> points
              without reprinting the physical QR code.
            </p>

            <Input
              label="New Destination URL"
              type="url"
              value={newDestinationUrl}
              onChange={(e) => setNewDestinationUrl(e.target.value)}
              placeholder="https://example.com/updated-page"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setEditingQr(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveDestination}>
                Save Changes Live
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
