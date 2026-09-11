# RealQR Studio 🚀
### Production-Ready, Real-Time Dynamic QR Code Generator & Analytics Platform

A modern, high-performance, full-stack QR code platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase/PostgreSQL**. Designed to match and exceed platforms like *qrfy.com* and *me-qr.com* with **zero scan limits**, **zero forced watermarks**, vector-grade print exports, and real-time scan analytics.

---

## 🌟 Key Features

### 1. Vector QR Studio Generator
- **12+ Content Types**: Website URL, Plain Text, vCard (Contact Card), Wi-Fi Network, Social Links (Bio), Payment Link (UPI & PayPal), Email, SMS, Direct Phone Call, Calendar Event (.ics), Google Maps Location, and App Store Smart Links (iOS vs. Android auto-detection).
- **Deep Visual Styling**:
  - Custom foreground and background colors with transparent background toggle.
  - 6 QR pattern styles: Smooth Rounded, Circular Dots, Classy Diamond, Classy Rounded, Classic Square, Extra Bubble.
  - Custom corner eye styles: Rounded, Circular, Square.
  - Brand logo upload with auto-resizing and center watermark positioning.
  - Call-To-Action (CTA) frames: "SCAN ME" bottom banner, top banner, header badge, callout ribbon, card border, promo ticket.
  - Adjustable Reed-Solomon Error Correction (Level L, M, Q, H - up to 30% error recovery).
- **Scannability Health Check Engine**: Live contrast ratio evaluation ($\ge 4.5:1$ standard) with instant warnings against low contrast or oversized logos before printing.
- **Print-Ready Vector Exports**:
  - **PNG** (1x Web, 2x Retina, 4x 300-DPI Print).
  - **SVG** (Scalable pure vector).
  - **PDF** (Centered vector A4 print document).
  - **JPEG** (Web image).

### 2. Dynamic Redirect Engine (`/r/[code]`)
- Codes encode a short redirect URL (`/r/[code]`).
- Change destination URLs at any time without reprinting physical flyers or posters.
- Captures device type (Mobile, Desktop, Tablet), OS (iOS, Android, macOS, Windows), Browser, Referrer, and IP-based country/city without slow external API calls.

### 3. Campaign Dashboard & Real-Time Analytics
- Dashboard with search, tag filtering, active/deactivated toggles, and direct destination URL editing.
- Deep analytics page with metrics: Total Scans, Unique Visitors, Mobile %, Top Cities/Countries.
- Live incoming scan ticker feed.
- One-click "Simulate Live Scan" button to test real-world scanner events.

### 4. Template Gallery
- One-click presets for Bistro & Cafe Menus, Executive vCards, Guest Wi-Fi, Creator Bio Links, and Retail 20% Discount coupons.

### 5. Bulk QR Generator (CSV)
- Generate hundreds of product/catalog QR codes at once from a `.csv` spreadsheet processed 100% in the user's browser.

### 6. In-App Browser Camera Scanner
- Scan any QR code directly from the web browser using the device camera or by uploading an image.
- Keeps a private local scan history.

---

## 🛠️ Tech Stack & Free-Tier Architecture

| Layer | Technology | Free Tier Notes |
| :--- | :--- | :--- |
| **Frontend & API** | Next.js 14 (App Router) + React 18 | Hosted on Vercel Free Tier |
| **Styling** | Tailwind CSS + Lucide Icons | Zero runtime overhead |
| **QR Engine** | `qr-code-styling` + Custom Canvas & SVG Composite | 100% Client-Side Compute |
| **Exports** | `jspdf` + Canvas to Blob | Browser-native vector generation |
| **Database** | PostgreSQL (Supabase or Neon) | Free Tier (500MB DB, 60 connections) |
| **Redirect & Geo** | Vercel Edge Headers (`x-vercel-ip-country`) | $0, 0ms latency, no third-party rate limits |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
npm run start
```

---

## 🗄️ Database Setup (Supabase)

To connect Supabase PostgreSQL:
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run the DDL schema provided in `lib/supabase/schema.sql` (or `implementation_plan.md`).
3. Add your Supabase credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

*(Note: RealQR Studio is built with a resilient local-storage fallback, so you can explore, generate, test dynamic codes, and simulate analytics out of the box even without entering Supabase credentials!)*

---

## 📄 License
MIT License. Open-source and free forever.
