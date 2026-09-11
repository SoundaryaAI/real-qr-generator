"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CURATED_TEMPLATES } from "@/lib/storage/qr-store";
import { QrPreview } from "@/components/qr/QrPreview";
import { formatPayload } from "@/lib/qr/formatters";
import { Button } from "@/components/ui";
import {
  Sparkles,
  ArrowRight,
  Eye,
  QrCode,
  Image as ImageIcon,
} from "lucide-react";

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<Record<string, "image" | "qr">>({});

  const categories = [
    { id: "all", label: "All Templates" },
    { id: "restaurant", label: "Restaurant & Cafe" },
    { id: "business", label: "Business & vCard" },
    { id: "wifi", label: "Wi-Fi Access" },
    { id: "social", label: "Social & Bio Link" },
    { id: "retail", label: "Retail & Promo" },
    { id: "event", label: "Event & Wedding" },
  ];

  const filteredTemplates =
    selectedCategory === "all"
      ? CURATED_TEMPLATES
      : CURATED_TEMPLATES.filter((t) => t.category === selectedCategory);

  const toggleView = (id: string, mode: "image" | "qr") => {
    setViewMode((prev) => ({ ...prev, [id]: mode }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-World Mockup Gallery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Ready-to-Use QR Templates
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Explore real-world visual applications of custom QR codes. From restaurant tabletops to
          executive business cards and retail flyers, customize any preset with one click.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-6 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat.id
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-400"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((template) => {
          const payload = formatPayload({
            type: template.contentType,
            ...template.defaultData,
          });

          const currentView = viewMode[template.id] || "image";

          return (
            <div
              key={template.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Real-World Context Photo Banner with Overlay */}
                <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 shadow-xs bg-slate-100 dark:bg-slate-800">
                  <img
                    src={template.imageUrl}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg text-white border border-white/20">
                        {template.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase bg-brand-600/90 text-white px-2 py-0.5 rounded-md shadow-xs">
                        {template.contentType}
                      </span>
                    </div>

                    <div className="text-white">
                      <span className="text-[11px] font-semibold text-white/80 block">
                        Real-World Context Mockup
                      </span>
                      <p className="text-xs font-bold truncate">{template.title}</p>
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {template.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 min-h-[36px]">
                  {template.description}
                </p>

                {/* Switcher Tabs: Show Real-World Photo vs Live QR Preview */}
                <div className="flex items-center justify-between mb-3 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => toggleView(template.id, "image")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      currentView === "image"
                        ? "bg-white dark:bg-slate-900 text-brand-600 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Real-World Mockup</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleView(template.id, "qr")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      currentView === "qr"
                        ? "bg-white dark:bg-slate-900 text-brand-600 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Scannable QR</span>
                  </button>
                </div>

                {/* View Container: Displays either the Live Scannable QR or the Large Photo */}
                <div className="py-4 px-2 flex justify-center items-center bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-5 min-h-[290px]">
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
                          Designed for print on menus, packaging, stationery & displays.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Link href={`/?template=${template.id}`} className="w-full block">
                <Button variant="primary" className="w-full">
                  <span>Use This Template in Studio</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
