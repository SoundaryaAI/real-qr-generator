"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { QrCode, BarChart3, LayoutGrid, Camera, Layers, Github } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Studio Generator", icon: QrCode },
    { href: "/templates", label: "Templates", icon: LayoutGrid },
    { href: "/dashboard", label: "Dashboard & Analytics", icon: BarChart3 },
    { href: "/bulk", label: "Bulk CSV", icon: Layers },
    { href: "/scan", label: "Camera Scanner", icon: Camera },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-black text-lg tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <QrCode className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 dark:text-white leading-tight">
              Real<span className="text-brand-600">QR</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
              Pro Studio
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90 transition-all shadow-sm"
          >
            My QR Codes
          </Link>
        </div>
      </div>
    </header>
  );
}
