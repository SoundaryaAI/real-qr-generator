"use client";

import React from "react";
import { QRDesignConfig } from "@/types/qr";
import {
  getFrameDefinition,
  getFrameLayout,
  getCustomFrameDecoration,
  FrameDecoration,
} from "@/lib/qr/frame-registry";
import { getGeneratedFrame } from "@/lib/qr/generated-frame-catalog";

interface FrameRendererProps {
  design: QRDesignConfig;
  children: React.ReactNode;
}

function FrameDecorationSvg({
  decoration,
  color,
}: {
  decoration: FrameDecoration;
  color: string;
}) {
  switch (decoration) {
    case "balloons":
      return (
        <>
          <circle cx="8" cy="12" r="10" fill="#f43f5e" opacity="0.85" />
          <circle cx="92" cy="12" r="10" fill="#38bdf8" opacity="0.85" />
          <circle cx="12" cy="22" r="7" fill="#a855f7" opacity="0.75" />
          <circle cx="88" cy="22" r="7" fill="#ec4899" opacity="0.75" />
        </>
      );
    case "confetti":
      return (
        <>
          <circle cx="6" cy="6" r="3" fill="#f43f5e" />
          <rect x="90" y="4" width="5" height="5" fill="#3b82f6" transform="rotate(20 90 4)" />
          <circle cx="92" cy="92" r="3" fill="#10b981" />
          <rect x="4" y="90" width="5" height="5" fill="#f59e0b" transform="rotate(45 4 90)" />
        </>
      );
    case "heart":
      return (
        <path
          d="M 50 8 C 50 4 42 4 42 10 C 42 16 50 20 50 20 C 50 20 58 16 58 10 C 58 4 50 4 50 8 Z"
          fill={color}
          opacity="0.12"
        />
      );
    case "leafy":
      return (
        <>
          <ellipse cx="6" cy="14" rx="14" ry="6" fill={color} opacity="0.1" />
          <ellipse cx="94" cy="14" rx="14" ry="6" fill={color} opacity="0.1" />
        </>
      );
    case "christmas-tree":
      return (
        <g opacity="0.2">
          <polygon points="8,28 22,12 36,28" fill={color} />
          <polygon points="28,22 46,8 62,22" fill={color} />
          <rect x="28" y="28" width="8" height="14" rx="2" fill={color} />
        </g>
      );
    case "snowflake":
      return (
        <g stroke={color} strokeWidth="1.2" opacity="0.18" fill="none">
          <path d="M50 12L50 88M20 50H80M30 30L70 70M70 30L30 70" />
          <path d="M32 18L50 50L68 18M32 82L50 50L68 82" />
        </g>
      );
    case "ornament":
      return (
        <g opacity="0.18" fill={color}>
          <circle cx="18" cy="18" r="8" />
          <circle cx="82" cy="18" r="8" />
          <circle cx="18" cy="82" r="8" />
          <circle cx="82" cy="82" r="8" />
          <path d="M50 12V88" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case "mistletoe":
      return (
        <g opacity="0.18" fill={color}>
          <path d="M50 10C44 10 40 14 40 20C40 26 46 28 50 32C54 28 60 26 60 20C60 14 56 10 50 10Z" />
          <circle cx="30" cy="26" r="5" />
          <circle cx="70" cy="26" r="5" />
          <circle cx="50" cy="38" r="6" />
        </g>
      );
    case "gift-bundle":
    case "gift-box":
      return (
        <g opacity="0.18" fill={color}>
          <rect x="10" y="22" width="22" height="20" rx="3" />
          <rect x="68" y="22" width="22" height="20" rx="3" />
          <rect x="26" y="15" width="48" height="28" rx="4" />
          <line x1="50" y1="15" x2="50" y2="43" stroke={color} strokeWidth="3" />
          <line x1="26" y1="29" x2="74" y2="29" stroke={color} strokeWidth="3" />
        </g>
      );
    case "holiday-star":
      return (
        <g fill={color} opacity="0.18">
          <path d="M50 6L57 24L76 24L61 35L67 54L50 42L33 54L39 35L24 24H43L50 6Z" />
        </g>
      );
    default:
      return null;
  }
}

export function FrameRenderer({ design, children }: FrameRendererProps) {
  const frame = design.frameStyle;
  const generatedFrame = frame.startsWith("image-") ? getGeneratedFrame(frame.slice("image-".length)) : undefined;
  const layout = getFrameLayout(frame);
  const definition = getFrameDefinition(frame);
  const decoration = definition?.decoration ?? getCustomFrameDecoration(frame);
  const hasGiftDecoration = decoration === "gift-bundle" || decoration === "gift-box";

  if (layout === "none") {
    return (
      <div
        className="p-6 rounded-3xl transition-all shadow-sm border border-slate-200 dark:border-slate-800"
        style={{
          backgroundColor: design.bgTransparent ? "transparent" : design.bgColor,
        }}
      >
        {children}
      </div>
    );
  }

  if (generatedFrame) {
    const slot = design.frameQrSlot ?? generatedFrame.qrSlot;
    return (
      <div
        className="relative flex w-[308px] max-w-full items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg"
        style={{ aspectRatio: generatedFrame.aspectRatio }}
      >
        <img src={generatedFrame.imagePath} alt="" className="absolute inset-0 h-full w-full object-contain" />
        <div
          className="absolute z-10 flex items-center justify-center overflow-hidden bg-white p-1 shadow-sm"
          style={{
            left: `${slot.x + slot.width / 2}%`,
            top: `${slot.y + slot.height / 2}%`,
            width: `${slot.width}%`,
            height: `${slot.height}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  const isTop = layout === "top-banner";
  const isBorder = layout === "border-only";
  const isTicket = layout === "ticket";
  const isBadge = layout === "badge";

  const banner = (
    <div
      className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold tracking-wider uppercase transition-all shadow-sm"
      style={{
        backgroundColor: design.frameColor,
        color: design.frameTextColor,
      }}
    >
      {hasGiftDecoration && (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="inline-block w-4 h-4 mr-1.5 align-[-3px]">
          <path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-4 0-5-1-5-3 0-1 1-2 2-2 2 0 3 3 3 5Zm0 0c4 0 5-1 5-3 0-1-1-2-2-2-2 0-3 3-3 5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      )}
      {design.frameText || "SCAN ME"}
    </div>
  );

  const ticketLabel = (
    <span
      className="text-xs font-black tracking-widest uppercase"
      style={{ color: design.frameColor }}
    >
      ★ {design.frameText || "COUPON / PASS"} ★
    </span>
  );

  if (isBadge) {
    return (
      <div
        className="relative p-4 rounded-3xl shadow-lg flex flex-col items-center gap-3"
        style={{ backgroundColor: design.frameColor }}
      >
        <div className="rounded-2xl p-2 bg-white">{children}</div>
        <span
          className="text-xs font-black tracking-widest uppercase text-center"
          style={{ color: design.frameTextColor }}
        >
          {design.frameText || "SCAN ME"}
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Decorative accents positioned absolutely */}
      {(decoration === "balloons" ||
        decoration === "confetti" ||
        decoration === "heart" ||
        decoration === "leafy" ||
        decoration === "christmas-tree" ||
        decoration === "snowflake" ||
        decoration === "ornament" ||
        decoration === "mistletoe" ||
        decoration === "gift-bundle" ||
        decoration === "holiday-star") && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <FrameDecorationSvg decoration={decoration} color={design.frameColor} />
        </svg>
      )}

      <div
        className={`p-6 rounded-3xl shadow-lg transition-all flex flex-col items-center gap-4 bg-white relative ${
          isTicket ? "border-4 border-dashed" : "border-2"
        } ${isTop ? "pt-4" : isBorder ? "" : "pb-4"}`}
        style={{ borderColor: design.frameColor }}
      >
        {isTop && banner}
        {isTicket && ticketLabel}
        {children}
        {!isTop && !isBorder && !isTicket && banner}
      </div>
    </div>
  );
}
