"use client";

import React, { useEffect, useRef, useState } from "react";
import { QRDesignConfig } from "@/types/qr";
import { downloadQr } from "@/lib/qr/exporter";
import { Button } from "@/components/ui";
import { FrameRenderer } from "./FrameRenderer";
import { getGeneratedFrame } from "@/lib/qr/generated-frame-catalog";
import {
  Download,
  Share2,
  Check,
  FileType,
  Sparkles,
  RefreshCw,
  Eye,
} from "lucide-react";

interface Props {
  payload: string;
  design: QRDesignConfig;
  title: string;
  isDynamic: boolean;
  shortUrl?: string;
  onSave?: () => void;
}

export function QrPreview({
  payload,
  design,
  title,
  isDynamic,
  shortUrl,
  onSave,
}: Props) {
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<any>(null);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [exportRes, setExportRes] = useState<1 | 2 | 4>(2);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Initialize or update qr-code-styling instance
  useEffect(() => {
    let isMounted = true;

    async function updateQR() {
      if (typeof window === "undefined" || !qrContainerRef.current) return;

      try {
        const QRCodeStylingModule = await import("qr-code-styling");
        const QRCodeStyling = QRCodeStylingModule.default;

        const effectiveData = isDynamic && shortUrl ? shortUrl : payload;

        const options: any = {
          // Image frames have a smaller blank center than the normal QR card.
          // Generate the QR at that slot size so it cannot spill over the artwork.
          width: design.frameStyle.startsWith("image-") ? 180 : 260,
          height: design.frameStyle.startsWith("image-") ? 180 : 260,
          type: "canvas",
          data: effectiveData || "https://example.com",
          margin: 0,
          qrOptions: {
            typeNumber: 0,
            mode: "Byte",
            errorCorrectionLevel: design.errorCorrectionLevel,
          },
          dotsOptions: {
            color: design.dotsColor,
            type: design.dotsStyle,
          },
          backgroundOptions: {
            color: design.bgTransparent ? "transparent" : design.bgColor,
          },
          cornersSquareOptions: {
            color: design.cornersSquareColor || design.dotsColor,
            type: design.cornersSquareStyle,
          },
          cornersDotOptions: {
            color: design.cornersDotColor || design.dotsColor,
            type: design.cornersDotStyle,
          },
        };

        if (design.logoUrl) {
          options.image = design.logoUrl;
          options.imageOptions = {
            hideBackgroundDots: true,
            imageSize: design.logoSize,
            margin: design.logoMargin,
            crossOrigin: "anonymous",
          };
        }

        if (!isMounted || !qrContainerRef.current) return;

        if (!qrCodeInstanceRef.current) {
          const qr = new QRCodeStyling(options);
          qrCodeInstanceRef.current = qr;
          qrContainerRef.current.innerHTML = "";
          qr.append(qrContainerRef.current);
        } else {
          if (!qrContainerRef.current.querySelector("canvas, svg")) {
            qrContainerRef.current.innerHTML = "";
            qrCodeInstanceRef.current.append(qrContainerRef.current);
          }
          qrCodeInstanceRef.current.update(options);
        }
      } catch (err) {
        console.error("Error updating QR code styling:", err);
      }
    }

    updateQR();

    return () => {
      isMounted = false;
    };
  }, [payload, design, isDynamic, shortUrl]);

  // Handle Export (PNG, SVG, PDF, JPEG)
  const handleDownload = async (format: "png" | "jpeg" | "svg" | "pdf") => {
    setDownloadingFormat(format);
    try {
      const canvasEl = qrContainerRef.current?.querySelector("canvas");
      let svgString: string | undefined;
      let pngBlob: Blob | undefined;

      if (qrCodeInstanceRef.current) {
        const rawPng = await qrCodeInstanceRef.current.getRawData("png");
        if (rawPng) pngBlob = rawPng;
      }

      if (format === "svg" && qrCodeInstanceRef.current) {
        const rawBlob = await qrCodeInstanceRef.current.getRawData("svg");
        if (rawBlob) {
          svgString = await rawBlob.text();
        }
      }

      await downloadQr({
        canvasElement: canvasEl || null,
        qrPngBlob: pngBlob,
        frameImagePath: getGeneratedFrame(design.frameStyle)?.imagePath,
        frameQrSlot: design.frameQrSlot ?? getGeneratedFrame(design.frameStyle)?.qrSlot,
        qrSvgString: svgString,
        filename: `${title.toLowerCase().replace(/[^a-z0-9]/g, "-") || "qr-code"}`,
        format,
        scaleMultiplier: exportRes,
        frameStyle: design.frameStyle,
        frameText: design.frameText,
        frameColor: design.frameColor,
        frameTextColor: design.frameTextColor,
      });
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to export QR code. Please try again.");
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleCopyLink = () => {
    const textToCopy = isDynamic && shortUrl ? shortUrl : payload;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveClick = () => {
    if (onSave) {
      onSave();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  // Render Frame Shell in Preview
  const renderFrameContainer = (children: React.ReactNode) => (
    <FrameRenderer design={design}>{children}</FrameRenderer>
  );

  return (
    <div className="flex flex-col items-center">
      {/* Live Preview Card */}
      <div className="w-full flex justify-center py-6 px-4 bg-slate-100 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800">
        {renderFrameContainer(
          <div
            ref={qrContainerRef}
            className={`flex items-center justify-center overflow-hidden ${
              design.frameStyle.startsWith("image-")
                ? "h-full w-full min-h-0 min-w-0 [&>canvas]:h-auto [&>canvas]:max-h-full [&>canvas]:max-w-full [&>canvas]:w-full"
                : "min-h-[260px] min-w-[260px]"
            }`}
          />
        )}
      </div>

      {/* Dynamic Link Notification Pill */}
      {isDynamic && (
        <div className="mt-3 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-700 dark:text-brand-300 text-xs font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          <span>Dynamic Short URL: </span>
          <span className="font-mono font-bold truncate max-w-[200px]">
            {shortUrl || "Auto-generated on save"}
          </span>
        </div>
      )}

      {/* Export Controls */}
      <div className="w-full mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Export Quality
          </span>
          <div className="flex rounded-lg bg-slate-200 dark:bg-slate-800 p-0.5">
            {[
              { val: 1, label: "1x (Web)" },
              { val: 2, label: "2x (Retina)" },
              { val: 4, label: "4x (Print 300DPI)" },
            ].map((res) => (
              <button
                key={res.val}
                type="button"
                onClick={() => setExportRes(res.val as any)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  exportRes === res.val
                    ? "bg-white dark:bg-slate-900 shadow-sm text-brand-600"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {res.label}
              </button>
            ))}
          </div>
        </div>

        {/* Export Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <Button
            variant="primary"
            onClick={() => handleDownload("png")}
            disabled={!!downloadingFormat}
            className="w-full"
          >
            <Download className="w-4 h-4" />
            {downloadingFormat === "png" ? "Exporting..." : "Download PNG"}
          </Button>

          <Button
            variant="secondary"
            onClick={() => handleDownload("svg")}
            disabled={!!downloadingFormat}
            className="w-full"
          >
            <FileType className="w-4 h-4" />
            {downloadingFormat === "svg" ? "Exporting..." : "Vector SVG"}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleDownload("pdf")}
            disabled={!!downloadingFormat}
            className="w-full"
          >
            <FileType className="w-4 h-4" />
            {downloadingFormat === "pdf" ? "Exporting..." : "Print PDF (A4)"}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleDownload("jpeg")}
            disabled={!!downloadingFormat}
            className="w-full"
          >
            <Download className="w-4 h-4" />
            {downloadingFormat === "jpeg" ? "Exporting..." : "Download JPEG"}
          </Button>
        </div>

        {/* Save to Dashboard or Copy Link */}
        <div className="pt-2 flex items-center gap-2">
          {onSave && (
            <Button
              variant="secondary"
              onClick={handleSaveClick}
              className="flex-1 border-brand-500/40"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Saved to Dashboard!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  <span>Save QR to Dashboard</span>
                </>
              )}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="px-3"
            title="Copy encoded payload"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
