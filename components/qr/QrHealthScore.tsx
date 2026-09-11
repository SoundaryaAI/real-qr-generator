"use client";

import React from "react";
import { evaluateQrHealth } from "@/lib/qr/health-checker";
import { QRDesignConfig } from "@/types/qr";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

interface Props {
  design: QRDesignConfig;
  payloadLength: number;
}

export function QrHealthScore({ design, payloadLength }: Props) {
  const result = evaluateQrHealth({
    fgColor: design.dotsColor,
    bgColor: design.bgTransparent ? "#ffffff" : design.bgColor,
    ecLevel: design.errorCorrectionLevel,
    hasLogo: !!design.logoUrl,
    logoSizePercent: Math.round(design.logoSize * 100),
    contentLength: payloadLength,
  });

  const statusConfig = {
    excellent: {
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
      bar: "bg-emerald-500",
      icon: CheckCircle2,
      label: "Excellent Scannability",
    },
    good: {
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
      bar: "bg-blue-500",
      icon: CheckCircle2,
      label: "Good Scannability",
    },
    warning: {
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
      bar: "bg-amber-500",
      icon: AlertTriangle,
      label: "Moderate Scan Risk",
    },
    critical: {
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800",
      bar: "bg-rose-500",
      icon: XCircle,
      label: "Critical Scan Risk",
    },
  };

  const current = statusConfig[result.status];
  const Icon = current.icon;

  return (
    <div className={`p-4 rounded-2xl border ${current.bg} transition-all`}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${current.color}`} />
          <span className={`text-sm font-bold ${current.color}`}>{current.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            {result.score}/100
          </span>
        </div>
      </div>

      {/* Health Meter Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full ${current.bar} transition-all duration-300`}
          style={{ width: `${result.score}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2 font-mono">
        <span>Contrast: {result.contrastRatio}:1</span>
        <span>Redundancy: Level {design.errorCorrectionLevel}</span>
      </div>

      {/* Warnings & Suggestions */}
      {result.warnings.length > 0 && (
        <div className="space-y-1 mt-2">
          {result.warnings.map((warn, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
              <span className="text-rose-500">•</span>
              <span>{warn}</span>
            </div>
          ))}
        </div>
      )}

      {result.warnings.length === 0 && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <Info className="w-3.5 h-3.5" />
          <span>Colors and module density meet high-speed camera scanning standards.</span>
        </div>
      )}
    </div>
  );
}
