import { QRDesignConfig } from "@/types/qr";

export type FrameLayout =
  | "none"
  | "bottom-banner"
  | "top-banner"
  | "border-only"
  | "ticket"
  | "badge";

export type PremadeCategory =
  | "all"
  | "scan-me"
  | "wifi"
  | "food"
  | "retail"
  | "social"
  | "business"
  | "events"
  | "seasonal"
  | "love";

export type FrameDecoration =
  | "plain"
  | "scan-arrow"
  | "wifi-signal"
  | "menu-fork"
  | "coffee-cup"
  | "pizza-slice"
  | "shopping-bag"
  | "sale-tag"
  | "gift-box"
  | "instagram"
  | "follow-heart"
  | "link-chain"
  | "contact-card"
  | "star-rating"
  | "calendar"
  | "ticket-stub"
  | "balloons"
  | "confetti"
  | "christmas"
  | "christmas-tree"
  | "snowflake"
  | "ornament"
  | "mistletoe"
  | "gift-bundle"
  | "holiday-star"
  | "halloween"
  | "summer-sun"
  | "autumn-leaf"
  | "heart"
  | "wedding-rings"
  | "rose"
  | "leafy"
  | "wave"
  | "ribbon"
  | "badge"
  | "phone"
  | "location-pin";

export interface FrameDefinition {
  id: string;
  name: string;
  kind: "premade" | "standard";
  category: PremadeCategory;
  layout: FrameLayout;
  decoration: FrameDecoration;
  defaultText: string;
  defaultColor: string;
  defaultTextColor: string;
  defaultDotsColor?: string;
  defaultBgColor?: string;
}

const premade = (
  id: string,
  name: string,
  category: PremadeCategory,
  layout: FrameLayout,
  decoration: FrameDecoration,
  defaultColor: string,
  defaultText: string,
  defaultTextColor = "#ffffff",
  defaultDotsColor?: string,
  defaultBgColor?: string,
): FrameDefinition => ({
  id,
  name,
  kind: "premade",
  category,
  layout,
  decoration,
  defaultText,
  defaultColor,
  defaultTextColor,
  defaultDotsColor: defaultDotsColor ?? defaultColor,
  defaultBgColor: defaultBgColor ?? "#ffffff",
});

const standard = (
  id: string,
  name: string,
  layout: FrameLayout,
  decoration: FrameDecoration,
  defaultColor: string,
  defaultText: string,
): FrameDefinition => ({
  id,
  name,
  kind: "standard",
  category: "scan-me",
  layout,
  decoration,
  defaultText,
  defaultColor,
  defaultTextColor: "#ffffff",
  defaultDotsColor: defaultColor,
  defaultBgColor: "#ffffff",
});

/** All built-in frame presets have been removed. Only the no-frame option remains available. */
export const PREMADE_TEMPLATES: FrameDefinition[] = [];

/** Standard structural frames — clean layouts matching ME-QR style */
export const STANDARD_FRAMES: FrameDefinition[] = [
  standard("std-none", "No Frame", "none", "plain", "#64748b", ""),
  standard("bottom-banner", "Bottom Banner", "bottom-banner", "plain", "#0f172a", "SCAN ME"),
  standard("top-banner", "Top Banner", "top-banner", "plain", "#0f172a", "SCAN ME"),
  standard("ticket", "Ticket / Pass", "ticket", "plain", "#dc2626", "SPECIAL PASS"),
  standard("badge", "Badge Card", "badge", "plain", "#4f46e5", "SCAN ME"),
  standard("border-only", "Border Only", "border-only", "plain", "#0f172a", ""),
];

export const ALL_FRAMES: FrameDefinition[] = [...PREMADE_TEMPLATES, ...STANDARD_FRAMES];

export const PREMADE_CATEGORIES: { id: PremadeCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "scan-me", label: "Scan Me" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "food", label: "Menu & Food" },
  { id: "retail", label: "Shop & Sale" },
  { id: "social", label: "Social" },
  { id: "business", label: "Business" },
  { id: "events", label: "Events" },
  { id: "seasonal", label: "Holiday" },
  { id: "love", label: "Love" },
];

export function getFrameDefinition(frameId: string): FrameDefinition | undefined {
  return ALL_FRAMES.find((frame) => frame.id === frameId);
}

export function getFrameLayout(frameId: string): FrameLayout {
  if (frameId === "none" || frameId === "std-none") return "none";
  if (frameId === "bottom-banner" || frameId === "std-bottom") return "bottom-banner";
  if (frameId === "top-banner" || frameId === "std-top") return "top-banner";
  if (frameId === "ticket" || frameId === "std-ticket") return "ticket";
  if (frameId === "badge" || frameId === "std-badge") return "badge";
  if (frameId === "border-only" || frameId === "std-border") return "border-only";
  if (
    frameId.startsWith("travel-") ||
    frameId.startsWith("food-") ||
    frameId.startsWith("halloween-") ||
    frameId.startsWith("valentine-") ||
    frameId.startsWith("beauty-")
  ) {
    return "border-only";
  }
  return getFrameDefinition(frameId)?.layout ?? "bottom-banner";
}

export function getCustomFrameDecoration(frameId: string): FrameDecoration {
  if (frameId.includes("heart")) return "heart";
  if (frameId.includes("gift")) return "gift-bundle";
  if (frameId.includes("christmas") || frameId.includes("holiday")) return "christmas-tree";
  if (frameId.includes("snow") || frameId.includes("winter")) return "snowflake";
  if (frameId.includes("halloween")) return "halloween";
  if (frameId.includes("food") || frameId.includes("menu") || frameId.includes("cup") || frameId.includes("bottle")) return "leafy";
  if (frameId.includes("valentine")) return "heart";
  if (frameId.includes("beauty")) return "rose";
  return "plain";
}

/** Apply a pre-made template frame + matching design defaults */
export function applyPremadeTemplate(
  design: QRDesignConfig,
  frame: FrameDefinition,
): QRDesignConfig {
  return {
    ...design,
    frameStyle: frame.id,
    frameText: frame.defaultText,
    frameColor: frame.defaultColor,
    frameTextColor: frame.defaultTextColor,
    dotsColor: frame.defaultDotsColor ?? frame.defaultColor,
    bgColor: frame.defaultBgColor ?? design.bgColor,
    bgTransparent: false,
    cornersSquareColor: frame.defaultDotsColor ?? frame.defaultColor,
    cornersDotColor: frame.defaultDotsColor ?? frame.defaultColor,
  };
}
