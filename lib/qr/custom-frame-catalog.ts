import { QRDesignConfig } from "@/types/qr";

/** Illustration keys — each maps to a rich SVG frame in FrameIllustrations.tsx */
export type IllustrationKey =
  | "no-frame"
  | "usa-flag"
  | "usa-flag-stars"
  | "christmas-ornament"
  | "holly-wreath"
  | "autumn-leaves"
  | "geo-blue"
  | "geo-orange"
  | "shop-cart"
  | "speech-bubble"
  | "olive-bottle"
  | "baby-carriage"
  | "gentleman"
  | "coffee-mug"
  | "watermelon"
  | "purple-star"
  | "leather-suitcase"
  | "paint-splash"
  | "taco-frame"
  | "sail-ship"
  | "briefcase"
  | "wedding-rings"
  | "super-dad"
  | "shamrock-hat"
  | "pocket-watch"
  | "floral-pink"
  | "floral-green"
  | "leafy-green"
  | "eid-mosque"
  | "eid-crescent"
  | "eid-lantern"
  | "eid-arch"
  | "xmas-candle"
  | "xmas-bell"
  | "xmas-stable"
  | "xmas-wreath"
  | "xmas-ornament-square"
  | "fool-jester"
  | "fool-balloons"
  | "fool-clown"
  | "fool-jackbox"
  | "fool-lol"
  | "dad-crown"
  | "dad-super"
  | "dad-tie"
  | "dad-hat"
  | "songkran-flowers"
  | "songkran-bowl"
  | "songkran-beach"
  | "songkran-castle"
  | "islamic-mosque"
  | "islamic-crescent"
  | "islamic-star"
  | "islamic-lanterns"
  | "cny-lantern"
  | "cny-envelope"
  | "cny-blossom"
  | "cny-fan"
  | "ny-pine"
  | "ny-bauble"
  | "ny-mittens"
  | "ny-gift"
  | "ny-cocoa"
  | "ny-ornament-cut"
  | "std-bottom"
  | "std-top"
  | "std-circle"
  | "std-ticket";

export interface CustomFrameTemplate {
  id: string;
  name: string;
  illustration: IllustrationKey;
  defaultText: string;
  defaultColor: string;
  defaultTextColor: string;
  defaultDotsColor?: string;
  defaultBgColor?: string;
  /** QR placement as % of viewBox (center + size) */
  qrSlot: { cx: number; cy: number; size: number };
  showBanner?: boolean;
}

export interface FrameGroup {
  id: string;
  label: string;
  defaultOpen: boolean;
  frames: CustomFrameTemplate[];
}

const frame = (
  id: string,
  name: string,
  illustration: IllustrationKey,
  color: string,
  text: string,
  qrSlot: CustomFrameTemplate["qrSlot"],
  opts?: Partial<CustomFrameTemplate>,
): CustomFrameTemplate => ({
  id,
  name,
  illustration,
  defaultText: text,
  defaultColor: color,
  defaultTextColor: "#ffffff",
  qrSlot,
  ...opts,
});

