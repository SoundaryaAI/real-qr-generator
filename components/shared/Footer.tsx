import React from "react";
import Link from "next/link";
import { QrCode, Shield, Zap, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-20 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 font-bold text-base">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="text-slate-900 dark:text-white">RealQR Studio</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Production-ready, real-time dynamic & static QR generator platform. Built with zero
            artificial scan limits, zero watermarks, and high-precision scannability analysis.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              100% Free Tiers
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              No Forced Watermarks
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
            Features
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-brand-600">
                Vector QR Generator
              </Link>
            </li>
            <li>
              <Link href="/templates" className="hover:text-brand-600">
                Template Gallery
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-brand-600">
                Live Scan Analytics
              </Link>
            </li>
            <li>
              <Link href="/bulk" className="hover:text-brand-600">
                Bulk CSV Generator
              </Link>
            </li>
            <li>
              <Link href="/scan" className="hover:text-brand-600">
                In-App Camera Scanner
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
            Developer Architecture
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li>Next.js 14 App Router</li>
            <li>PostgreSQL / Supabase Schema</li>
            <li>Reed-Solomon Scannability Audit</li>
            <li>Zero-Latency Edge Geo Routing</li>
            <li>Print Vector SVG & A4 PDF</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
        <p>© 2026 RealQR Studio. Open-source friendly.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0">
          Engineered for high performance & accessible web standards
        </p>
      </div>
    </footer>
  );
}
