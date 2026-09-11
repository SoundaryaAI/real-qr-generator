"use client";

import React, { useState } from "react";
import { QrPreview } from "@/components/qr/QrPreview";
import { DEFAULT_DESIGN } from "@/lib/storage/qr-store";
import { Button } from "@/components/ui";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Sparkles,
  Layers,
  FileText,
} from "lucide-react";

interface BulkItem {
  id: string;
  title: string;
  url: string;
}

export default function BulkPage() {
  const [csvText, setCsvText] = useState<string>(
    "Title,URL\nProduct 101 - Blue Shoes,https://example.com/products/101\nProduct 102 - Red Hat,https://example.com/products/102\nProduct 103 - Green Jacket,https://example.com/products/103"
  );
  const [items, setItems] = useState<BulkItem[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleParseCsv = () => {
    setProcessing(true);
    try {
      const lines = csvText.split("\n").map((l) => l.trim()).filter(Boolean);
      const parsed: BulkItem[] = [];

      // Skip header if present
      const startIdx = lines[0].toLowerCase().includes("title") || lines[0].toLowerCase().includes("url") ? 1 : 0;

      for (let i = startIdx; i < lines.length; i++) {
        const parts = lines[i].split(",").map((p) => p.trim());
        if (parts.length >= 2) {
          parsed.push({
            id: `bulk-${i}`,
            title: parts[0] || `Item ${i}`,
            url: parts[1] || "https://example.com",
          });
        }
      }

      setItems(parsed);
    } catch (err) {
      console.error(err);
      alert("Failed to parse CSV. Please check formatting.");
    } finally {
      setProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Batch Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Bulk QR Generator from CSV
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Generate hundreds of product or catalog QR codes simultaneously directly from a spreadsheet.
          100% processed client-side with zero server bottleneck.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-brand-600" />
                Upload or Paste CSV
              </h3>
            </div>

            {/* File Upload Trigger */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-500 rounded-2xl p-6 text-center cursor-pointer transition-all">
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-file-input"
              />
              <label htmlFor="csv-file-input" className="cursor-pointer block">
                <Upload className="w-6 h-6 mx-auto text-brand-600 mb-2" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Click to select .CSV spreadsheet
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Columns: Title, Destination URL
                </span>
              </label>
            </div>

            {/* Direct CSV Text Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Or Paste CSV Data Below
              </label>
              <textarea
                rows={8}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                placeholder="Title,URL"
              />
            </div>

            <Button
              variant="primary"
              onClick={handleParseCsv}
              disabled={processing}
              className="w-full"
            >
              <Layers className="w-4 h-4" />
              <span>Generate All QR Codes</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Generated Batch Results */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Generated Batch List ({items.length} codes)
              </h3>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">
                <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                Click &quot;Generate All QR Codes&quot; to preview and export the batch.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-between text-center"
                  >
                    <div className="mb-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono truncate block max-w-[200px]">
                        {item.url}
                      </span>
                    </div>

                    <div className="scale-75 -my-4">
                      <QrPreview
                        payload={item.url}
                        design={DEFAULT_DESIGN}
                        title={item.title}
                        isDynamic={false}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
