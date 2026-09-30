"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { CURATED_TEMPLATES } from "@/lib/storage/qr-store";
import { QrPreview } from "@/components/qr/QrPreview";
import { formatPayload } from "@/lib/qr/formatters";
import { Button } from "@/components/ui";
import QRCode from "qrcode";
import {
  Sparkles,
  ArrowRight,
  QrCode,
  Image as ImageIcon,
  Search,
  Download,
  Check,
  Tag,
  Filter,
} from "lucide-react";

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<Record<string, "image" | "qr">>({});
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: "all", label: "All Templates" },
    { id: "menu", label: "Menu & Food" },
    { id: "social", label: "List of Links & Bio" },
    { id: "app", label: "App Markets" },
    { id: "coupon", label: "Coupons & Discounts" },
    { id: "feedback", label: "Feedback & Reviews" },
    { id: "wifi", label: "Wi-Fi Access" },
    { id: "business", label: "Business & vCard" },
    { id: "pets", label: "Pets & Collar ID" },
    { id: "event", label: "Events & Tickets" },
    { id: "video", label: "Video & Media" },
    { id: "medical", label: "Medical & Health" },
    { id: "pdf", label: "PDF & Manuals" },
  ];

  const filteredTemplates = useMemo(() => {
    return CURATED_TEMPLATES.filter((template) => {
      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        template.title.toLowerCase().includes(q) ||
        template.description.toLowerCase().includes(q) ||
        template.category.toLowerCase().includes(q) ||
        (template.design.frameText && template.design.frameText.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const toggleView = (id: string, mode: "image" | "qr") => {
    setViewMode((prev) => ({ ...prev, [id]: mode }));
  };

  const handleDownloadQr = async (template: (typeof CURATED_TEMPLATES)[0]) => {
    setDownloadingId(template.id);
    try {
      const payload = formatPayload({
        type: template.contentType,
        ...template.defaultData,
      });

      const dataUrl = await QRCode.toDataURL(payload, {
        width: 1024,
        margin: 2,
        errorCorrectionLevel: template.design.errorCorrectionLevel,
        color: {
          dark: template.design.dotsColor || "#0f172a",
          light: template.design.bgColor || "#ffffff",
        },
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${template.id}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Template QR export error:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ME-QR Style Ready-to-Use Gallery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Custom QR Code Templates
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Explore professionally designed QR templates with custom frames, call-to-action banners, and tailored styles for restaurants, apps, reviews, events, pets, and business.
        </p>

        {/* Search Bar */}
        <div className="mt-6 max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates (e.g. menu, wifi, review, pet, app)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat.id
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-400"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

  const filteredTemplates = useMemo(() => {
    return CURATED_TEMPLATES.filter((template) => {
      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        template.title.toLowerCase().includes(q) ||
        template.description.toLowerCase().includes(q) ||
        template.category.toLowerCase().includes(q) ||
        (template.design.frameText && template.design.frameText.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const toggleView = (id: string, mode: "image" | "qr") => {
    setViewMode((prev) => ({ ...prev, [id]: mode }));
  };

  const handleDownloadQr = async (template: (typeof CURATED_TEMPLATES)[0]) => {
    setDownloadingId(template.id);
    try {
      const payload = formatPayload({
        type: template.contentType,
        ...template.defaultData,
      });

      const dataUrl = await QRCode.toDataURL(payload, {
        width: 1024,
        margin: 2,
        errorCorrectionLevel: template.design.errorCorrectionLevel,
        color: {
          dark: template.design.dotsColor || "#0f172a",
          light: template.design.bgColor || "#ffffff",
        },
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${template.id}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Template QR export error:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ME-QR Style Ready-to-Use Gallery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Custom QR Code Templates
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Explore professionally designed QR templates with custom frames, call-to-action banners, and tailored styles for restaurants, apps, reviews, events, pets, and business.
        </p>

        {/* Search Bar */}
        <div className="mt-6 max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates (e.g. menu, wifi, review, pet, app)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center flex-wrap gap-2 pb-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-400"
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-md mx-auto">
          <Filter className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No templates found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Try adjusting your search keyword or selected category filter.
          </p>
          <Button variant="outline" onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => {
            const payload = formatPayload({
              type: template.contentType,
              ...template.defaultData,
            });

            // Default view mode is "qr" so the custom frame design is immediately visible
            const currentView = viewMode[template.id] || "qr";

            return (
              <div
                key={template.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Banner with Overlay */}
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 shadow-xs bg-slate-100 dark:bg-slate-800">
                    <img
                      src={template.imageUrl}
                      alt={template.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-white border border-white/20">
                          {template.category}
                        </span>
                        <span className="text-[10px] font-mono font-bold uppercase bg-brand-600/90 text-white px-2 py-0.5 rounded-md shadow-xs">
                          {template.contentType}
                        </span>
                      </div>

                      <div className="text-white">
                        <span className="text-[11px] font-semibold text-white/80 block">
                          Industry Template
                        </span>
                        <p className="text-xs font-bold truncate">{template.title}</p>
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {template.title}
                    </h3>
                    {template.design.frameText && (
                      <span className="shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {template.design.frameText}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 min-h-[36px]">
                    {template.description}
                  </p>

                  {/* Switcher Tabs: Scannable QR vs Real-World Photo */}
                  <div className="flex items-center justify-between mb-3 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => toggleView(template.id, "qr")}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        currentView === "qr"
                          ? "bg-white dark:bg-slate-900 text-brand-600 shadow-xs"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Custom Frame QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleView(template.id, "image")}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        currentView === "image"
                          ? "bg-white dark:bg-slate-900 text-brand-600 shadow-xs"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Context Mockup</span>
                    </button>
                  </div>

                  {/* View Container: Live Scannable Framed QR or Large Mockup */}
                  <div className="py-4 px-2 flex justify-center items-center bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-5 min-h-[300px]">
                    {currentView === "qr" ? (
                      <div className="scale-90">
                        <QrPreview
                          payload={payload}
                          design={template.design}
                          title={template.title}
                          isDynamic={false}
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-inner group/mockup">
                        <img
                          src={template.imageUrl}
                          alt={template.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center text-white">
                          <div className="w-24 h-24 bg-white p-2 rounded-2xl shadow-xl mb-3 flex items-center justify-center">
                            <div
                              className="w-full h-full rounded-lg border-2 border-dashed flex items-center justify-center font-mono text-[11px] font-bold"
                              style={{
                                borderColor: template.design.dotsColor,
                                color: template.design.dotsColor,
                              }}
                            >
                              [QR CODE]
                            </div>
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                            {template.design.frameText || "SCAN HERE"}
                          </span>
                          <p className="text-[11px] text-white/90 mt-1 max-w-xs">
                            Designed for print on menus, packaging, table tents & displays.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Link href={`/?template=${template.id}`} className="flex-1 block">
                    <Button variant="primary" className="w-full text-xs">
                      <span>Use in Studio</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    onClick={() => handleDownloadQr(template)}
                    disabled={downloadingId === template.id}
                    className="px-3 text-xs"
                    title="Quick download PNG"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
