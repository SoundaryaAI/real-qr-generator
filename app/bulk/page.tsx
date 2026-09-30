"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui";
import {
  parseCsvData,
  generateBulkItems,
  ParsedCsvResult,
  BulkItem,
} from "@/lib/qr/csv-parser";
import JSZip from "jszip";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Sparkles,
  Layers,
  FileText,
  AlertCircle,
  Copy,
  Check,
  FileType,
  X,
  RefreshCw,
  Table as TableIcon,
} from "lucide-react";

const DEFAULT_CSV = `Title,URL
Product 101 - Blue Shoes,https://example.com/products/101
Product 102 - Red Hat,https://example.com/products/102
Product 103 - Green Jacket,https://example.com/products/103`;

export default function BulkPage() {
  const [csvText, setCsvText] = useState<string>(DEFAULT_CSV);
  const [items, setItems] = useState<BulkItem[]>([]);
  const [parsedResult, setParsedResult] = useState<ParsedCsvResult | null>(null);
  const [selectedUrlCol, setSelectedUrlCol] = useState<string>("URL");
  const [selectedTitleCol, setSelectedTitleCol] = useState<string>("Title");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [exportingZip, setExportingZip] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse CSV text whenever initial mount occurs
  useEffect(() => {
    executeParse(DEFAULT_CSV);
  }, []);

  const executeParse = (text: string, fileInfo?: { name: string; size: string }) => {
    setErrorMsg(null);
    const result = parseCsvData(text);

    if (result.error) {
      setErrorMsg(result.error);
      setParsedResult(null);
      setItems([]);
      return;
    }

    if (result.rows.length === 0) {
      setErrorMsg("No valid data rows found in the CSV. Please ensure at least one row contains data.");
      setParsedResult(null);
      setItems([]);
      return;
    }

    setParsedResult(result);
    setSelectedUrlCol(result.detectedUrlColumn);
    setSelectedTitleCol(result.detectedTitleColumn);

    const generated = generateBulkItems(result, result.detectedUrlColumn, result.detectedTitleColumn);
    setItems(generated);

    if (fileInfo) {
      setUploadedFile(fileInfo);
    }
  };

  const handleManualParse = () => {
    executeParse(csvText);
  };

  const handleUrlColChange = (newCol: string) => {
    setSelectedUrlCol(newCol);
    if (parsedResult) {
      const generated = generateBulkItems(parsedResult, newCol, selectedTitleCol);
      setItems(generated);
    }
  };

  const handleTitleColChange = (newCol: string) => {
    setSelectedTitleCol(newCol);
    if (parsedResult) {
      const generated = generateBulkItems(parsedResult, selectedUrlCol, newCol);
      setItems(generated);
    }
  };

  const processFile = (file: File) => {
    const sizeInKb = (file.size / 1024).toFixed(1) + " KB";
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = (event.target?.result as string) || "";
      setCsvText(content);
      executeParse(content, { name: file.name, size: sizeInKb });
    };

    reader.onerror = () => {
      setErrorMsg("Failed to read the uploaded file. Please check file permissions.");
    };

    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    // Reset file input value so user can upload the same file again if edited
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setCsvText("");
    setParsedResult(null);
    setItems([]);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Bulk ZIP Download
  const handleDownloadZip = async () => {
    if (items.length === 0) return;
    setExportingZip(true);
    setExportProgress(0);

    try {
      const zip = new JSZip();
      const folder = zip.folder("qr-codes") || zip;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const dataUrl = await QRCode.toDataURL(item.url, {
          width: 1024,
          margin: 2,
          errorCorrectionLevel: "M",
          color: {
            dark: "#0f172a",
            light: "#ffffff",
          },
        });

        // Strip prefix data:image/png;base64,
        const base64Data = dataUrl.split(",")[1];
        const sanitizedTitle = item.title
          .toLowerCase()
          .replace(/[^a-z0-9_-]/gi, "-")
          .replace(/-+/g, "-")
          .slice(0, 40);

        const filename = `${String(i + 1).padStart(2, "0")}-${sanitizedTitle || "qr"}.png`;
        folder.file(filename, base64Data, { base64: true });

        setExportProgress(Math.round(((i + 1) / items.length) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `qr-batch-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("ZIP generation error:", err);
      alert("Failed to create ZIP export. Please try again.");
    } finally {
      setExportingZip(false);
      setExportProgress(0);
    }
  };

  // Bulk PDF Print Sheet
  const handleDownloadPdfSheet = async () => {
    if (items.length === 0) return;
    setExportingPdf(true);

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // 3 cols x 4 rows = 12 QR codes per A4 page
      const cols = 3;
      const rows = 4;
      const perPage = cols * rows;
      const marginX = 15;
      const marginY = 20;
      const cellWidth = (pageWidth - marginX * 2) / cols;
      const cellHeight = (pageHeight - marginY * 2 - 15) / rows;
      const qrSize = Math.min(cellWidth - 10, cellHeight - 14);

      let currentPage = 1;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemIndexOnPage = i % perPage;

        if (i > 0 && itemIndexOnPage === 0) {
          pdf.addPage();
          currentPage++;
        }

        // Header banner on first page
        if (itemIndexOnPage === 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(14);
          pdf.setTextColor(15, 23, 42);
          pdf.text("Batch QR Print Sheet", marginX, 12);

          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(8);
          pdf.setTextColor(100, 116, 139);
          pdf.text(`Page ${currentPage} • ${items.length} Total Codes`, pageWidth - marginX, 12, {
            align: "right",
          });
        }

        const colIdx = itemIndexOnPage % cols;
        const rowIdx = Math.floor(itemIndexOnPage / cols);

        const x = marginX + colIdx * cellWidth;
        const y = marginY + rowIdx * cellHeight;

        const dataUrl = await QRCode.toDataURL(item.url, {
          width: 512,
          margin: 1,
          errorCorrectionLevel: "M",
        });

        // Center QR code in cell
        const qrX = x + (cellWidth - qrSize) / 2;
        const qrY = y + 2;

        pdf.addImage(dataUrl, "PNG", qrX, qrY, qrSize, qrSize);

        // Label below QR
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(15, 23, 42);
        const truncatedTitle =
          item.title.length > 22 ? item.title.slice(0, 20) + "..." : item.title;
        pdf.text(truncatedTitle, x + cellWidth / 2, qrY + qrSize + 4, { align: "center" });

        // URL small subtitle
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(6);
        pdf.setTextColor(100, 116, 139);
        const truncatedUrl = item.url.length > 28 ? item.url.slice(0, 26) + "..." : item.url;
        pdf.text(truncatedUrl, x + cellWidth / 2, qrY + qrSize + 7.5, { align: "center" });
      }

      pdf.save(`qr-batch-sheet-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to export PDF sheet. Please try again.");
    } finally {
      setExportingPdf(false);
    }
  };

  // Download individual QR
  const handleDownloadSingle = async (item: BulkItem, format: "png" | "svg") => {
    try {
      const sanitized = item.title.toLowerCase().replace(/[^a-z0-9_-]/gi, "-") || "qr";
      if (format === "png") {
        const dataUrl = await QRCode.toDataURL(item.url, {
          width: 1024,
          margin: 2,
          errorCorrectionLevel: "M",
          color: {
            dark: "#0f172a",
            light: "#ffffff",
          },
        });
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${sanitized}.png`;
        link.click();
      } else {
        const svgString = await QRCode.toString(item.url, {
          type: "svg",
          margin: 2,
        });
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${sanitized}.svg`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Single QR download error:", err);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>High-Speed Batch Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Bulk QR Generator from CSV
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Generate hundreds of product or catalog QR codes simultaneously directly from your spreadsheet.
          Full support for CSV, TSV, comma, semicolon, quotes, and custom column layouts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form & Column Mapper */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-brand-600" />
                Upload Spreadsheet or Paste Data
              </h3>
              {uploadedFile && (
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Drag & Drop File Upload Trigger */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-brand-500 bg-brand-500/5 dark:bg-brand-500/10 scale-[1.01]"
                  : "border-slate-200 dark:border-slate-800 hover:border-brand-500/80 bg-slate-50/50 dark:bg-slate-950/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, text/csv, text/plain, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/tab-separated-values, .tsv, .txt"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-file-input"
              />
              <label htmlFor="csv-file-input" className="cursor-pointer block">
                <Upload className="w-7 h-7 mx-auto text-brand-600 mb-2" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {uploadedFile ? uploadedFile.name : "Click to browse or drag & drop CSV spreadsheet"}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {uploadedFile
                    ? `${uploadedFile.size} • ${parsedResult?.totalRows ?? 0} rows detected`
                    : "Supports .csv, .tsv, .txt • Commas, semicolons, tabs auto-detected"}
                </span>
              </label>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMsg}</div>
              </div>
            )}

            {/* Smart Column Mapping (Shown if 2+ columns present) */}
            {parsedResult && parsedResult.columns.length > 1 && (
              <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-950 dark:text-brand-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-600" />
                    Column Mapping
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Delimiter: {parsedResult.delimiter === "\t" ? "Tab" : parsedResult.delimiter}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      QR Content / URL *
                    </label>
                    <select
                      value={selectedUrlCol}
                      onChange={(e) => handleUrlColChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-brand-500"
                    >
                      {parsedResult.columns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Title / Label
                    </label>
                    <select
                      value={selectedTitleCol}
                      onChange={(e) => handleTitleColChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-brand-500"
                    >
                      {parsedResult.columns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* CSV Raw Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Raw CSV Data
                </label>
                <span className="text-[11px] text-slate-400">
                  {parsedResult ? `${parsedResult.totalRows} rows parsed` : ""}
                </span>
              </div>
              <textarea
                rows={6}
                value={csvText}
                onChange={(e) => {
                  setCsvText(e.target.value);
                  setUploadedFile(null);
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                placeholder="Title,URL&#10;Product 101,https://example.com/101"
              />
            </div>

            <Button
              variant="primary"
              onClick={handleManualParse}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Parse & Generate QR Codes</span>
            </Button>

            {/* Mapped Rows Preview Table */}
            {parsedResult && parsedResult.rows.length > 0 && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <TableIcon className="w-3.5 h-3.5 text-brand-600" />
                  <span>Preview First Mapped Rows</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-36 overflow-y-auto">
                  {items.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                          {idx + 1}. {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block truncate">
                          {item.url}
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded shrink-0">
                        Ready
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Generated Batch Results & Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Header with Bulk Download Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Generated Batch ({items.length} codes)
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    High scannability guaranteed
                  </span>
                </div>
              </div>

              {items.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handleDownloadPdfSheet}
                    disabled={exportingPdf || exportingZip}
                    className="text-xs px-3 py-1.5 h-auto"
                    title="Export printable A4 PDF catalog grid"
                  >
                    <FileType className="w-3.5 h-3.5" />
                    <span>{exportingPdf ? "Generating..." : "Print PDF"}</span>
                  </Button>

                  <Button
                    variant="primary"
                    onClick={handleDownloadZip}
                    disabled={exportingZip || exportingPdf}
                    className="text-xs px-3.5 py-1.5 h-auto bg-brand-600 hover:bg-brand-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      {exportingZip
                        ? `Exporting (${exportProgress}%)`
                        : "Download All (ZIP)"}
                    </span>
                  </Button>
                </div>
              )}
            </div>

            {/* List / Grid of QR codes */}
            {items.length === 0 ? (
              <div className="text-center py-16 text-xs text-slate-400">
                <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                Upload a CSV spreadsheet or paste text to preview and export batch QR codes.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[640px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <BulkQrCard
                    key={item.id}
                    item={item}
                    isCopied={copiedId === item.id}
                    onCopy={() => handleCopy(item.id, item.url)}
                    onDownloadPng={() => handleDownloadSingle(item, "png")}
                    onDownloadSvg={() => handleDownloadSingle(item, "svg")}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface BulkCardProps {
  item: BulkItem;
  isCopied: boolean;
  onCopy: () => void;
  onDownloadPng: () => void;
  onDownloadSvg: () => void;
}

function BulkQrCard({
  item,
  isCopied,
  onCopy,
  onDownloadPng,
  onDownloadSvg,
}: BulkCardProps) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(item.url, {
      width: 280,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then((url) => {
        if (active) setDataUrl(url);
      })
      .catch((err) => console.error("QR render error:", err));

    return () => {
      active = false;
    };
  }, [item.url]);

  return (
    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 flex flex-col justify-between hover:border-brand-500/50 transition-all group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4
            className="text-xs font-bold text-slate-900 dark:text-white truncate flex-1"
            title={item.title}
          >
            {item.title}
          </h4>
          <button
            type="button"
            onClick={onCopy}
            title="Copy URL"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 shrink-0"
          >
            {isCopied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <span
          className="text-[10px] text-slate-400 font-mono truncate block mb-3"
          title={item.url}
        >
          {item.url}
        </span>

        {/* QR Image Preview */}
        <div className="w-full flex items-center justify-center p-3 bg-white rounded-xl shadow-xs border border-slate-100 dark:border-slate-800/80 mb-3">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt={item.title}
              className="w-32 h-32 object-contain rounded"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center text-[10px] text-slate-400 font-mono">
              Rendering...
            </div>
          )}
        </div>
      </div>

      {/* Quick Download Buttons */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
        <button
          type="button"
          onClick={onDownloadPng}
          className="flex-1 py-1.5 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1"
        >
          <Download className="w-3 h-3 text-brand-600" />
          <span>PNG</span>
        </button>

        <button
          type="button"
          onClick={onDownloadSvg}
          className="flex-1 py-1.5 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1"
        >
          <FileType className="w-3 h-3 text-brand-600" />
          <span>SVG</span>
        </button>
      </div>
    </div>
  );
}
