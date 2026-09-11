"use client";

import React from "react";
import { FrameDecoration, FrameLayout } from "@/lib/qr/frame-registry";

interface Props {
  frameId: string;
  layout?: FrameLayout;
  decoration?: FrameDecoration;
  color?: string;
  textColor?: string;
  compact?: boolean;
}

function MiniQrPattern({ color }: { color: string }) {
  const modules = Array.from({ length: 121 }, (_, index) => {
    const row = Math.floor(index / 11);
    const column = index % 11;
    const finder =
      (row < 4 && column < 4) ||
      (row < 4 && column > 6) ||
      (row > 6 && column < 4);
    const finderRow = row < 4 ? row : row > 6 ? row - 7 : row;
    const finderCol = column < 4 ? column : column > 6 ? column - 7 : column;
    const finderPixel =
      finder &&
      (finderRow === 0 ||
        finderRow === 3 ||
        finderCol === 0 ||
        finderCol === 3 ||
        (finderRow >= 1 &&
          finderRow <= 2 &&
          finderCol >= 1 &&
          finderCol <= 2));
    const dataPixel = ((row * 13 + column * 7 + row * column) % 5) < 2;
    return finderPixel || (!finder && dataPixel);
  });

  return (
    <g fill={color}>
      {modules.map((active, index) =>
        active ? (
          <rect
            key={index}
            x={10 + (index % 11) * 2.6}
            y={12 + Math.floor(index / 11) * 2.6}
            width="2.2"
            height="2.2"
            rx="0.3"
          />
        ) : null,
      )}
    </g>
  );
}

function Banner({
  color,
  textColor,
  y,
  width = 36,
  x = 10,
}: {
  color: string;
  textColor: string;
  y: number;
  width?: number;
  x?: number;
}) {
  return (
    <>
      <rect x={x} y={y} width={width} height="7" rx="2.5" fill={color} />
      <line
        x1={x + 6}
        y1={y + 3.5}
        x2={x + width - 6}
        y2={y + 3.5}
        stroke={textColor}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.85"
      />
    </>
  );
}

