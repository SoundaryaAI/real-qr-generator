import { QRCodeRecord, QRDesignConfig, ScanEvent, ContentType } from "@/types/qr";

const STORAGE_KEY = "real_qr_codes_v1";
const SCANS_STORAGE_KEY = "real_qr_scans_v1";

export const DEFAULT_DESIGN: QRDesignConfig = {
  dotsStyle: "rounded",
  dotsColor: "#0f172a",
  dotsColorType: "single",
  bgColor: "#ffffff",
  bgTransparent: false,
  cornersSquareStyle: "extra-rounded",
  cornersSquareColor: "#0f172a",
  cornersDotStyle: "dot",
  cornersDotColor: "#0f172a",
  errorCorrectionLevel: "M",
  logoUrl: null,
  logoSize: 0.25,
  logoMargin: 8,
  frameStyle: "none",
  frameText: "SCAN ME",
  frameColor: "#0f172a",
  frameTextColor: "#ffffff",
};

export type TemplateCategory =
  | "all"
  | "menu"
  | "social"
  | "app"
  | "coupon"
  | "feedback"
  | "wifi"
  | "business"
  | "pets"
  | "event"
  | "video"
  | "medical"
  | "pdf";

export interface TemplatePreset {
  id: string;
  title: string;
  category: TemplateCategory;
  description: string;
  imageUrl: string;
  contentType: ContentType;
  defaultTitle: string;
  defaultData: any;
  design: QRDesignConfig;
}

