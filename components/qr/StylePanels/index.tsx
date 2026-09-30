"use client";

import React, { useRef, useState } from "react";
import {
  QRDesignConfig,
  DotShape,
  CornerSquareShape,
  CornerDotShape,
  FrameStyle,
  ErrorCorrectionLevel,
} from "@/types/qr";
import { Input } from "@/components/ui";
import { InteractiveColorPicker } from "./InteractiveColorPicker";
import {
  PREMADE_TEMPLATES,
  STANDARD_FRAMES,
  PREMADE_CATEGORIES,
  applyPremadeTemplate,
  getFrameDefinition,
} from "@/lib/qr/frame-registry";
import { FrameMiniature } from "./FrameMiniature";
import { GENERATED_FRAMES } from "@/lib/qr/generated-frame-catalog";
import {
  Sparkles,
  Shield,
  Image as ImageIcon,
  Frame,
  Palette,
  Check,
  Upload,
  Layers,
} from "lucide-react";

interface StyleProps {
  design: QRDesignConfig;
  onChange: (updated: QRDesignConfig) => void;
}

// Curated Palettes
const COLOR_PRESETS = [
  { name: "Obsidian", fg: "#0f172a", bg: "#ffffff" },
  { name: "Cyber Teal", fg: "#0d9488", bg: "#f0fdfa" },
  { name: "Cobalt", fg: "#1e40af", bg: "#eff6ff" },
  { name: "Velvet Red", fg: "#991b1b", bg: "#fef2f2" },
  { name: "Emerald", fg: "#065f46", bg: "#ecfdf5" },
  { name: "Violet", fg: "#6b21a8", bg: "#faf5ff" },
  { name: "Gold Warm", fg: "#854d0e", bg: "#fefce8" },
  { name: "Monochrome", fg: "#000000", bg: "#ffffff" },
];

// Extended Quick Colors
const EXTENDED_SWATCHES = [
  "#000000", "#0f172a", "#334155", "#475569",
  "#dc2626", "#ea580c", "#d97706", "#ca8a04",
  "#16a34a", "#059669", "#0d9488", "#0891b2",
  "#0284c7", "#2563eb", "#4f46e5", "#7c3aed",
  "#9333ea", "#c026d3", "#db2777", "#e11d48",
  "#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0"
];

