"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui";
import {
  Camera,
  Upload,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Trash2,
  Sparkles,
} from "lucide-react";

interface ScannedHistoryItem {
  id: string;
  data: string;
  timestamp: string;
}

const HISTORY_KEY = "real_qr_scanner_history_v1";

export default function ScannerPage() {
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [history, setHistory] = useState<ScannedHistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [scanning, setScanning] = useState(false);
  const html5QrCodeRef = useRef<any>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const saveToHistory = (text: string) => {
    const newItem: ScannedHistoryItem = {
      id: `scan-${Date.now()}`,
      data: text,
      timestamp: new Date().toISOString(),
    };
    const updated = [newItem, ...history.filter((h) => h.data !== text)].slice(0, 50);
    setHistory(updated);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch {}
  };

  const startCamera = async () => {
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      setScanning(true);

      const qrScanner = new Html5Qrcode("reader-container");
      html5QrCodeRef.current = qrScanner;

      await qrScanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          setScanResult(decodedText);
          saveToHistory(decodedText);
          stopCamera();
        },
        () => {
          // ignore scan frame errors
        }
      );
    } catch (err) {
      console.error("Camera access failed:", err);
      alert("Unable to access camera. Please check camera permissions or upload an image file instead.");
      setScanning(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      await html5QrCodeRef.current.stop();
      html5QrCodeRef.current.clear();
      setScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const qrScanner = new Html5Qrcode("file-reader-dummy");
      const result = await qrScanner.scanFile(file, true);
      setScanResult(result);
      saveToHistory(result);
      qrScanner.clear();
    } catch (err) {
      alert("No QR code found in this image.");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const isUrl = scanResult?.startsWith("http://") || scanResult?.startsWith("https://");

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Universal Scanner</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          In-Browser QR Scanner
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Scan any QR code using your device camera or upload a file. Keep a private local history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Scanner Viewport (7 Cols) */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            {/* Mode Switcher */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("camera");
                  stopCamera();
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "camera"
                    ? "bg-white dark:bg-slate-900 text-brand-600 shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                Live Camera
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("upload");
                  stopCamera();
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "upload"
                    ? "bg-white dark:bg-slate-900 text-brand-600 shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Image
              </button>
            </div>

            {/* Camera Viewport */}
            {activeTab === "camera" ? (
              <div className="space-y-4">
                <div
                  id="reader-container"
                  className="w-full min-h-[300px] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center text-white"
                >
                  {!scanning && (
                    <div className="text-center p-6 space-y-3">
                      <Camera className="w-10 h-10 mx-auto text-slate-500" />
                      <p className="text-xs text-slate-400">
                        Camera access is required to scan physical QR codes.
                      </p>
                      <Button variant="primary" onClick={startCamera}>
                        Start Camera Scanner
                      </Button>
                    </div>
                  )}
                </div>

                {scanning && (
                  <Button variant="outline" onClick={stopCamera} className="w-full">
                    Stop Camera
                  </Button>
                )}
              </div>
            ) : (
              /* Image File Upload View */
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-500 rounded-2xl p-8 text-center cursor-pointer transition-all">
                <div id="file-reader-dummy" className="hidden" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="scanner-image-upload"
                />
                <label htmlFor="scanner-image-upload" className="cursor-pointer block">
                  <Upload className="w-8 h-8 mx-auto text-brand-600 mb-2" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
                    Select an image containing a QR code
                  </span>
                  <span className="text-xs text-slate-400 mt-1 block">PNG, JPG, WEBP, or SVG</span>
                </label>
              </div>
            )}

            {/* Scan Result Card */}
            {scanResult && (
              <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-brand-700 dark:text-brand-300">
                    Decoded QR Data
                  </span>
                  <span className="text-[10px] text-emerald-500 font-bold">Successfully Parsed</span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl font-mono text-xs text-slate-900 dark:text-slate-100 break-all border border-slate-200 dark:border-slate-800">
                  {scanResult}
                </div>

                <div className="flex items-center gap-2">
                  {isUrl && (
                    <a
                      href={scanResult}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="primary" size="sm" className="w-full">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Destination</span>
                      </Button>
                    </a>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(scanResult)}
                    className="flex-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy Text"}</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scan History (5 Cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-600" />
                Scan History
              </h3>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">
                Your scanned QR history will appear here.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-xs space-y-1"
                  >
                    <p className="font-mono text-slate-900 dark:text-slate-100 truncate">
                      {item.data}
                    </p>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
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