export const CURATED_TEMPLATES: TemplatePreset[] = [
  // 1. Menu & Dining
  {
    id: "restaurant-menu",
    title: "Tabletop Restaurant Menu",
    category: "menu",
    description: "Warm amber tabletop menu with bold 'VIEW MENU' call-to-action banner for dining tables and cafes.",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
    contentType: "url",
    defaultTitle: "Artisan Bistro Menu",
    defaultData: { url: "https://example.com/menu" },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "classy",
      dotsColor: "#78350f",
      bgColor: "#fffbeb",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#b45309",
      cornersDotStyle: "dot",
      cornersDotColor: "#78350f",
      frameStyle: "bottom-banner",
      frameText: "VIEW MENU",
      frameColor: "#b45309",
      frameTextColor: "#ffffff",
    },
  },
  {
    id: "cocktail-bar",
    title: "Cocktail & Drinks List",
    category: "menu",
    description: "Deep burgundy styling with 'DRINKS MENU' frame for bars, lounges, and speakeasies.",
    imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80",
    contentType: "url",
    defaultTitle: "Speakeasy Cocktail List",
    defaultData: { url: "https://example.com/cocktails" },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "rounded",
      dotsColor: "#9d174d",
      bgColor: "#fdf2f8",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#831843",
      cornersDotStyle: "dot",
      cornersDotColor: "#9d174d",
      frameStyle: "bottom-banner",
      frameText: "DRINKS LIST",
      frameColor: "#831843",
      frameTextColor: "#ffffff",
    },
  },
  {
    id: "cafe-table-order",
    title: "Scan to Order & Pay",
    category: "menu",
    description: "High-contrast emerald badge frame with 'ORDER & PAY' for seamless contactless tabletop dining.",
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80",
    contentType: "url",
    defaultTitle: "Table 14 Order & Checkout",
    defaultData: { url: "https://example.com/table/14" },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "extra-rounded",
      dotsColor: "#166534",
      bgColor: "#f0fdf4",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#15803d",
      cornersDotStyle: "dot",
      cornersDotColor: "#166534",
      frameStyle: "badge",
      frameText: "ORDER & PAY",
      frameColor: "#15803d",
      frameTextColor: "#ffffff",
    },
  },

  // 2. List of Links & Socials
  {
    id: "creator-bio-hub",
    title: "Creator Multi-Link Bio",
    category: "social",
    description: "Vibrant electric violet Linktree-style hub connecting Instagram, TikTok, YouTube, and portfolio.",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80",
    contentType: "social",
    defaultTitle: "Creator Bio & Social Links",
    defaultData: {
      social: {
        instagram: "https://instagram.com/creator",
        youtube: "https://youtube.com/@creator",
        twitter: "https://x.com/creator",
        website: "https://bio.link/creator",
      },
    },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "dots",
      dotsColor: "#6d28d9",
      bgColor: "#faf5ff",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#7c3aed",
      cornersDotStyle: "dot",
      cornersDotColor: "#6d28d9",
      frameStyle: "bottom-banner",
      frameText: "CONNECT WITH US",
      frameColor: "#7c3aed",
      frameTextColor: "#ffffff",
    },
  },
  {
    id: "musician-album-link",
    title: "Music Release & Spotify",
    category: "social",
    description: "Mint emerald audio badge for album drops, Spotify playlists, SoundCloud tracks, and podcasts.",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    contentType: "url",
    defaultTitle: "New Single Stream",
    defaultData: { url: "https://open.spotify.com/album/example" },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "extra-rounded",
      dotsColor: "#047857",
      bgColor: "#ecfdf5",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#059669",
      cornersDotStyle: "dot",
      cornersDotColor: "#047857",
      frameStyle: "badge",
      frameText: "LISTEN NOW",
      frameColor: "#059669",
      frameTextColor: "#ffffff",
    },
  },

  // 3. Apps & Mobile
  {
    id: "app-smart-install",
    title: "Universal App Download",
    category: "app",
    description: "Smart routing link directing iOS devices to Apple App Store and Android devices to Google Play.",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
    contentType: "app_smart_link",
    defaultTitle: "Download Mobile App",
    defaultData: {
      appSmartLink: {
        iosUrl: "https://apps.apple.com/app/id123456789",
        androidUrl: "https://play.google.com/store/apps/details?id=com.example.app",
        fallbackUrl: "https://example.com/download",
      },
    },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "extra-rounded",
      dotsColor: "#4338ca",
      bgColor: "#eef2ff",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#4f46e5",
      cornersDotStyle: "dot",
      cornersDotColor: "#4338ca",
      frameStyle: "bottom-banner",
      frameText: "GET THE APP",
      frameColor: "#4f46e5",
      frameTextColor: "#ffffff",
    },
  },

  // 4. Coupons & Retail Promo
  {
    id: "retail-flash-coupon",
    title: "In-Store 20% Discount Pass",
    category: "coupon",
    description: "High-urgency ticket pass with dashed coupon border for retail sales, flyers, and discount vouchers.",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80",
    contentType: "url",
    defaultTitle: "20% Off Storewide Coupon",
    defaultData: { url: "https://shop.com/coupon/save20" },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "square",
      dotsColor: "#b91c1c",
      bgColor: "#ffffff",
      cornersSquareStyle: "square",
      cornersSquareColor: "#dc2626",
      cornersDotStyle: "square",
      cornersDotColor: "#b91c1c",
      frameStyle: "ticket",
      frameText: "20% OFF COUPON",
      frameColor: "#dc2626",
      frameTextColor: "#ffffff",
    },
  },
  {
    id: "black-friday-pass",
    title: "Black Friday VIP Access",
    category: "coupon",
    description: "Dark obsidian ticket styling for early-bird flash sales, doorbuster promos, and VIP store access.",
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80",
    contentType: "url",
    defaultTitle: "Black Friday VIP Pass",
    defaultData: { url: "https://shop.com/blackfriday-vip" },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "classy",
      dotsColor: "#1e293b",
      bgColor: "#ffffff",
      cornersSquareStyle: "square",
      cornersSquareColor: "#0f172a",
      cornersDotStyle: "dot",
      cornersDotColor: "#1e293b",
      frameStyle: "ticket",
      frameText: "VIP SALE PASS",
      frameColor: "#0f172a",
      frameTextColor: "#ffffff",
    },
  },

  // 5. Feedback & Reviews
  {
    id: "google-reviews-counter",
    title: "Google 5-Star Reviews",
    category: "feedback",
    description: "Gold amber countertop frame with 'RATE US 5★' to rapidly collect verified Google customer reviews.",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80",
    contentType: "url",
    defaultTitle: "Review Us On Google",
    defaultData: { url: "https://g.page/r/your-place-id/review" },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "rounded",
      dotsColor: "#b45309",
      bgColor: "#fffbeb",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#d97706",
      cornersDotStyle: "dot",
      cornersDotColor: "#b45309",
      frameStyle: "bottom-banner",
      frameText: "RATE US 5★",
      frameColor: "#d97706",
      frameTextColor: "#ffffff",
    },
  },
  {
    id: "hotel-tripadvisor",
    title: "Hotel & Guest Rating",
    category: "feedback",
    description: "Clean teal hospitality banner for hotel lobbies, concierge desks, and restaurant checkout bill holders.",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    contentType: "url",
    defaultTitle: "Guest Satisfaction Review",
    defaultData: { url: "https://tripadvisor.com/review" },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "classy",
      dotsColor: "#0f766e",
      bgColor: "#f0fdfa",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#0d9488",
      cornersDotStyle: "dot",
      cornersDotColor: "#0f766e",
      frameStyle: "bottom-banner",
      frameText: "LEAVE A REVIEW",
      frameColor: "#0d9488",
      frameTextColor: "#ffffff",
    },
  },

  // 6. Wi-Fi Access
  {
    id: "cafe-guest-wifi",
    title: "One-Tap Cafe Guest Wi-Fi",
    category: "wifi",
    description: "Forest emerald frame connecting customers to Wi-Fi instantly without typing complex passwords.",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=80",
    contentType: "wifi",
    defaultTitle: "Artisan Cafe High-Speed Wi-Fi",
    defaultData: {
      wifi: {
        ssid: "ArtisanCafe_Guest",
        password: "EnjoyYourCoffee2026",
        encryption: "WPA",
        hidden: false,
      },
    },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "dots",
      dotsColor: "#065f46",
      bgColor: "#ecfdf5",
      cornersSquareStyle: "dot",
      cornersSquareColor: "#047857",
      cornersDotStyle: "dot",
      cornersDotColor: "#065f46",
      frameStyle: "bottom-banner",
      frameText: "FREE WI-FI",
      frameColor: "#047857",
      frameTextColor: "#ffffff",
    },
  },
  {
    id: "cowork-highspeed-wifi",
    title: "Office & Cowork Wi-Fi",
    category: "wifi",
    description: "Deep teal badge card for tech offices, modern coworking spaces, and conference halls.",
    imageUrl: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&auto=format&fit=crop&q=80",
    contentType: "wifi",
    defaultTitle: "Cowork Office Wi-Fi",
    defaultData: {
      wifi: {
        ssid: "Cowork_5G_Fast",
        password: "WelcomeToCowork2026",
        encryption: "WPA",
        hidden: false,
      },
    },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "classy-rounded",
      dotsColor: "#115e59",
      bgColor: "#f0fdfa",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#0f766e",
      cornersDotStyle: "dot",
      cornersDotColor: "#115e59",
      frameStyle: "badge",
      frameText: "CONNECT WI-FI",
      frameColor: "#0f766e",
      frameTextColor: "#ffffff",
    },
  },

  // 7. Business & vCard
  {
    id: "executive-vcard",
    title: "Executive Digital Business Card",
    category: "business",
    description: "Sleek obsidian navy vCard 3.0 saving phone, email, title, and LinkedIn directly to smartphone contacts.",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
    contentType: "vcard",
    defaultTitle: "David Vance - Managing Director",
    defaultData: {
      vcard: {
        firstName: "David",
        lastName: "Vance",
        organization: "Apex Capital Partners",
        jobTitle: "Managing Director",
        phone: "+1 (555) 345-6789",
        email: "david.vance@apexcapital.com",
        website: "https://apexcapital.com",
        street: "100 Wall Street",
        city: "New York",
        country: "USA",
      },
    },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "extra-rounded",
      dotsColor: "#1e293b",
      bgColor: "#f8fafc",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#0f172a",
      cornersDotStyle: "dot",
      cornersDotColor: "#1e293b",
      frameStyle: "bottom-banner",
      frameText: "SAVE CONTACT",
      frameColor: "#0f172a",
      frameTextColor: "#ffffff",
    },
  },
  {
    id: "realtor-digital-card",
    title: "Real Estate Agent Contact",
    category: "business",
    description: "Cobalt architectural styling with 'CONTACT AGENT' for property yard signs and open house flyers.",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80",
    contentType: "vcard",
    defaultTitle: "Elena Rostova - Senior Realtor",
    defaultData: {
      vcard: {
        firstName: "Elena",
        lastName: "Rostova",
        organization: "Prestige Real Estate",
        jobTitle: "Senior Realtor",
        phone: "+1 (555) 987-6543",
        email: "elena@prestigerealty.com",
        website: "https://prestigerealty.com",
        city: "Miami",
        country: "USA",
      },
    },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "rounded",
      dotsColor: "#1e40af",
      bgColor: "#eff6ff",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#1e3a8a",
      cornersDotStyle: "dot",
      cornersDotColor: "#1e40af",
      frameStyle: "bottom-banner",
      frameText: "CONTACT AGENT",
      frameColor: "#1e3a8a",
      frameTextColor: "#ffffff",
    },
  },

  // 8. Pets & Security (ME-QR Specialty)
  {
    id: "pet-collar-tag",
    title: "Pet Collar ID - If Lost Please Scan",
    category: "pets",
    description: "Bright coral orange badge frame for pet tags, lost dog/cat collars, connecting directly to owner phone.",
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80",
    contentType: "phone",
    defaultTitle: "Buddy's Collar Tag",
    defaultData: { phone: "+1 (555) 789-0123" },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "dots",
      dotsColor: "#c2410c",
      bgColor: "#fff7ed",
      cornersSquareStyle: "dot",
      cornersSquareColor: "#ea580c",
      cornersDotStyle: "dot",
      cornersDotColor: "#c2410c",
      frameStyle: "badge",
      frameText: "LOST PET? SCAN",
      frameColor: "#ea580c",
      frameTextColor: "#ffffff",
    },
  },
  {
    id: "lost-pet-profile",
    title: "Lost Pet Medical & Owner Bio",
    category: "pets",
    description: "Rose red alert frame linking to online pet medical details, microchip number, and recovery reward.",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80",
    contentType: "url",
    defaultTitle: "Luna's Pet Safety Profile",
    defaultData: { url: "https://petfinder.org/pet/luna-safety" },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "extra-rounded",
      dotsColor: "#be123c",
      bgColor: "#fff1f2",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#e11d48",
      cornersDotStyle: "dot",
      cornersDotColor: "#be123c",
      frameStyle: "bottom-banner",
      frameText: "HELP ME GET HOME",
      frameColor: "#e11d48",
      frameTextColor: "#ffffff",
    },
  },

  // 9. Events & Tickets
  {
    id: "tech-summit-pass",
    title: "Conference Badge & VIP Ticket",
    category: "event",
    description: "Cyber cyan badge frame with 'VIP PASS' for tech summits, badges, expo hall check-in, and schedules.",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    contentType: "event",
    defaultTitle: "Global AI Summit 2026",
    defaultData: {
      event: {
        title: "Global AI Summit 2026",
        description: "VIP Keynote & Workshop Badge",
        location: "Convention Center Hall A",
        startDate: "2026-11-12T09:00",
        endDate: "2026-11-14T18:00",
      },
    },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "classy-rounded",
      dotsColor: "#0369a1",
      bgColor: "#f0f9ff",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#0284c7",
      cornersDotStyle: "dot",
      cornersDotColor: "#0369a1",
      frameStyle: "badge",
      frameText: "VIP PASS",
      frameColor: "#0284c7",
      frameTextColor: "#ffffff",
    },
  },

  // 10. Video & Media
  {
    id: "youtube-product-demo",
    title: "YouTube Video & Unboxing",
    category: "video",
    description: "Crimson video banner with 'WATCH VIDEO' for packaging, manuals, and physical marketing collateral.",
    imageUrl: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&auto=format&fit=crop&q=80",
    contentType: "url",
    defaultTitle: "Product Unboxing Video",
    defaultData: { url: "https://youtube.com/watch?v=dQw4w9WgXcQ" },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "rounded",
      dotsColor: "#be123c",
      bgColor: "#fff1f2",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#e11d48",
      cornersDotStyle: "dot",
      cornersDotColor: "#be123c",
      frameStyle: "bottom-banner",
      frameText: "WATCH VIDEO",
      frameColor: "#e11d48",
      frameTextColor: "#ffffff",
    },
  },

  // 11. Medical & Health
  {
    id: "emergency-medical-card",
    title: "Emergency Medical ID Card",
    category: "medical",
    description: "Top banner medical alert frame displaying critical allergies, blood group, and emergency contact.",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80",
    contentType: "text",
    defaultTitle: "Emergency Health Profile",
    defaultData: {
      text: "EMERGENCY HEALTH PROFILE:\nName: Alex Rivera\nBlood Type: O Positive\nAllergies: Penicillin, Peanuts\nEmergency ICE: +1 (555) 890-1234",
    },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "square",
      dotsColor: "#991b1b",
      bgColor: "#fef2f2",
      cornersSquareStyle: "square",
      cornersSquareColor: "#b91c1c",
      cornersDotStyle: "square",
      cornersDotColor: "#991b1b",
      frameStyle: "top-banner",
      frameText: "EMERGENCY INFO",
      frameColor: "#b91c1c",
      frameTextColor: "#ffffff",
    },
  },

  // 12. PDF & Catalogs
  {
    id: "product-manual-pdf",
    title: "Digital Product Manual (PDF)",
    category: "pdf",
    description: "Slate charcoal frame for instruction booklets, warranty registration, and paperless PDF manuals.",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
    contentType: "url",
    defaultTitle: "User Manual & Warranty",
    defaultData: { url: "https://docs.brand.com/manual-v2.pdf" },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "extra-rounded",
      dotsColor: "#1e293b",
      bgColor: "#f8fafc",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#334155",
      cornersDotStyle: "dot",
      cornersDotColor: "#1e293b",
      frameStyle: "bottom-banner",
      frameText: "SCAN FOR MANUAL",
      frameColor: "#334155",
      frameTextColor: "#ffffff",
    },
  },
];