// ==========================================
// 1. COLOR PANEL WITH DRAG-AND-PICK PALETTE
// ==========================================
export function ColorPanel({ design, onChange }: StyleProps) {
  const [activeTarget, setActiveTarget] = useState<"dots" | "bg" | "corners" | "frame">("dots");

  const getCurrentColor = () => {
    switch (activeTarget) {
      case "dots":
        return design.dotsColor;
      case "bg":
        return design.bgColor;
      case "corners":
        return design.cornersSquareColor || design.dotsColor;
      case "frame":
        return design.frameColor || design.dotsColor;
      default:
        return design.dotsColor;
    }
  };

  const handleColorChange = (newHex: string) => {
    switch (activeTarget) {
      case "dots":
        onChange({
          ...design,
          dotsColor: newHex,
          cornersSquareColor: design.cornersSquareColor === design.dotsColor ? newHex : design.cornersSquareColor,
          cornersDotColor: design.cornersDotColor === design.dotsColor ? newHex : design.cornersDotColor,
        });
        break;
      case "bg":
        onChange({ ...design, bgColor: newHex, bgTransparent: false });
        break;
      case "corners":
        onChange({
          ...design,
          cornersSquareColor: newHex,
          cornersDotColor: newHex,
        });
        break;
      case "frame":
        onChange({ ...design, frameColor: newHex });
        break;
    }
  };

  return (
    <div className="space-y-5">
      {/* Target Selector Tabs */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Select Element to Color
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          {[
            { id: "dots", label: "QR Pattern", color: design.dotsColor },
            { id: "bg", label: "Background", color: design.bgTransparent ? "transparent" : design.bgColor },
            { id: "corners", label: "Corner Eyes", color: design.cornersSquareColor || design.dotsColor },
            { id: "frame", label: "Frame Accent", color: design.frameColor || design.dotsColor },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTarget(tab.id as any)}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                activeTarget === tab.id
                  ? "bg-white dark:bg-slate-900 text-brand-600 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                style={{ backgroundColor: tab.color }}
              />
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Drag & Pick Color Spectrum Canvas */}
      <InteractiveColorPicker
        label={`Drag & Pick ${
          activeTarget === "dots"
            ? "Pattern Color"
            : activeTarget === "bg"
            ? "Background Color"
            : activeTarget === "corners"
            ? "Corner Eyes Color"
            : "Frame Color"
        }`}
        color={getCurrentColor()}
        onChange={handleColorChange}
      />

      {/* Extended Swatches Grid */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Quick Swatches
        </label>
        <div className="grid grid-cols-12 gap-1.5">
          {EXTENDED_SWATCHES.map((hex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleColorChange(hex)}
              className="w-full aspect-square rounded-md border border-black/15 dark:border-white/15 hover:scale-110 transition-transform shadow-xs flex items-center justify-center"
              style={{ backgroundColor: hex }}
              title={hex}
            >
              {getCurrentColor().toLowerCase() === hex.toLowerCase() && (
                <Check className={`w-2.5 h-2.5 ${hex === "#ffffff" || hex === "#f8fafc" ? "text-slate-900" : "text-white"}`} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Two-Tone Palettes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Curated Two-Tone Palettes
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() =>
                onChange({
                  ...design,
                  dotsColor: preset.fg,
                  bgColor: preset.bg,
                  cornersSquareColor: preset.fg,
                  cornersDotColor: preset.fg,
                  frameColor: preset.fg,
                  bgTransparent: false,
                })
              }
              className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all text-left bg-white dark:bg-slate-900"
            >
              <div className="flex shrink-0">
                <span
                  className="w-4 h-4 rounded-full border border-black/10 z-10"
                  style={{ backgroundColor: preset.fg }}
                />
                <span
                  className="w-4 h-4 rounded-full border border-black/10 -ml-2"
                  style={{ backgroundColor: preset.bg }}
                />
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Transparent Background Checkbox */}
      <div className="pt-1">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={design.bgTransparent}
            onChange={(e) => onChange({ ...design, bgTransparent: e.target.checked })}
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
          />
          Transparent Background (for posters, flyers, or custom print overlays)
        </label>
      </div>
    </div>
  );
}

// ==========================================
// 2. SHAPES PANEL WITH VISUAL MINIATURES
// ==========================================
export function ShapePanel({ design, onChange }: StyleProps) {
  // Visual Mini SVG for Pattern Styles
  const renderPatternPreview = (style: DotShape) => {
    switch (style) {
      case "rounded":
        return (
          <svg className="w-10 h-10 text-brand-600" viewBox="0 0 40 40" fill="currentColor">
            <rect x="2" y="2" width="10" height="10" rx="3" />
            <rect x="15" y="2" width="10" height="10" rx="3" />
            <rect x="28" y="2" width="10" height="10" rx="3" />
            <rect x="2" y="15" width="10" height="10" rx="3" />
            <rect x="15" y="15" width="10" height="10" rx="3" />
            <rect x="28" y="15" width="10" height="10" rx="3" />
            <rect x="2" y="28" width="10" height="10" rx="3" />
            <rect x="15" y="28" width="10" height="10" rx="3" />
            <rect x="28" y="28" width="10" height="10" rx="3" />
          </svg>
        );
      case "dots":
        return (
          <svg className="w-10 h-10 text-brand-600" viewBox="0 0 40 40" fill="currentColor">
            <circle cx="7" cy="7" r="5" />
            <circle cx="20" cy="7" r="5" />
            <circle cx="33" cy="7" r="5" />
            <circle cx="7" cy="20" r="5" />
            <circle cx="20" cy="20" r="5" />
            <circle cx="33" cy="20" r="5" />
            <circle cx="7" cy="33" r="5" />
            <circle cx="20" cy="33" r="5" />
            <circle cx="33" cy="33" r="5" />
          </svg>
        );
      case "classy":
        return (
          <svg className="w-10 h-10 text-brand-600" viewBox="0 0 40 40" fill="currentColor">
            <rect x="3" y="3" width="8" height="8" rx="4" />
            <rect x="16" y="3" width="8" height="8" rx="0" />
            <rect x="29" y="3" width="8" height="8" rx="4" />
            <rect x="3" y="16" width="8" height="8" rx="0" />
            <rect x="16" y="16" width="8" height="8" rx="4" />
            <rect x="29" y="16" width="8" height="8" rx="0" />
            <rect x="3" y="29" width="8" height="8" rx="4" />
            <rect x="16" y="29" width="8" height="8" rx="0" />
            <rect x="29" y="29" width="8" height="8" rx="4" />
          </svg>
        );
      case "classy-rounded":
        return (
          <svg className="w-10 h-10 text-brand-600" viewBox="0 0 40 40" fill="currentColor">
            <path d="M 2 2 C 2 7, 7 12, 12 12 L 12 2 Z" />
            <path d="M 15 15 C 15 20, 20 25, 25 25 L 25 15 Z" />
            <path d="M 28 2 C 28 7, 33 12, 38 12 L 38 2 Z" />
            <path d="M 2 28 C 2 33, 7 38, 12 38 L 12 28 Z" />
            <path d="M 28 28 C 28 33, 33 38, 38 38 L 38 28 Z" />
            <circle cx="20" cy="7" r="4.5" />
            <circle cx="7" cy="20" r="4.5" />
            <circle cx="33" cy="20" r="4.5" />
            <circle cx="20" cy="33" r="4.5" />
          </svg>
        );
      case "square":
        return (
          <svg className="w-10 h-10 text-brand-600" viewBox="0 0 40 40" fill="currentColor">
            <rect x="2" y="2" width="10" height="10" />
            <rect x="15" y="2" width="10" height="10" />
            <rect x="28" y="2" width="10" height="10" />
            <rect x="2" y="15" width="10" height="10" />
            <rect x="15" y="15" width="10" height="10" />
            <rect x="28" y="15" width="10" height="10" />
            <rect x="2" y="28" width="10" height="10" />
            <rect x="15" y="28" width="10" height="10" />
            <rect x="28" y="28" width="10" height="10" />
          </svg>
        );
      case "extra-rounded":
        return (
          <svg className="w-10 h-10 text-brand-600" viewBox="0 0 40 40" fill="currentColor">
            <rect x="2" y="2" width="10" height="10" rx="5" />
            <rect x="15" y="2" width="10" height="10" rx="5" />
            <rect x="28" y="2" width="10" height="10" rx="5" />
            <rect x="2" y="15" width="10" height="10" rx="5" />
            <rect x="15" y="15" width="10" height="10" rx="5" />
            <rect x="28" y="15" width="10" height="10" rx="5" />
            <rect x="2" y="28" width="10" height="10" rx="5" />
            <rect x="15" y="28" width="10" height="10" rx="5" />
            <rect x="28" y="28" width="10" height="10" rx="5" />
          </svg>
        );
    }
  };

  // Visual Mini SVG for Corner Eye Outer Shape
  const renderEyePreview = (eyeStyle: CornerSquareShape) => {
    switch (eyeStyle) {
      case "extra-rounded":
        return (
          <svg className="w-8 h-8 text-brand-600" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="2" width="28" height="28" rx="8" stroke="currentColor" strokeWidth="4" />
            <rect x="10" y="10" width="12" height="12" rx="3" fill="currentColor" />
          </svg>
        );
      case "dot":
        return (
          <svg className="w-8 h-8 text-brand-600" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="4" />
            <circle cx="16" cy="16" r="6" fill="currentColor" />
          </svg>
        );
      case "square":
        return (
          <svg className="w-8 h-8 text-brand-600" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="2" width="28" height="28" rx="0" stroke="currentColor" strokeWidth="4" />
            <rect x="10" y="10" width="12" height="12" rx="0" fill="currentColor" />
          </svg>
        );
    }
  };

  const dotOptions: { id: DotShape; label: string; desc: string }[] = [
    { id: "rounded", label: "Smooth Rounded", desc: "Modern & high scannability" },
    { id: "dots", label: "Circular Dots", desc: "Clean geometric dots" },
    { id: "classy", label: "Classy Diamond", desc: "Sophisticated editorial look" },
    { id: "classy-rounded", label: "Classy Rounded", desc: "Curved dynamic edges" },
    { id: "square", label: "Classic Square", desc: "Traditional sharp QR code" },
    { id: "extra-rounded", label: "Extra Bubble", desc: "Playful soft look" },
  ];

  const cornerOptions: { id: CornerSquareShape; label: string }[] = [
    { id: "extra-rounded", label: "Rounded Corner" },
    { id: "dot", label: "Circular Eye" },
    { id: "square", label: "Square Eye" },
  ];

  const cornerDotOptions: { id: CornerDotShape; label: string }[] = [
    { id: "dot", label: "Circular Pupil" },
    { id: "square", label: "Square Pupil" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Pattern Module Style with Pictures */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
          QR Pattern Module Style (Click to preview)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {dotOptions.map((opt) => {
            const isSelected = design.dotsStyle === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ ...design, dotsStyle: opt.id })}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between items-start ${
                  isSelected
                    ? "border-brand-500 bg-brand-500/10 shadow-sm ring-2 ring-brand-500/30"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-white dark:bg-slate-900"
                }`}
              >
                {/* Visual Preview Picture */}
                <div className="w-full py-2 flex items-center justify-center bg-slate-50 dark:bg-slate-950/50 rounded-xl mb-2.5 border border-slate-100 dark:border-slate-800">
                  {renderPatternPreview(opt.id)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {opt.label}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {opt.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Corner Eyes Outer Shape with Pictures */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
          Corner Eyes Outer Frame
        </label>
        <div className="grid grid-cols-3 gap-3">
          {cornerOptions.map((opt) => {
            const isSelected = design.cornersSquareStyle === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ ...design, cornersSquareStyle: opt.id })}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  isSelected
                    ? "border-brand-500 bg-brand-500/10 shadow-sm ring-2 ring-brand-500/30"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-white dark:bg-slate-900"
                }`}
              >
                {/* Visual Preview Picture */}
                <div className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  {renderEyePreview(opt.id)}
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Corner Eyes Inner Pupil */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
          Corner Eyes Inner Center Dot
        </label>
        <div className="grid grid-cols-2 gap-3">
          {cornerDotOptions.map((opt) => {
            const isSelected = design.cornersDotStyle === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ ...design, cornersDotStyle: opt.id })}
                className={`p-3 rounded-2xl border text-center transition-all flex items-center justify-center gap-3 ${
                  isSelected
                    ? "border-brand-500 bg-brand-500/10 shadow-sm ring-2 ring-brand-500/30"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-white dark:bg-slate-900"
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                  {opt.id === "dot" ? (
                    <div className="w-3.5 h-3.5 rounded-full bg-brand-600" />
                  ) : (
                    <div className="w-3.5 h-3.5 bg-brand-600" />
                  )}
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. FRAMES PANEL — ME-QR STYLE (Pre-made Templates + Standard)
// ==========================================
const PREMADE_PREVIEW_COUNT = 11;

function FrameTile({
  isSelected,
  onClick,
  label,
  children,
}: {
  isSelected: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`group p-1.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 bg-white dark:bg-slate-900 aspect-square ${
        isSelected
          ? "border-brand-500 bg-brand-500/10 shadow-sm ring-2 ring-brand-500/40"
          : "border-slate-200 dark:border-slate-800 hover:border-brand-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center justify-center w-full flex-1 min-h-0">
        {children}
      </div>
      <span className="text-[9px] font-semibold text-slate-600 dark:text-slate-400 truncate w-full leading-tight group-hover:text-brand-600">
        {label}
      </span>
    </button>
  );
}

const ME_QR_FRAME_GROUPS: Array<{ id: string; label: string; accent: string; items: Array<{ id: string; label: string; kind: string; color: string; accent: string }> }> = [];

function renderFrameIllustration(kind: string, accent: string, bg: string) {
  const commonStroke = { stroke: accent, strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

  switch (kind) {
    case "suitcase":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <rect x="18" y="24" width="42" height="28" rx="6" fill={bg} stroke={accent} strokeWidth="2.5" />
          <path d="M30 24V18C30 14 33 12 36 12H44C47 12 50 14 50 18V24" fill="none" stroke={accent} strokeWidth="2.5" />
          <path d="M28 38H50" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "bag":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <path d="M24 30H56L58 58C58 61 55 64 52 64H28C25 64 22 61 22 58L24 30Z" fill={bg} stroke={accent} strokeWidth="2.5" />
          <path d="M30 32V26C30 19 35 14 42 14C49 14 54 19 54 26V32" fill="none" stroke={accent} strokeWidth="2.5" />
        </svg>
      );
    case "luggage":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <rect x="22" y="22" width="38" height="36" rx="5" fill={bg} stroke={accent} strokeWidth="2.5" />
          <path d="M32 22V16H48V22" fill="none" stroke={accent} strokeWidth="2.5" />
          <path d="M32 38H48" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "pin":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <path d="M40 12C30 12 24 18 24 28C24 38 32 48 40 62C48 48 56 38 56 28C56 18 50 12 40 12Z" fill={bg} stroke={accent} strokeWidth="2.5" />
          <circle cx="40" cy="28" r="6" fill="none" stroke={accent} strokeWidth="2.5" />
        </svg>
      );
    case "plate":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <circle cx="40" cy="40" r="22" fill={bg} stroke={accent} strokeWidth="2.5" />
          <circle cx="40" cy="40" r="8" fill="none" stroke={accent} strokeWidth="2.5" />
          <path d="M26 40H54" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "cup":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <path d="M24 32H54V50C54 57 48 62 40 62C32 62 26 57 26 50V32H24Z" fill={bg} stroke={accent} strokeWidth="2.5" />
          <path d="M54 36H60C63 36 66 39 66 42C66 46 63 48 60 48H54" fill="none" stroke={accent} strokeWidth="2.5" />
          <path d="M30 24C30 20 33 18 36 18H44C47 18 50 20 50 24" fill="none" stroke={accent} strokeWidth="2.5" />
        </svg>
      );
    case "burger":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <path d="M18 40H62C62 47 56 54 48 54H32C24 54 18 47 18 40Z" fill={bg} stroke={accent} strokeWidth="2.5" />
          <rect x="20" y="28" width="40" height="10" rx="4" fill={bg} stroke={accent} strokeWidth="2.5" />
          <circle cx="28" cy="22" r="4" fill={accent} />
          <circle cx="40" cy="18" r="4" fill={accent} />
          <circle cx="52" cy="22" r="4" fill={accent} />
        </svg>
      );
    case "menu":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <rect x="20" y="18" width="40" height="44" rx="4" fill={bg} stroke={accent} strokeWidth="2.5" />
          <path d="M30 30H50M30 38H50M30 46H44" {...commonStroke} />
          <path d="M52 24V58" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "bottle":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <rect x="34" y="18" width="12" height="8" rx="2" fill={bg} stroke={accent} strokeWidth="2.5" />
          <path d="M30 26H50V52C50 59 46 64 40 64C34 64 30 59 30 52V26Z" fill={bg} stroke={accent} strokeWidth="2.5" />
          <path d="M34 38H46" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "ghost":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <path d="M24 58V34C24 22 31 14 40 14C49 14 56 22 56 34V58L49 52L40 58L31 52L24 58Z" fill={bg} stroke={accent} strokeWidth="2.5" />
          <circle cx="32" cy="34" r="2.5" fill={accent} />
          <circle cx="48" cy="34" r="2.5" fill={accent} />
          <path d="M34 42C36 45 42 45 44 42" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "pumpkin":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <path d="M30 28C30 18 35 12 40 12C45 12 50 18 50 28V32C56 32 60 37 60 44C60 55 52 60 40 60C28 60 20 55 20 44C20 37 24 32 30 32V28Z" fill={bg} stroke={accent} strokeWidth="2.5" />
          <circle cx="34" cy="36" r="2" fill={accent} />
          <circle cx="46" cy="36" r="2" fill={accent} />
          <path d="M40 42V48M36 46H44" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "web":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <circle cx="40" cy="40" r="24" fill={bg} stroke={accent} strokeWidth="2.5" />
          <path d="M40 16V64M16 40H64M24 24L56 56M56 24L24 56" stroke={accent} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "witch":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <path d="M24 56C24 42 31 34 40 34C49 34 56 42 56 56V60H24V56Z" fill={bg} stroke={accent} strokeWidth="2.5" />
          <path d="M32 30L40 18L48 30" fill="none" stroke={accent} strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="40" cy="38" r="3" fill={accent} />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <path d="M16 28H64V54C64 58 60 62 56 62H24C20 62 16 58 16 54V28Z" fill={bg} stroke={accent} strokeWidth="2.5" />
          <path d="M18 30L40 44L62 30" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <path d="M40 60C38 58 18 44 18 28C18 20 24 14 31 14C36 14 40 17 40 22C40 17 44 14 49 14C56 14 62 20 62 28C62 44 42 58 40 60Z" fill={bg} stroke={accent} strokeWidth="2.5" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <rect x="18" y="24" width="44" height="38" rx="4" fill={bg} stroke={accent} strokeWidth="2.5" />
          <path d="M18 32H62M30 18V26M50 18V26" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
          <text x="40" y="46" textAnchor="middle" fill={accent} fontSize="12" fontWeight="700">14</text>
        </svg>
      );
    case "flower":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <circle cx="40" cy="40" r="10" fill={bg} stroke={accent} strokeWidth="2.5" />
          <circle cx="40" cy="20" r="8" fill={bg} stroke={accent} strokeWidth="2.5" />
          <circle cx="40" cy="60" r="8" fill={bg} stroke={accent} strokeWidth="2.5" />
          <circle cx="20" cy="40" r="8" fill={bg} stroke={accent} strokeWidth="2.5" />
          <circle cx="60" cy="40" r="8" fill={bg} stroke={accent} strokeWidth="2.5" />
        </svg>
      );
    case "face":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <circle cx="40" cy="42" r="22" fill={bg} stroke={accent} strokeWidth="2.5" />
          <circle cx="32" cy="39" r="2.5" fill={accent} />
          <circle cx="48" cy="39" r="2.5" fill={accent} />
          <path d="M33 48C36 52 44 52 47 48" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "crown":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <path d="M20 58L24 28L36 40L40 20L44 40L56 28L60 58H20Z" fill={bg} stroke={accent} strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <path d="M40 14L58 22V40C58 52 50 60 40 66C30 60 22 52 22 40V22L40 14Z" fill={bg} stroke={accent} strokeWidth="2.5" />
          <path d="M40 28V48M30 38H50" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "ring":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <circle cx="40" cy="40" r="18" fill={bg} stroke={accent} strokeWidth="2.5" />
          <circle cx="40" cy="40" r="8" fill="none" stroke={accent} strokeWidth="2.5" />
        </svg>
      );
    case "tree":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <path d="M40 12L24 34H32L20 50H34V64H46V50H60L48 34H56L40 12Z" fill={bg} stroke={accent} strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="40" cy="30" r="3" fill={accent} />
        </svg>
      );
    case "gift":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <rect x="20" y="30" width="40" height="30" rx="3" fill={bg} stroke={accent} strokeWidth="2.5" />
          <path d="M40 30V60M18 30H62V40H18Z" fill={bg} stroke={accent} strokeWidth="2.5" />
          <path d="M40 30C30 30 27 24 32 21C37 18 40 26 40 30ZM40 30C50 30 53 24 48 21C43 18 40 26 40 30Z" fill={bg} stroke={accent} strokeWidth="2.5" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <path d="M40 12L47 31H67L51 43L57 63L40 51L23 63L29 43L13 31H33L40 12Z" fill={bg} stroke={accent} strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
    case "cake":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <path d="M20 38H60V60H20Z" fill={bg} stroke={accent} strokeWidth="2.5" />
          <path d="M20 38C25 45 30 31 35 38C40 45 45 31 50 38C55 45 60 31 60 38" fill="none" stroke={accent} strokeWidth="2.5" />
          <path d="M32 30V20M48 30V20" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="18" r="2" fill={accent} /><circle cx="48" cy="18" r="2" fill={accent} />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <rect x="25" y="12" width="30" height="56" rx="6" fill={bg} stroke={accent} strokeWidth="2.5" />
          <path d="M35 22H45M36 57H44" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16">
          <path d="M18 28H30L34 22H46L50 28H62V60H18Z" fill={bg} stroke={accent} strokeWidth="2.5" />
          <circle cx="40" cy="44" r="10" fill="none" stroke={accent} strokeWidth="2.5" />
        </svg>
      );
    default:
      return null;
  }
}