function DecorationOverlay({
  decoration,
  color,
}: {
  decoration: FrameDecoration;
  color: string;
}) {
  switch (decoration) {
    case "wifi-signal":
      return (
        <g stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round">
          <path d="M 28 4 Q 28 7 28 9" />
          <path d="M 25 5 Q 28 8 31 5" />
          <path d="M 22 6 Q 28 12 34 6" />
        </g>
      );
    case "menu-fork":
      return (
        <g stroke={color} strokeWidth="1.3" strokeLinecap="round">
          <line x1="22" y1="3" x2="22" y2="9" />
          <line x1="20" y1="3" x2="20" y2="6" />
          <line x1="24" y1="3" x2="24" y2="6" />
          <line x1="34" y1="3" x2="34" y2="9" />
        </g>
      );
    case "coffee-cup":
      return (
        <g fill="none" stroke={color} strokeWidth="1.3">
          <path d="M 22 4 Q 23 7 22 9 M 26 3 Q 27 6 26 8 M 30 4 Q 31 7 30 9" strokeLinecap="round" />
          <rect x="20" y="7" width="14" height="3" rx="1" fill={color} stroke="none" />
        </g>
      );
    case "pizza-slice":
      return (
        <path
          d="M 28 2 L 34 10 A 7 7 0 0 1 22 10 Z"
          fill={color}
          opacity="0.9"
        />
      );
    case "shopping-bag":
      return (
        <g stroke={color} strokeWidth="1.3" fill="none">
          <path d="M 24 4 C 24 2 32 2 32 4" />
          <rect x="20" y="4" width="16" height="5" rx="1.5" fill={color} stroke="none" opacity="0.85" />
        </g>
      );
    case "sale-tag":
      return (
        <g fill={color}>
          <circle cx="8" cy="8" r="3" />
          <rect x="10" y="6.5" width="8" height="3" rx="0.5" />
        </g>
      );
    case "gift-box":
      return (
        <g fill={color}>
          <rect x="22" y="3" width="12" height="4" rx="1" />
          <rect x="27" y="3" width="2" height="4" fill="#fff" opacity="0.5" />
        </g>
      );
    case "instagram":
      return (
        <rect x="22" y="3" width="12" height="12" rx="3.5" stroke={color} strokeWidth="1.5" fill="none" />
      );
    case "follow-heart":
      return (
        <path
          d="M 28 10 C 28 7 22 6 22 10 C 22 14 28 16 28 16 C 28 16 34 14 34 10 C 34 6 28 7 28 10 Z"
          fill={color}
          transform="translate(0,-5) scale(0.7)"
        />
      );
    case "link-chain":
      return (
        <g stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M 22 6 C 20 6 19 8 20 9 L 22 11 C 23 12 25 11 25 9" />
          <path d="M 34 6 C 36 6 37 8 36 9 L 34 11 C 33 12 31 11 31 9" />
        </g>
      );
    case "contact-card":
      return (
        <rect x="20" y="3" width="16" height="10" rx="2" stroke={color} strokeWidth="1.3" fill="none" />
      );
    case "star-rating":
      return (
        <polygon
          points="28,2 29.2,5.5 33,5.5 30,7.5 31,11 28,9 25,11 26,7.5 23,5.5 26.8,5.5"
          fill={color}
        />
      );
    case "calendar":
      return (
        <g stroke={color} strokeWidth="1.2" fill="none">
          <rect x="21" y="4" width="14" height="10" rx="1.5" />
          <line x1="21" y1="7" x2="35" y2="7" />
          <line x1="25" y1="2" x2="25" y2="5" />
          <line x1="31" y1="2" x2="31" y2="5" />
        </g>
      );
    case "ticket-stub":
      return (
        <g fill="none" stroke={color} strokeWidth="1.3">
          <circle cx="6" cy="32" r="3" />
          <circle cx="50" cy="32" r="3" />
        </g>
      );
    case "balloons":
      return (
        <g>
          <circle cx="8" cy="10" r="4" fill="#f43f5e" />
          <circle cx="48" cy="10" r="4" fill="#38bdf8" />
          <circle cx="10" cy="18" r="3" fill="#a855f7" />
          <circle cx="46" cy="18" r="3" fill="#ec4899" />
        </g>
      );
    case "confetti":
      return (
        <g>
          <circle cx="6" cy="6" r="1.5" fill="#f43f5e" />
          <rect x="48" y="4" width="2" height="2" fill="#3b82f6" transform="rotate(20 48 4)" />
          <circle cx="50" cy="54" r="1.5" fill="#10b981" />
          <rect x="4" y="52" width="2" height="2" fill="#f59e0b" transform="rotate(45 4 52)" />
        </g>
      );
    case "christmas":
      return (
        <g fill={color}>
          <polygon points="28,2 32,10 24,10" />
          <rect x="27" y="10" width="2" height="3" />
        </g>
      );
    case "christmas-tree":
      return (
        <g fill={color}>
          <polygon points="28,6 34,16 22,16" />
          <polygon points="26,14 36,14 31,23" />
          <rect x="27.5" y="23" width="1.5" height="5" rx="0.8" />
        </g>
      );
    case "snowflake":
      return (
        <g stroke={color} strokeWidth="1.2" fill="none">
          <path d="M28 4L28 18M22 11H34M24 7L32 15M24 15L32 7" />
        </g>
      );
    case "ornament":
      return (
        <g fill={color}>
          <circle cx="28" cy="10" r="5" />
          <path d="M28 15V21" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M24 21H32" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
        </g>
      );
    case "mistletoe":
      return (
        <g fill={color}>
          <circle cx="22" cy="11" r="3" />
          <circle cx="34" cy="11" r="3" />
          <path d="M24 16C26 13 30 13 32 16" stroke={color} strokeWidth="1.3" fill="none" />
        </g>
      );
    case "gift-bundle":
      return (
        <g fill={color}>
          <rect x="20" y="10" width="16" height="10" rx="2" />
          <rect x="18" y="14" width="20" height="4" rx="1.5" />
          <rect x="28" y="10" width="2" height="12" />
        </g>
      );
    case "holiday-star":
      return (
        <g fill={color}>
          <path d="M28 3L31 12L40 12L33 18L36 27L28 22L20 27L23 18L16 12H25L28 3Z" />
        </g>
      );
    case "halloween":
      return (
        <g fill={color}>
          <circle cx="28" cy="7" r="5" />
          <polygon points="24,7 26,9 28,7 30,9 32,7" fill="#fff" />
        </g>
      );
    case "summer-sun":
      return (
        <g stroke={color} strokeWidth="1.2" fill={color}>
          <circle cx="28" cy="6" r="3.5" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1={28 + Math.cos((angle * Math.PI) / 180) * 5}
              y1={6 + Math.sin((angle * Math.PI) / 180) * 5}
              x2={28 + Math.cos((angle * Math.PI) / 180) * 7}
              y2={6 + Math.sin((angle * Math.PI) / 180) * 7}
            />
          ))}
        </g>
      );
    case "autumn-leaf":
      return (
        <path
          d="M 6 8 C 8 4 12 6 10 10 C 8 14 4 12 6 8"
          fill={color}
        />
      );
    case "heart":
      return (
        <path
          d="M 28 12 C 28 8 22 7 22 11 C 22 15 28 17 28 17 C 28 17 34 15 34 11 C 34 7 28 8 28 12 Z"
          fill={color}
          transform="translate(0,-4) scale(0.75)"
        />
      );
    case "wedding-rings":
      return (
        <g fill="none" stroke={color} strokeWidth="1.5">
          <circle cx="24" cy="6" r="4" />
          <circle cx="32" cy="6" r="4" />
        </g>
      );
    case "rose":
      return (
        <g fill={color}>
          <circle cx="24" cy="6" r="3" />
          <circle cx="32" cy="6" r="3" />
        </g>
      );
    case "leafy":
      return (
        <g fill={color} opacity="0.8">
          <ellipse cx="8" cy="8" rx="4" ry="2" transform="rotate(-30 8 8)" />
          <ellipse cx="48" cy="8" rx="4" ry="2" transform="rotate(30 48 8)" />
        </g>
      );
    case "wave":
      return (
        <path
          d="M 8 54 Q 16 50 24 54 T 40 54 T 48 54"
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      );
    case "ribbon":
      return (
        <path d="M 18 4 L 28 8 L 38 4 L 38 8 L 18 8 Z" fill={color} />
      );
    case "badge":
      return (
        <rect x="20" y="3" width="16" height="6" rx="3" fill={color} />
      );
    case "phone":
      return (
        <path
          d="M 24 4 C 23 4 22 5 22 6 L 22 10 C 22 11 23 12 24 12 L 32 12 C 33 12 34 11 34 10 L 34 6 C 34 5 33 4 32 4 Z"
          stroke={color}
          strokeWidth="1.2"
          fill="none"
        />
      );
    case "location-pin":
      return (
        <path
          d="M 28 3 C 25 3 23 5.5 23 8 C 23 12 28 16 28 16 C 28 16 33 12 33 8 C 33 5.5 31 3 28 3 Z M 28 10 A 2 2 0 1 1 28 6 A 2 2 0 0 1 28 10 Z"
          fill={color}
          transform="translate(0,-2) scale(0.85)"
        />
      );
    case "scan-arrow":
      return (
        <g stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M 28 52 L 28 46 M 25 49 L 28 46 L 31 49" />
        </g>
      );
    default:
      return null;
  }
}

