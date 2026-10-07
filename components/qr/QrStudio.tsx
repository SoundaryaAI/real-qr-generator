"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  ContentPayload,
  ContentType,
  QRDesignConfig,
  QRCodeRecord,
} from "@/types/qr";
import { formatPayload } from "@/lib/qr/formatters";
import { DEFAULT_DESIGN, saveQr, CURATED_TEMPLATES } from "@/lib/storage/qr-store";
import { useAuth } from "@/lib/supabase/auth-context";
import { saveCloudQr } from "@/lib/supabase/cloud-store";
import { ContentFormManager, CONTENT_TYPE_CONFIG } from "./ContentTabs";
import {
  ColorPanel,
  ShapePanel,
  FramePanel,
  LogoPanel,
  SecurityPanel,
} from "./StylePanels";
import { QrPreview } from "./QrPreview";
import { QrHealthScore } from "./QrHealthScore";
import { Button, Input } from "@/components/ui";
import {
  Palette,
  Shapes,
  Frame,
  Image as ImageIcon,
  ShieldCheck,
  Zap,
  Lock,
  LayoutGrid,
  Settings2,
  Sparkles,
} from "lucide-react";

export function QrStudio() {
  // Mode: Dynamic vs Static
  const [isDynamic, setIsDynamic] = useState<boolean>(true);
  const [qrTitle, setQrTitle] = useState<string>("My New QR Code");

  // Content Payload State
  const [content, setContent] = useState<ContentPayload>({
    type: "url",
    url: "https://yourwebsite.com",
  });

  // Design State
  const [design, setDesign] = useState<QRDesignConfig>(DEFAULT_DESIGN);

  // Active Customization Tab
  const [activeStyleTab, setActiveStyleTab] = useState<
    "colors" | "shapes" | "frames" | "logo" | "security"
  >("colors");

  // Format the raw encoded payload
  const rawPayload = useMemo(() => {
    return formatPayload(content);
  }, [content]);

  // Generate a mock short code for dynamic preview
  const mockShortCode = useMemo(() => {
    return "preview";
  }, []);

  const [dynamicShortUrl, setDynamicShortUrl] = useState(`/r/${mockShortCode}`);

  useEffect(() => {
    // Keep the server and first client render identical, then add the browser origin.
    setDynamicShortUrl(`${window.location.origin}/r/${mockShortCode}`);
  }, [mockShortCode]);

  // Switch content type handler
  const handleTypeSelect = (type: ContentType) => {
    setContent((prev) => ({ ...prev, type }));
  };

  const { user } = useAuth();

  // Save QR to cloud / local storage / dashboard
  const handleSaveQr = async () => {
    const newRecord: QRCodeRecord = {
      id: `qr_${Date.now()}`,
      title: qrTitle || "Untitled QR",
      qrType: isDynamic ? "dynamic" : "static",
      contentType: content.type,
      rawPayload,
      shortCode: isDynamic ? mockShortCode : undefined,
      destinationUrl: isDynamic ? rawPayload : undefined,
      contentData: content,
      design,
      createdAt: new Date().toISOString(),
      scanCount: 0,
      isActive: true,
    };
    await saveCloudQr(newRecord, user?.id ?? null);
  };

  // Apply a template preset
  const applyTemplate = (templateId: string) => {
    const tmpl = CURATED_TEMPLATES.find((t) => t.id === templateId);
    if (!tmpl) return;
    setDesign(tmpl.design);
    setQrTitle(tmpl.defaultTitle);
    setContent({
      type: tmpl.contentType,
      ...tmpl.defaultData,
    });
  };

  // Check URL query param for template preset on initial mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const templateId = params.get("template");
      if (templateId) {
        applyTemplate(templateId);
      }
    }
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero Watermarks • Unlimited Scans • Free Forever</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Real-Time QR Generator Studio
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Design vector-grade, customizable QR codes with live scannability health checks.
          </p>
        </div>

        {/* Dynamic vs Static Switcher Pill */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setIsDynamic(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isDynamic
                ? "bg-white dark:bg-slate-900 shadow-md text-brand-600 dark:text-brand-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Dynamic QR (Editable & Tracked)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDynamic(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              !isDynamic
                ? "bg-white dark:bg-slate-900 shadow-md text-brand-600 dark:text-brand-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Static QR (Permanent)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Control Panel (2 Cols) | Right Preview (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Content & Customization Panels (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Template Switcher Strip */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5 text-brand-600" />
                Quick Templates
              </span>
              <span className="text-xs text-slate-400">Click to apply full preset</span>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {CURATED_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyTemplate(t.id)}
                  className="p-1.5 pr-3.5 rounded-2xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 border border-slate-200 dark:border-slate-700 shrink-0 transition-all flex items-center gap-2.5 shadow-xs group"
                >
                  <img
                    src={t.imageUrl}
                    alt={t.title}
                    className="w-8 h-8 rounded-xl object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="text-left">
                    <span className="block font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {t.title}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      {t.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 1: Content Type Selection */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold">
                  1
                </span>
                Choose QR Content Type
              </h2>
            </div>

            {/* Horizontal Scrollable/Grid Type Badges */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 mb-6">
              {CONTENT_TYPE_CONFIG.map((cfg) => {
                const Icon = cfg.icon;
                const isSelected = content.type === cfg.type;
                return (
                  <button
                    key={cfg.type}
                    type="button"
                    onClick={() => handleTypeSelect(cfg.type)}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                      isSelected
                        ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold shadow-sm ring-1 ring-brand-500"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1.5" />
                    <span className="text-xs leading-tight">{cfg.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Title Input */}
            <div className="mb-4">
              <Input
                label="QR Campaign / File Title"
                value={qrTitle}
                onChange={(e) => setQrTitle(e.target.value)}
                placeholder="E.g., Restaurant Menu or Wi-Fi Sign"
              />
            </div>

            {/* Dynamic Content Form */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80">
              <ContentFormManager data={content} onChange={setContent} />
            </div>
          </div>

          {/* STEP 2: Design & Customization Tabs */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-5">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold">
                2
              </span>
              Design & Branding
            </h2>

            {/* Sub-tabs for Style Categories */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 mb-6 overflow-x-auto pb-1">
              {[
                { id: "colors", label: "Colors", icon: Palette },
                { id: "shapes", label: "Shapes", icon: Shapes },
                { id: "frames", label: "Frames", icon: Frame },
                { id: "logo", label: "Brand Logo", icon: ImageIcon },
                { id: "security", label: "Error Recovery", icon: ShieldCheck },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeStyleTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveStyleTab(tab.id as any)}
                    className={`flex items-center gap-2 py-2 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? "border-brand-600 text-brand-600 dark:text-brand-400"
                        : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Style Tab Content */}
            {activeStyleTab === "colors" && (
              <ColorPanel design={design} onChange={setDesign} />
            )}
            {activeStyleTab === "shapes" && (
              <ShapePanel design={design} onChange={setDesign} />
            )}
            {activeStyleTab === "frames" && (
              <FramePanel design={design} onChange={setDesign} />
            )}
            {activeStyleTab === "logo" && (
              <LogoPanel design={design} onChange={setDesign} />
            )}
            {activeStyleTab === "security" && (
              <SecurityPanel design={design} onChange={setDesign} />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Preview, Health Score & Downloads (5 Cols Sticky) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
          {/* Live Preview Container */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-brand-600" />
                Live Preview
              </h3>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Real-Time Render
              </span>
            </div>

            <QrPreview
              payload={rawPayload}
              design={design}
              title={qrTitle}
              isDynamic={isDynamic}
              shortUrl={dynamicShortUrl}
              onSave={handleSaveQr}
            />
          </div>

          {/* QR Scannability Health Score */}
          <QrHealthScore
            design={design}
            payloadLength={rawPayload.length}
          />

          {/* Educational Intern Note Card */}
          <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-900/40 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <p className="font-bold text-brand-800 dark:text-brand-300">
              💡 Production Architecture Note:
            </p>
            <p>
              When <strong>Dynamic QR</strong> is enabled, scanning routes through{" "}
              <code className="px-1 py-0.5 rounded bg-brand-200/50 dark:bg-brand-900/60 font-mono text-[11px] text-brand-900 dark:text-brand-200">
                /r/[code]
              </code>
              . This logs the scan in real-time and allows you to change the destination URL at any point in the future without reprinting!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