export function FramePanel({ design, onChange }: StyleProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    travel: true,
    food: true,
    halloween: true,
    valentines: true,
    beauty: true,
  });

  const selectFrame = (id: string, accent: string) => {
    onChange({
      ...design,
      frameStyle: id,
      frameText: "SCAN ME",
      frameColor: accent,
      frameTextColor: "#ffffff",
      cornersSquareColor: accent,
      cornersDotColor: accent,
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-[15px] sm:text-[17px] font-black tracking-tight text-slate-900 dark:text-white">
        Custom Frames
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {STANDARD_FRAMES.map((item) => {
          const isSelected =
            design.frameStyle === item.id ||
            design.frameStyle === item.layout ||
            (item.id === "std-none" && design.frameStyle === "none");
          return (
            <FrameTile
              key={item.id}
              label={item.name}
              isSelected={isSelected}
              onClick={() =>
                onChange({
                  ...design,
                  frameStyle: item.id === "std-none" ? "none" : item.layout,
                  frameText: design.frameText || item.defaultText || "SCAN ME",
                  frameColor:
                    design.frameColor && design.frameColor !== "#0f172a"
                      ? design.frameColor
                      : item.defaultColor,
                  frameTextColor: item.defaultTextColor,
                })
              }
            >
              <div
                className="w-11 h-11 rounded-lg border-2 flex flex-col items-center justify-center gap-0.5"
                style={{ borderColor: item.defaultColor }}
              >
                {item.layout === "top-banner" && (
                  <span
                    className="w-7 h-1.5 rounded-full"
                    style={{ backgroundColor: item.defaultColor }}
                  />
                )}
                <span
                  className={`w-5 h-5 border ${
                    item.layout === "ticket" ? "border-dashed" : ""
                  } border-slate-400 rounded-sm`}
                />
                {(item.layout === "bottom-banner" || item.layout === "badge") && (
                  <span
                    className="w-7 h-1.5 rounded-full"
                    style={{ backgroundColor: item.defaultColor }}
                  />
                )}
              </div>
            </FrameTile>
          );
        })}
      </div>

      <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-5">
        <h4 className="text-sm font-black text-slate-900 dark:text-white">Love Frame</h4>
        <div className="grid max-w-[150px] grid-cols-1 gap-3">
          {GENERATED_FRAMES.filter((item) => item.id === "love-cupid").map((item) => {
            const isSelected = design.frameStyle === `image-${item.id}`;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({
                  ...design,
                  frameStyle: `image-${item.id}`,
                  frameQrSlot: item.qrSlot,
                  frameText: item.text,
                  frameColor: item.color,
                  frameTextColor: "#ffffff",
                })}
                className={`rounded-xl border p-1.5 text-left transition-all ${isSelected ? "border-brand-500 ring-2 ring-brand-300" : "border-slate-200 hover:border-brand-300"}`}
              >
                <img src={item.imagePath} alt={item.name} className="aspect-square w-full rounded-lg object-cover" />
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-5">
        <h4 className="text-sm font-black text-slate-900 dark:text-white">Birthday Frames</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {GENERATED_FRAMES.filter((item) => item.id.startsWith("birthday-")).map((item) => {
            const isSelected = design.frameStyle === `image-${item.id}`;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({
                  ...design,
                  frameStyle: `image-${item.id}`,
                  frameQrSlot: item.qrSlot,
                  frameText: item.text,
                  frameColor: item.color,
                  frameTextColor: "#ffffff",
                })}
                className={`rounded-xl border p-1.5 text-left transition-all ${isSelected ? "border-brand-500 ring-2 ring-brand-300" : "border-slate-200 hover:border-brand-300"}`}
              >
                <img src={item.imagePath} alt={item.name} className="aspect-square w-full rounded-lg object-cover" />
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-5">
        <h4 className="text-sm font-black text-slate-900 dark:text-white">Food Frames</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {GENERATED_FRAMES.filter((item) => item.id.startsWith("food-menu-")).map((item) => {
            const isSelected = design.frameStyle === `image-${item.id}`;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.name}
                onClick={() => onChange({
                  ...design,
                  frameStyle: `image-${item.id}`,
                  frameQrSlot: item.qrSlot,
                  frameText: item.text,
                  frameColor: item.color,
                  frameTextColor: "#ffffff",
                })}
                className={`rounded-xl border p-1.5 text-left transition-all ${isSelected ? "border-brand-500 ring-2 ring-brand-300" : "border-slate-200 hover:border-brand-300"}`}
              >
                <img src={item.imagePath} alt="" className="aspect-square w-full rounded-lg object-cover" />
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-5">
        <h4 className="text-sm font-black text-slate-900 dark:text-white">Valentine Frames</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {GENERATED_FRAMES.filter((item) => item.id.startsWith("valentine-")).map((item) => {
            const isSelected = design.frameStyle === `image-${item.id}`;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.name}
                onClick={() => onChange({
                  ...design,
                  frameStyle: `image-${item.id}`,
                  frameQrSlot: item.qrSlot,
                  frameText: item.text,
                  frameColor: item.color,
                  frameTextColor: "#ffffff",
                })}
                className={`rounded-xl border p-1.5 text-left transition-all ${isSelected ? "border-brand-500 ring-2 ring-brand-300" : "border-slate-200 hover:border-brand-300"}`}
              >
                <img src={item.imagePath} alt="" className="aspect-square w-full rounded-lg object-cover" />
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-5">
        <h4 className="text-sm font-black text-slate-900 dark:text-white">Shopping Frames</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {GENERATED_FRAMES.filter((item) => item.id.startsWith("shopping-")).map((item) => {
            const isSelected = design.frameStyle === `image-${item.id}`;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.name}
                onClick={() => onChange({
                  ...design,
                  frameStyle: `image-${item.id}`,
                  frameQrSlot: item.qrSlot,
                  frameText: item.text,
                  frameColor: item.color,
                  frameTextColor: "#ffffff",
                })}
                className={`rounded-xl border p-1.5 text-left transition-all ${isSelected ? "border-brand-500 ring-2 ring-brand-300" : "border-slate-200 hover:border-brand-300"}`}
              >
                <img src={item.imagePath} alt="" className="aspect-square w-full rounded-lg object-cover" />
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-5">
        <h4 className="text-sm font-black text-slate-900 dark:text-white">Standard Frames</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {GENERATED_FRAMES.filter((item) => item.id.startsWith("standard-category-")).map((item) => {
            const isSelected = design.frameStyle === `image-${item.id}`;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.name}
                onClick={() => onChange({
                  ...design,
                  frameStyle: `image-${item.id}`,
                  frameQrSlot: item.qrSlot,
                  frameText: item.text,
                  frameColor: item.color,
                  frameTextColor: "#ffffff",
                })}
                className={`rounded-xl border p-1.5 text-left transition-all ${isSelected ? "border-brand-500 ring-2 ring-brand-300" : "border-slate-200 hover:border-brand-300"}`}
              >
                <img src={item.imagePath} alt="" className="aspect-square w-full rounded-lg object-cover" />
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-5">
        <h4 className="text-sm font-black text-slate-900 dark:text-white">Expanded Food Frames</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {GENERATED_FRAMES.filter((item) => item.id.startsWith("food-expanded-")).map((item) => {
            const isSelected = design.frameStyle === `image-${item.id}`;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.name}
                onClick={() => onChange({
                  ...design,
                  frameStyle: `image-${item.id}`,
                  frameQrSlot: item.qrSlot,
                  frameText: item.text,
                  frameColor: item.color,
                  frameTextColor: "#ffffff",
                })}
                className={`rounded-xl border p-1.5 text-left transition-all ${isSelected ? "border-brand-500 ring-2 ring-brand-300" : "border-slate-200 hover:border-brand-300"}`}
              >
                <img src={item.imagePath} alt="" className="aspect-square w-full rounded-lg object-cover" />
              </button>
            );
          })}
        </div>
      </section>

      {ME_QR_FRAME_GROUPS.map((group) => {
        const isOpen = openSections[group.id] ?? true;

        return (
          <div key={group.id}>
            <button
              type="button"
              onClick={() => setOpenSections((prev) => ({ ...prev, [group.id]: !isOpen }))}
              className="w-full flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2 mb-3 text-left"
            >
              <span className="text-2xl sm:text-[2rem] font-extrabold tracking-tight text-slate-900 dark:text-white">
                {group.label}
              </span>
              <span className="text-xl text-slate-500">{isOpen ? "⌃" : "⌄"}</span>
            </button>

            {isOpen && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {group.items.map((item) => {
                  const isSelected = design.frameStyle === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectFrame(item.id, item.accent)}
                      className={`group rounded-2xl border p-2 text-center transition-all ${
                        isSelected
                          ? "border-brand-500 bg-brand-50 shadow-md ring-2 ring-brand-200"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className="flex h-24 w-full items-center justify-center rounded-xl border border-slate-200"
                        style={{ backgroundColor: item.color }}
                      >
                        {renderFrameIllustration(item.kind, item.accent, "#ffffff")}
                      </div>
                      <div className="mt-2 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                        {item.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {design.frameStyle !== "none" && (
        <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Input
            label="Additional Text"
            placeholder="SCAN ME"
            value={design.frameText}
            onChange={(e) => onChange({ ...design, frameText: e.target.value })}
            helperText="Call-to-action text shown on the frame banner."
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Frame Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={design.frameColor}
                  onChange={(e) => onChange({ ...design, frameColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700"
                />
                <input
                  type="text"
                  value={design.frameColor}
                  onChange={(e) => onChange({ ...design, frameColor: e.target.value })}
                  className="w-24 px-2.5 py-1.5 text-xs font-mono uppercase bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={design.frameTextColor}
                  onChange={(e) => onChange({ ...design, frameTextColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700"
                />
                <input
                  type="text"
                  value={design.frameTextColor}
                  onChange={(e) => onChange({ ...design, frameTextColor: e.target.value })}
                  className="w-24 px-2.5 py-1.5 text-xs font-mono uppercase bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ==========================================
// 4. BRAND LOGO PANEL WITH 1-CLICK POPULAR ICONS
// ==========================================
// Curated high-res SVG Data URLs for popular brands & icons
const LOGO_PRESETS = [
  {
    name: "WhatsApp",
    svg: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='48' height='48'><circle cx='24' cy='24' r='22' fill='%2325D366'/><path fill='%23fff' d='M35.2 29.8c-.5-.3-3-1.5-3.5-1.7-.5-.2-.8-.3-1.2.3-.4.6-1.4 1.7-1.7 2-.3.4-.7.4-1.2.2-.5-.3-2.1-.8-4-2.5-1.5-1.3-2.5-3-2.8-3.5-.3-.5 0-.8.2-1 .2-.2.5-.6.7-.9.2-.3.3-.5.5-.9.1-.3 0-.7-.1-.9s-1.2-2.9-1.6-4c-.4-1.1-.9-.9-1.2-.9h-1c-.3 0-.9.1-1.4.6-.5.6-1.9 1.9-1.9 4.6s1.9 5.3 2.2 5.7c.3.4 3.8 5.8 9.2 8.1 1.3.6 2.3.9 3.1 1.2 1.3.4 2.5.3 3.4.2 1.1-.2 3.3-1.4 3.8-2.7.5-1.3.5-2.4.3-2.7-.2-.2-.6-.3-1.1-.6z'/></svg>",
    color: "#25D366",
  },
  {
    name: "Instagram",
    svg: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='48' height='48'><radialGradient id='ig' cx='20%25' cy='110%25' r='130%25'><stop offset='0%25' stop-color='%23ffd600'/><stop offset='50%25' stop-color='%23ff0100'/><stop offset='100%25' stop-color='%23d800b9'/></radialGradient><rect width='48' height='48' rx='12' fill='url(%23ig)'/><path fill='%23fff' d='M24 14c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 16.5c-3.6 0-6.5-2.9-6.5-6.5s2.9-6.5 6.5-6.5 6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5zm8.5-17.5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z'/></svg>",
    color: "#E1306C",
  },
  {
    name: "X / Twitter",
    svg: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='48' height='48'><rect width='48' height='48' rx='12' fill='%23000'/><path fill='%23fff' d='M28.5 13h4.4L23.3 24.1 34.6 35h-8.8l-6.1-8-7 8H8.3l10.3-11.8L7.6 13h9l5.5 7.3L28.5 13zm-1.5 19.3h2.4L15.3 15.5h-2.6l14.3 16.8z'/></svg>",
    color: "#000000",
  },
  {
    name: "YouTube",
    svg: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='48' height='48'><circle cx='24' cy='24' r='22' fill='%23FF0000'/><path fill='%23fff' d='M20 17l12 7-12 7V17z'/></svg>",
    color: "#FF0000",
  },
  {
    name: "LinkedIn",
    svg: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='48' height='48'><rect width='48' height='48' rx='12' fill='%230A66C2'/><path fill='%23fff' d='M15 19h5v16h-5V19zm2.5-7.5c1.6 0 2.9 1.3 2.9 2.9 0 1.6-1.3 2.9-2.9 2.9-1.6 0-2.9-1.3-2.9-2.9 0-1.6 1.3-2.9 2.9-2.9zm8.5 7.5h4.8v2.2h.1c.7-1.3 2.3-2.6 4.8-2.6 5.1 0 6.1 3.4 6.1 7.8V35h-5v-7.6c0-1.8 0-4.1-2.5-4.1-2.5 0-2.9 2-2.9 4V35h-5.4V19z'/></svg>",
    color: "#0A66C2",
  },
  {
    name: "Wi-Fi",
    svg: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='48' height='48'><circle cx='24' cy='24' r='22' fill='%230D9488'/><path fill='%23fff' d='M24 33a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm-8.5-6.5a12 12 0 0 1 17 0l-2.8 2.8a8 8 0 0 0-11.4 0l-2.8-2.8zm-5.6-5.6a20 20 0 0 1 28.2 0l-2.8 2.8a16 16 0 0 0-22.6 0l-2.8-2.8z'/></svg>",
    color: "#0D9488",
  },
  {
    name: "Phone",
    svg: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='48' height='48'><circle cx='24' cy='24' r='22' fill='%232563EB'/><path fill='%23fff' d='M17 14c-.6 0-1.1.2-1.5.6l-2.2 2.2c-.9.9-1.2 2.2-.8 3.4 2.5 7.3 8.2 13 15.5 15.5 1.2.4 2.5.1 3.4-.8l2.2-2.2c.8-.8.8-2.1 0-2.9l-4.2-4.2c-.8-.8-2.1-.8-2.9 0l-1.5 1.5c-3.5-1.7-6.3-4.5-8-8l1.5-1.5c.8-.8.8-2.1 0-2.9L18.5 14.6c-.4-.4-.9-.6-1.5-.6z'/></svg>",
    color: "#2563EB",
  },
  {
    name: "Location",
    svg: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='48' height='48'><circle cx='24' cy='24' r='22' fill='%23EA4335'/><path fill='%23fff' d='M24 13c-5 0-9 4-9 9 0 6.8 9 16 9 16s9-9.2 9-16c0-5-4-9-9-9zm0 12.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z'/></svg>",
    color: "#EA4335",
  },
];

export function LogoPanel({ design, onChange }: StyleProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Please upload a logo under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange({
        ...design,
        logoUrl: dataUrl,
        errorCorrectionLevel: "H", // Auto-upgrade to High error correction
      });
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    onChange({ ...design, logoUrl: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* 1. Quick One-Click Popular Logos Gallery */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            One-Click Popular Center Logos
          </label>
          <span className="text-[11px] text-slate-400">Click to embed instantly</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {LOGO_PRESETS.map((preset) => {
            const isSelected = design.logoUrl === preset.svg;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() =>
                  onChange({
                    ...design,
                    logoUrl: preset.svg,
                    errorCorrectionLevel: "H",
                  })
                }
                className={`p-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  isSelected
                    ? "border-brand-500 bg-brand-500/10 shadow-sm ring-2 ring-brand-500/30"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-white dark:bg-slate-900"
                }`}
              >
                {/* Visual Image Picture */}
                <div className="w-9 h-9 flex items-center justify-center">
                  <img src={preset.svg} alt={preset.name} className="w-8 h-8 rounded-full shadow-xs" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Custom Brand Logo Upload */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Or Upload Custom Brand Logo
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload your PNG, JPG, or SVG company emblem. Error correction automatically switches to Level H (30%) to ensure error-free scanning.
        </p>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={handleFileUpload}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer transition-all shadow-xs"
          >
            <Upload className="w-4 h-4 text-brand-600" />
            {design.logoUrl ? "Replace Custom Logo" : "Upload Image File"}
          </label>

          {design.logoUrl && (
            <button
              type="button"
              onClick={removeLogo}
              className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-500 hover:underline"
            >
              Remove Logo
            </button>
          )}
        </div>
      </div>

      {/* 3. Logo Sizing Slider */}
      {design.logoUrl && (
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <span>Center Logo Size ({Math.round(design.logoSize * 100)}%)</span>
            <span className="text-slate-400">Safe threshold: $\le 30\%$</span>
          </div>
          <input
            type="range"
            min={0.15}
            max={0.32}
            step={0.01}
            value={design.logoSize}
            onChange={(e) => onChange({ ...design, logoSize: parseFloat(e.target.value) })}
            className="w-full accent-brand-600"
          />
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. SECURITY & ERROR CORRECTION PANEL
// ==========================================
export function SecurityPanel({ design, onChange }: StyleProps) {
  const levels: { id: ErrorCorrectionLevel; label: string; desc: string; recovery: string }[] = [
    { id: "L", label: "Level L", desc: "Low density, fast scan", recovery: "~7% damaged recovery" },
    { id: "M", label: "Level M (Default)", desc: "Standard balance", recovery: "~15% damaged recovery" },
    { id: "Q", label: "Level Q", desc: "High resilience", recovery: "~25% damaged recovery" },
    { id: "H", label: "Level H (Recommended for Logos)", desc: "Maximum redundancy", recovery: "~30% damaged recovery" },
  ];

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
          Reed-Solomon Error Correction Level
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Error correction allows the QR code to be scanned even if part of it is covered by a logo, scratched, or smudged.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {levels.map((lvl) => (
          <button
            key={lvl.id}
            type="button"
            onClick={() => onChange({ ...design, errorCorrectionLevel: lvl.id })}
            className={`p-3 rounded-xl border text-left transition-all ${
              design.errorCorrectionLevel === lvl.id
                ? "border-brand-500 bg-brand-500/10 text-brand-700 dark:text-brand-300 font-semibold ring-1 ring-brand-500"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-white dark:bg-slate-900"
            }`}
          >
            <div className="text-xs font-semibold">{lvl.label}</div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{lvl.desc}</div>
            <div className="text-[10px] text-brand-600 font-mono mt-1">{lvl.recovery}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
