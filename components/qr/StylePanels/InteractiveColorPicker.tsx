"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Pipette } from "lucide-react";

interface InteractiveColorPickerProps {
  color: string;
  onChange: (hex: string) => void;
  label?: string;
}

// Helper: Convert HSV to Hex
function hsvToHex(h: number, s: number, v: number): string {
  const sat = Math.max(0, Math.min(1, s / 100));
  const val = Math.max(0, Math.min(1, v / 100));
  const c = val * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = val - c;

  let r = 0,
    g = 0,
    b = 0;
  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase();
}

// Helper: Convert Hex to HSV
function hexToHsv(hex: string): { h: number; s: number; v: number } {
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (clean.length !== 6) return { h: 0, s: 100, v: 10 };

  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }

  const s = max === 0 ? 0 : (d / max) * 100;
  const v = max * 100;
  return { h, s, v };
}

export function InteractiveColorPicker({
  color,
  onChange,
  label,
}: InteractiveColorPickerProps) {
  const [hsv, setHsv] = useState(() => hexToHsv(color || "#0f172a"));
  const [isMounted, setIsMounted] = useState(false);
  const satBoxRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const isDraggingSat = useRef(false);
  const isDraggingHue = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync state if color changes externally
  useEffect(() => {
    if (color && color.startsWith("#")) {
      const parsed = hexToHsv(color);
      setHsv(parsed);
    }
  }, [color]);

  // Update saturation and value from pointer coords
  const updateSatVal = useCallback(
    (clientX: number, clientY: number) => {
      if (!satBoxRef.current) return;
      const rect = satBoxRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

      const s = (x / rect.width) * 100;
      const v = (1 - y / rect.height) * 100;

      setHsv((prev) => {
        const next = { ...prev, s, v };
        const hex = hsvToHex(next.h, next.s, next.v);
        onChange(hex);
        return next;
      });
    },
    [onChange]
  );

  // Update hue from pointer coords
  const updateHue = useCallback(
    (clientX: number) => {
      if (!hueSliderRef.current) return;
      const rect = hueSliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const h = (x / rect.width) * 360;

      setHsv((prev) => {
        const next = { ...prev, h };
        const hex = hsvToHex(next.h, next.s, next.v);
        onChange(hex);
        return next;
      });
    },
    [onChange]
  );

  // Window pointer move and up listeners
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingSat.current) {
        updateSatVal(e.clientX, e.clientY);
      } else if (isDraggingHue.current) {
        updateHue(e.clientX);
      }
    };

    const handlePointerUp = () => {
      isDraggingSat.current = false;
      isDraggingHue.current = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [updateSatVal, updateHue]);

  // Eyedropper API support
  const handleEyeDropper = async () => {
    if (typeof window !== "undefined" && "EyeDropper" in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          onChange(result.sRGBHex);
        }
      } catch (e) {
        // User cancelled picker
      }
    }
  };

  const pureHueHex = hsvToHex(hsv.h, 100, 100);

  return (
    <div className="p-3.5 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {label}
          </span>
          <span className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300">
            {color}
          </span>
        </div>
      )}

      {/* 2D Drag-and-Pick Saturation & Brightness Palette */}
      <div
        ref={satBoxRef}
        onPointerDown={(e) => {
          isDraggingSat.current = true;
          updateSatVal(e.clientX, e.clientY);
        }}
        className="w-full h-32 rounded-xl relative cursor-crosshair overflow-hidden touch-none select-none shadow-inner"
        style={{
          backgroundColor: pureHueHex,
          backgroundImage: `
            linear-gradient(to right, #ffffff, transparent),
            linear-gradient(to top, #000000, transparent)
          `,
        }}
      >
        {/* Draggable Indicator Handle */}
        <div
          className="w-4 h-4 rounded-full border-2 border-white shadow-md absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform active:scale-125"
          style={{
            left: `${hsv.s}%`,
            top: `${100 - hsv.v}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Rainbow Hue Slider Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Hue Spectrum (Drag to pick)</span>
          <span>{Math.round(hsv.h)}°</span>
        </div>
        <div
          ref={hueSliderRef}
          onPointerDown={(e) => {
            isDraggingHue.current = true;
            updateHue(e.clientX);
          }}
          className="w-full h-4 rounded-lg relative cursor-pointer touch-none select-none shadow-inner"
          style={{
            background:
              "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
          }}
        >
          {/* Hue Handle */}
          <div
            className="w-3.5 h-5 bg-white rounded-md shadow-md border border-slate-300 dark:border-slate-700 absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              left: `${(hsv.h / 360) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Bottom Row: Swatch, Eyedropper & Manual Hex */}
      <div className="flex items-center gap-2 pt-1">
        <div
          className="w-8 h-8 rounded-lg border border-black/15 dark:border-white/15 shadow-sm shrink-0"
          style={{ backgroundColor: color }}
        />

        <div className="flex-1 flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1">
          <span className="text-xs text-slate-400 font-mono">#</span>
          <input
            type="text"
            value={color.replace("#", "")}
            onChange={(e) => {
              const val = `#${e.target.value}`;
              onChange(val);
            }}
            className="w-full text-xs font-mono uppercase bg-transparent outline-none text-slate-800 dark:text-slate-100"
            maxLength={6}
          />
        </div>

        {isMounted && "EyeDropper" in window && (
          <button
            type="button"
            onClick={handleEyeDropper}
            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs transition-all"
            title="Pick color from screen (Eyedropper)"
          >
            <Pipette className="w-3.5 h-3.5 text-brand-600" />
          </button>
        )}
      </div>
    </div>
  );
}
