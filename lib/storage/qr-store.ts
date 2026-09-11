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

export interface TemplatePreset {
  id: string;
  title: string;
  category: "restaurant" | "business" | "wifi" | "event" | "social" | "retail";
  description: string;
  imageUrl: string;
  contentType: ContentType;
  defaultTitle: string;
  defaultData: any;
  design: QRDesignConfig;
}

export const CURATED_TEMPLATES: TemplatePreset[] = [
  {
    id: "restaurant-menu",
    title: "Bistro & Cafe Menu",
    category: "restaurant",
    description: "Elegant warm amber styling with clear 'VIEW MENU' call-to-action frame for dining tables.",
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
      frameStyle: "none",
      frameText: "SCAN ME",
      frameColor: "#78350f",
      frameTextColor: "#fef3c7",
    },
  },
  {
    id: "executive-vcard",
    title: "Executive Business Card",
    category: "business",
    description: "Sleek navy and cobalt with high-contrast scan card frame for networking.",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
    contentType: "vcard",
    defaultTitle: "Alex Morgan - VP Product",
    defaultData: {
      vcard: {
        firstName: "Alex",
        lastName: "Morgan",
        organization: "Acme Corp",
        jobTitle: "VP of Product",
        phone: "+1 (555) 234-5678",
        email: "alex.morgan@acme.com",
        website: "https://acme.com",
        street: "100 Market St",
        city: "San Francisco",
        country: "USA",
      },
    },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "rounded",
      dotsColor: "#0f172a",
      bgColor: "#f8fafc",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#0284c7",
      cornersDotStyle: "dot",
      cornersDotColor: "#0f172a",
      frameStyle: "none",
      frameText: "SCAN ME",
      frameColor: "#0f172a",
      frameTextColor: "#ffffff",
    },
  },
  {
    id: "guest-wifi",
    title: "Fast Guest Wi-Fi",
    category: "wifi",
    description: "Vibrant emerald green with instant Wi-Fi access badge for cafes, Airbnbs, and offices.",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=80",
    contentType: "wifi",
    defaultTitle: "Office Guest Wi-Fi",
    defaultData: {
      wifi: {
        ssid: "AcmeGuest_5G",
        password: "WelcomeToAcme2026",
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
      cornersSquareColor: "#059669",
      cornersDotStyle: "dot",
      cornersDotColor: "#047857",
      frameStyle: "none",
      frameText: "SCAN ME",
      frameColor: "#047857",
      frameTextColor: "#ffffff",
    },
  },
  {
    id: "social-creator",
    title: "Creator Bio & Socials",
    category: "social",
    description: "Vibrant gradient styling for creators, musicians, influencers, and digital portfolios.",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80",
    contentType: "social",
    defaultTitle: "Creator Link in Bio",
    defaultData: {
      social: {
        instagram: "https://instagram.com/myhandle",
        youtube: "https://youtube.com/@mychannel",
        twitter: "https://x.com/myhandle",
        website: "https://myportfolio.dev",
      },
    },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "extra-rounded",
      dotsColor: "#4f46e5",
      bgColor: "#ffffff",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#7c3aed",
      cornersDotStyle: "dot",
      cornersDotColor: "#4f46e5",
      frameStyle: "none",
      frameText: "SCAN ME",
      frameColor: "#4f46e5",
      frameTextColor: "#ffffff",
    },
  },
  {
    id: "retail-promo",
    title: "Retail 20% Discount",
    category: "retail",
    description: "High-urgency crimson ticket style for in-store promotions, coupons, and flyers.",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80",
    contentType: "url",
    defaultTitle: "Summer Flash Sale Coupon",
    defaultData: { url: "https://example.com/promo/summer20" },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "square",
      dotsColor: "#991b1b",
      bgColor: "#ffffff",
      cornersSquareStyle: "square",
      cornersSquareColor: "#dc2626",
      cornersDotStyle: "square",
      cornersDotColor: "#991b1b",
      frameStyle: "none",
      frameText: "SCAN ME",
      frameColor: "#dc2626",
      frameTextColor: "#ffffff",
    },
  },
  {
    id: "real-estate",
    title: "Luxury Real Estate Tour",
    category: "business",
    description: "Sleek architectural indigo style with 'TOUR PROPERTY' frame for real estate yard signs.",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80",
    contentType: "url",
    defaultTitle: "Villa Paradiso Virtual Tour",
    defaultData: { url: "https://example.com/property/villa-paradiso" },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "rounded",
      dotsColor: "#1e3a8a",
      bgColor: "#f0f9ff",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#0284c7",
      cornersDotStyle: "dot",
      cornersDotColor: "#1e3a8a",
      frameStyle: "none",
      frameText: "SCAN ME",
      frameColor: "#1e3a8a",
      frameTextColor: "#ffffff",
    },
  },
  {
    id: "wedding-invite",
    title: "Wedding RSVP & Registry",
    category: "event",
    description: "Elegant blush gold aesthetic with 'RSVP HERE' banner for printed wedding cards.",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
    contentType: "event",
    defaultTitle: "Emma & Lucas Wedding RSVP",
    defaultData: {
      event: {
        title: "Emma & Lucas Wedding Celebration",
        description: "Join us for our wedding celebration! Scan to RSVP and view registry.",
        location: "St. Regis Botanical Pavilion",
        startDate: "2026-10-15T16:00",
        endDate: "2026-10-15T23:00",
      },
    },
    design: {
      ...DEFAULT_DESIGN,
      dotsStyle: "classy",
      dotsColor: "#854d0e",
      bgColor: "#fffdfa",
      cornersSquareStyle: "extra-rounded",
      cornersSquareColor: "#ca8a04",
      cornersDotStyle: "dot",
      cornersDotColor: "#854d0e",
      frameStyle: "none",
      frameText: "SCAN ME",
      frameColor: "#854d0e",
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