export const CUSTOM_FRAME_GROUPS: FrameGroup[] = [
  {
    id: "custom",
    label: "Custom Frames",
    defaultOpen: true,
    frames: [
      frame("cf-usa-flag", "USA Stripes", "usa-flag", "#b91c1c", "SCAN ME", { cx: 50, cy: 52, size: 42 }),
      frame("cf-usa-stars", "USA Stars", "usa-flag-stars", "#1d4ed8", "SCAN ME", { cx: 50, cy: 50, size: 40 }),
      frame("cf-xmas-ball", "Christmas Ball", "christmas-ornament", "#dc2626", "SCAN ME", { cx: 50, cy: 48, size: 36 }, { defaultDotsColor: "#dc2626" }),
      frame("cf-wreath", "Holly Wreath", "holly-wreath", "#15803d", "SCAN ME", { cx: 50, cy: 50, size: 38 }),
      frame("cf-autumn", "Autumn Leaves", "autumn-leaves", "#c2410c", "SCAN ME", { cx: 50, cy: 50, size: 40 }),
      frame("cf-geo-blue", "Blue Geo", "geo-blue", "#2563eb", "SCAN ME", { cx: 50, cy: 50, size: 44 }),
      frame("cf-geo-orange", "Orange Geo", "geo-orange", "#ea580c", "SCAN ME", { cx: 50, cy: 50, size: 44 }),
      frame("cf-shop-cart", "Shop Now", "shop-cart", "#7c3aed", "SHOP NOW!", { cx: 50, cy: 42, size: 38 }, { defaultTextColor: "#7c3aed", defaultDotsColor: "#7c3aed" }),
      frame("cf-speech", "Let's Start", "speech-bubble", "#312e81", "LET'S START!", { cx: 50, cy: 45, size: 36 }, { defaultTextColor: "#ffffff", defaultDotsColor: "#ffffff", defaultBgColor: "#312e81" }),
      frame("cf-olive", "Olive Oil", "olive-bottle", "#854d0e", "SCAN ME", { cx: 50, cy: 46, size: 34 }),
      frame("cf-baby", "Baby Carriage", "baby-carriage", "#db2777", "SCAN ME", { cx: 50, cy: 48, size: 36 }),
      frame("cf-gentleman", "Gentleman", "gentleman", "#15803d", "SCAN ME", { cx: 50, cy: 50, size: 38 }),
      frame("cf-coffee", "Coffee Mug", "coffee-mug", "#78350f", "SCAN ME", { cx: 50, cy: 48, size: 36 }),
      frame("cf-watermelon", "Watermelon", "watermelon", "#16a34a", "SCAN ME", { cx: 50, cy: 46, size: 38 }),
      frame("cf-star", "Purple Star", "purple-star", "#7c3aed", "SCAN ME", { cx: 50, cy: 50, size: 40 }),
      frame("cf-suitcase", "Travel Case", "leather-suitcase", "#92400e", "SCAN ME", { cx: 50, cy: 48, size: 36 }),
      frame("cf-splash", "Paint Splash", "paint-splash", "#ec4899", "SCAN ME", { cx: 50, cy: 50, size: 38 }),
      frame("cf-taco", "Taco Frame", "taco-frame", "#ea580c", "SCAN ME", { cx: 50, cy: 48, size: 36 }, { defaultDotsColor: "#ea580c" }),
      frame("cf-ship", "Sail Ship", "sail-ship", "#0284c7", "SCAN ME", { cx: 50, cy: 48, size: 36 }),
      frame("cf-briefcase", "Briefcase", "briefcase", "#475569", "SCAN ME", { cx: 50, cy: 48, size: 36 }),
      frame("cf-wedding", "Wedding Rings", "wedding-rings", "#b45309", "WEDDING DAY", { cx: 50, cy: 50, size: 38 }),
      frame("cf-super-dad", "Super Dad", "super-dad", "#eab308", "SUPER DAD", { cx: 50, cy: 50, size: 38 }),
      frame("cf-shamrock", "Shamrock", "shamrock-hat", "#16a34a", "SCAN ME", { cx: 50, cy: 50, size: 38 }),
      frame("cf-watch", "Pocket Watch", "pocket-watch", "#78716c", "SCAN ME", { cx: 50, cy: 50, size: 36 }),
      frame("cf-floral-p", "Pink Floral", "floral-pink", "#db2777", "SCAN ME", { cx: 50, cy: 50, size: 40 }),
      frame("cf-floral-g", "Green Floral", "floral-green", "#059669", "SCAN ME", { cx: 50, cy: 50, size: 40 }),
      frame("cf-leafy", "Leafy Green", "leafy-green", "#15803d", "SCAN ME", { cx: 50, cy: 50, size: 40 }, { defaultDotsColor: "#15803d" }),
    ],
  },
  {
    id: "eid",
    label: "Eid Al-Fitr",
    defaultOpen: false,
    frames: [
      frame("eid-mosque", "Mosque", "eid-mosque", "#1e3a8a", "EID MUBARAK", { cx: 50, cy: 52, size: 38 }),
      frame("eid-crescent", "Golden Crescent", "eid-crescent", "#ca8a04", "EID MUBARAK", { cx: 50, cy: 50, size: 40 }),
      frame("eid-lantern", "Pink Lantern", "eid-lantern", "#db2777", "EID MUBARAK", { cx: 50, cy: 50, size: 38 }),
      frame("eid-arch", "Decorative Arch", "eid-arch", "#4338ca", "EID MUBARAK", { cx: 50, cy: 52, size: 36 }),
    ],
  },
  {
    id: "christmas",
    label: "Christmas Day",
    defaultOpen: false,
    frames: [
      frame("xmas-candle", "Red Candle", "xmas-candle", "#dc2626", "MERRY XMAS", { cx: 50, cy: 50, size: 38 }),
      frame("xmas-bell", "Silver Bell", "xmas-bell", "#64748b", "MERRY XMAS", { cx: 50, cy: 50, size: 38 }),
      frame("xmas-stable", "Nativity", "xmas-stable", "#854d0e", "MERRY XMAS", { cx: 50, cy: 52, size: 36 }),
      frame("xmas-wreath", "Holly Wreath", "xmas-wreath", "#15803d", "MERRY XMAS", { cx: 50, cy: 50, size: 38 }),
      frame("xmas-square", "Ornament Card", "xmas-ornament-square", "#dc2626", "MERRY XMAS", { cx: 50, cy: 50, size: 40 }),
    ],
  },
  {
    id: "fools-day",
    label: "Fool's Day",
    defaultOpen: false,
    frames: [
      frame("fool-jester", "Jester Hat", "fool-jester", "#9333ea", "LOL!", { cx: 50, cy: 50, size: 38 }),
      frame("fool-balloons", "Balloons", "fool-balloons", "#ec4899", "PARTY!", { cx: 50, cy: 50, size: 38 }),
      frame("fool-clown", "Clown", "fool-clown", "#ef4444", "LOL!", { cx: 50, cy: 50, size: 38 }),
      frame("fool-jackbox", "Jack-in-Box", "fool-jackbox", "#7c3aed", "SURPRISE!", { cx: 50, cy: 48, size: 36 }),
      frame("fool-lol", "LOL Confetti", "fool-lol", "#dc2626", "LOL!", { cx: 50, cy: 50, size: 40 }),
    ],
  },
  {
    id: "fathers-day",
    label: "Father's Day",
    defaultOpen: false,
    frames: [
      frame("dad-crown", "King Crown", "dad-crown", "#0d9488", "BEST DAD", { cx: 50, cy: 50, size: 38 }),
      frame("dad-super", "Super Dad", "dad-super", "#eab308", "SUPER DAD", { cx: 50, cy: 50, size: 38 }),
      frame("dad-tie", "Shirt & Tie", "dad-tie", "#2563eb", "DAD", { cx: 50, cy: 50, size: 38 }),
      frame("dad-hat", "Hat & Mustache", "dad-hat", "#475569", "DAD", { cx: 50, cy: 50, size: 38 }),
    ],
  },
  {
    id: "songkran",
    label: "Songkran - Thai New Year",
    defaultOpen: false,
    frames: [
      frame("sk-flowers", "Pink Flowers", "songkran-flowers", "#ec4899", "HAPPY NEW YEAR", { cx: 50, cy: 50, size: 38 }),
      frame("sk-bowl", "Water Bowl", "songkran-bowl", "#0891b2", "SONGKRAN", { cx: 50, cy: 50, size: 38 }),
      frame("sk-beach", "Beach Palm", "songkran-beach", "#0284c7", "SONGKRAN", { cx: 50, cy: 48, size: 36 }),
      frame("sk-castle", "Sand Castle", "songkran-castle", "#f59e0b", "SONGKRAN", { cx: 50, cy: 48, size: 36 }),
    ],
  },
  {
    id: "islamic",
    label: "Islamic Occasions",
    defaultOpen: false,
    frames: [
      frame("isl-mosque", "Mosque Arch", "islamic-mosque", "#1e40af", "SCAN ME", { cx: 50, cy: 54, size: 36 }),
      frame("isl-crescent", "Purple Crescent", "islamic-crescent", "#7c3aed", "SCAN ME", { cx: 50, cy: 50, size: 40 }),
      frame("isl-star", "Rub el Hizb", "islamic-star", "#0891b2", "SCAN ME", { cx: 50, cy: 50, size: 40 }),
      frame("isl-lanterns", "Lanterns", "islamic-lanterns", "#b45309", "SCAN ME", { cx: 50, cy: 50, size: 38 }),
    ],
  },
  {
    id: "chinese-ny",
    label: "Chinese New Year",
    defaultOpen: false,
    frames: [
      frame("cny-lantern", "Red Lantern", "cny-lantern", "#dc2626", "新年快乐", { cx: 50, cy: 50, size: 38 }),
      frame("cny-envelope", "Red Envelope", "cny-envelope", "#b91c1c", "福", { cx: 50, cy: 50, size: 38 }),
      frame("cny-blossom", "Peony Blossom", "cny-blossom", "#db2777", "新年快乐", { cx: 50, cy: 50, size: 40 }),
      frame("cny-fan", "Golden Fan", "cny-fan", "#ca8a04", "新年快乐", { cx: 50, cy: 50, size: 40 }),
    ],
  },
  {
    id: "new-year",
    label: "New Year",
    defaultOpen: false,
    frames: [
      frame("ny-pine", "Pine & Berries", "ny-pine", "#15803d", "HAPPY NEW YEAR", { cx: 50, cy: 50, size: 40 }),
      frame("ny-bauble", "Red Bauble", "ny-bauble", "#dc2626", "HAPPY NEW YEAR", { cx: 50, cy: 50, size: 38 }),
      frame("ny-mittens", "Mittens & Candy", "ny-mittens", "#0891b2", "HAPPY NEW YEAR", { cx: 50, cy: 50, size: 40 }),
      frame("ny-gift", "Gift Box", "ny-gift", "#dc2626", "HAPPY NEW YEAR", { cx: 50, cy: 48, size: 36 }),
      frame("ny-cocoa", "Hot Cocoa", "ny-cocoa", "#78350f", "HAPPY NEW YEAR", { cx: 50, cy: 48, size: 34 }),
      frame("ny-ornament", "Ornament Cut", "ny-ornament-cut", "#dc2626", "HAPPY NEW YEAR", { cx: 50, cy: 50, size: 36 }),
    ],
  },
];