export function getStoredQrs(): QRCodeRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveQr(qr: QRCodeRecord): void {
  if (typeof window === "undefined") return;
  const list = getStoredQrs();
  const index = list.findIndex((item) => item.id === qr.id);
  if (index >= 0) {
    list[index] = qr;
  } else {
    list.unshift(qr);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function deleteQr(id: string): void {
  if (typeof window === "undefined") return;
  const list = getStoredQrs().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getQrById(id: string): QRCodeRecord | undefined {
  return getStoredQrs().find((item) => item.id === id);
}

export function getStoredScans(qrId?: string): ScanEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SCANS_STORAGE_KEY);
    const scans: ScanEvent[] = raw ? JSON.parse(raw) : [];
    if (qrId) {
      return scans.filter((s) => s.qrCodeId === qrId);
    }
    return scans;
  } catch {
    return [];
  }
}

export function logMockScan(qrId: string): ScanEvent {
  const devices = ["Mobile", "Mobile", "Mobile", "Desktop", "Tablet"];
  const osList = ["iOS", "iOS", "Android", "Android", "macOS", "Windows"];
  const browsers = ["Safari", "Chrome Mobile", "Chrome", "Firefox"];
  const cities = [
    { country: "United States", city: "New York" },
    { country: "United States", city: "San Francisco" },
    { country: "United Kingdom", city: "London" },
    { country: "India", city: "Bengaluru" },
    { country: "Germany", city: "Berlin" },
    { country: "Japan", city: "Tokyo" },
    { country: "Canada", city: "Toronto" },
  ];

  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const loc = pick(cities);

  const event: ScanEvent = {
    id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    qrCodeId: qrId,
    scannedAt: new Date().toISOString(),
    country: loc.country,
    city: loc.city,
    deviceType: pick(devices),
    os: pick(osList),
    browser: pick(browsers),
    referrer: Math.random() > 0.4 ? "Camera App" : "Instagram / Web",
  };

  if (typeof window !== "undefined") {
    const scans = getStoredScans();
    scans.unshift(event);
    localStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(scans.slice(0, 1000)));

    // Increment QR count
    const qrs = getStoredQrs();
    const target = qrs.find((q) => q.id === qrId);
    if (target) {
      target.scanCount = (target.scanCount || 0) + 1;
      saveQr(target);
    }
  }

  return event;
}