export function FrameMiniature({
  frameId,
  layout = "bottom-banner",
  decoration = "plain",
  color = "#0f172a",
  textColor = "#ffffff",
  compact = false,
}: Props) {
  const sizeClass = compact ? "w-10 h-12" : "w-12 h-14";

  if (frameId === "none") {
    return (
      <svg className={sizeClass} viewBox="0 0 56 64" fill="none">
        <rect
          x="8"
          y="10"
          width="40"
          height="44"
          rx="5"
          stroke="#94a3b8"
          strokeWidth="1.8"
          strokeDasharray="4 3"
        />
        <line x1="10" y1="12" x2="46" y2="52" stroke="#94a3b8" strokeWidth="1.5" />
        <MiniQrPattern color="#cbd5e1" />
      </svg>
    );
  }

  const isTop = layout === "top-banner";
  const isBorder = layout === "border-only";
  const isTicket = layout === "ticket";

  return (
    <svg className={sizeClass} viewBox="0 0 56 64" fill="none">
      {/* Card background */}
      <rect
        x="6"
        y="6"
        width="44"
        height="52"
        rx={isTicket ? 4 : 7}
        stroke={color}
        strokeWidth={isBorder ? 2.5 : 1.8}
        fill="#ffffff"
        strokeDasharray={isTicket ? "4 2" : undefined}
      />

      <DecorationOverlay decoration={decoration} color={color} />

      {/* QR area */}
      <rect x="12" y={isTop ? 20 : 14} width="32" height="32" rx="3" fill="#fafafa" />
      <g transform={isTop ? "translate(0, 8)" : undefined}>
        <MiniQrPattern color={color} />
      </g>

      {/* Banner */}
      {!isBorder && (
        isTop ? (
          <Banner color={color} textColor={textColor} y={10} />
        ) : (
          <Banner color={color} textColor={textColor} y={48} />
        )
      )}

      {isTicket && (
        <>
          <circle cx="6" cy="32" r="3.5" fill="#fff" stroke={color} strokeWidth="1.5" />
          <circle cx="50" cy="32" r="3.5" fill="#fff" stroke={color} strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}

export function NoFrameMiniature() {
  return <FrameMiniature frameId="none" />;
}