export const STANDARD_FRAME_GROUP: FrameGroup = {
  id: "standard",
  label: "Standard",
  defaultOpen: true,
  frames: [
    frame("std-bottom", "Bottom Banner", "std-bottom", "#64748b", "SCAN ME", { cx: 50, cy: 42, size: 44 }, { showBanner: true }),
    frame("std-top", "Top Banner", "std-top", "#64748b", "SCAN HERE", { cx: 50, cy: 48, size: 44 }, { showBanner: true }),
    frame("std-circle", "Circle", "std-circle", "#64748b", "SCAN ME", { cx: 50, cy: 50, size: 42 }),
    frame("std-ticket", "Ticket", "std-ticket", "#64748b", "ENTRY PASS", { cx: 50, cy: 46, size: 40 }),
  ],
};

export const ALL_CUSTOM_FRAMES: CustomFrameTemplate[] = [
  ...CUSTOM_FRAME_GROUPS.flatMap((g) => g.frames),
  ...STANDARD_FRAME_GROUP.frames,
];

export function getCustomFrame(id: string): CustomFrameTemplate | undefined {
  return ALL_CUSTOM_FRAMES.find((f) => f.id === id);
}

export function applyCustomFrame(
  design: QRDesignConfig,
  frame: CustomFrameTemplate,
): QRDesignConfig {
  return {
    ...design,
    frameStyle: frame.id,
    frameText: frame.defaultText,
    frameColor: frame.defaultColor,
    frameTextColor: frame.defaultTextColor,
    dotsColor: frame.defaultDotsColor ?? frame.defaultColor,
    bgColor: frame.defaultBgColor ?? "#ffffff",
    bgTransparent: false,
    cornersSquareColor: frame.defaultDotsColor ?? frame.defaultColor,
    cornersDotColor: frame.defaultDotsColor ?? frame.defaultColor,
  };
}

/** Backward compat for frame-registry consumers */
export function getFrameLayout(frameId: string): "none" | "illustrated" | "bottom-banner" | "top-banner" | "ticket" | "border-only" {
  if (frameId === "none") return "none";
  const frame = getCustomFrame(frameId);
  if (!frame) return "illustrated";
  if (frame.showBanner) {
    if (frame.illustration === "std-top") return "top-banner";
    return "bottom-banner";
  }
  if (frame.illustration === "std-ticket") return "ticket";
  if (frame.illustration === "std-circle") return "border-only";
  return "illustrated";
}

export function getFrameDefinition(frameId: string) {
  const frame = getCustomFrame(frameId);
  if (!frame) return undefined;
  return {
    id: frame.id,
    name: frame.name,
    defaultText: frame.defaultText,
    defaultColor: frame.defaultColor,
    defaultTextColor: frame.defaultTextColor,
    illustration: frame.illustration,
    qrSlot: frame.qrSlot,
  };
}

export const applyPremadeTemplate = applyCustomFrame;
