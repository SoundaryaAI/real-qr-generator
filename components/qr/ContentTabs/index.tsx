"use client";

import React from "react";
import { ContentPayload, ContentType } from "@/types/qr";
import { Input } from "@/components/ui";
import {
  Link as LinkIcon,
  FileText,
  Contact,
  Wifi,
  Mail,
  MessageSquare,
  Phone,
  Share2,
  CreditCard,
  MapPin,
  Calendar,
  Smartphone,
} from "lucide-react";

export const CONTENT_TYPE_CONFIG: {
  type: ContentType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  { type: "url", label: "Website URL", icon: LinkIcon, description: "Link to any website or page" },
  { type: "vcard", label: "vCard Contact", icon: Contact, description: "Digital business card" },
  { type: "wifi", label: "Wi-Fi Access", icon: Wifi, description: "Connect to Wi-Fi without typing password" },
  { type: "social", label: "Social Links", icon: Share2, description: "Multi-link profile for bio" },
  { type: "payment", label: "UPI / PayPal", icon: CreditCard, description: "Instant payment link (UPI / PayPal)" },
  { type: "email", label: "Send Email", icon: Mail, description: "Pre-filled email recipient & subject" },
  { type: "sms", label: "Send SMS", icon: MessageSquare, description: "Text message trigger" },
  { type: "phone", label: "Phone Call", icon: Phone, description: "Direct telephone dialer" },
  { type: "text", label: "Plain Text", icon: FileText, description: "Any plain text or message" },
  { type: "event", label: "Event / iCal", icon: Calendar, description: "Add event to calendar" },
  { type: "location", label: "Google Maps", icon: MapPin, description: "Location pin or address" },
  { type: "app_smart_link", label: "App Store Link", icon: Smartphone, description: "Auto-detects iOS vs. Android" },
];

interface FormProps {
  data: ContentPayload;
  onChange: (updated: ContentPayload) => void;
}

export function ContentFormManager({ data, onChange }: FormProps) {
  switch (data.type) {
    case "url":
      return (
        <div className="space-y-4">
          <Input
            label="Target Website URL"
            type="url"
            placeholder="https://yourcompany.com/landing"
            value={data.url || ""}
            onChange={(e) => onChange({ ...data, url: e.target.value })}
            helperText="Enter a full URL including https://. This is what opens when scanned."
          />
        </div>
      );

    case "vcard": {
      const v = data.vcard || {
        firstName: "",
        lastName: "",
        organization: "",
        jobTitle: "",
        phone: "",
        email: "",
        website: "",
        street: "",
        city: "",
        country: "",
      };
      const updateV = (field: string, val: string) => {
        onChange({ ...data, vcard: { ...v, [field]: val } });
      };
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="First Name"
            placeholder="John"
            value={v.firstName}
            onChange={(e) => updateV("firstName", e.target.value)}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            value={v.lastName}
            onChange={(e) => updateV("lastName", e.target.value)}
          />
          <Input
            label="Organization / Company"
            placeholder="Acme Global Inc"
            value={v.organization}
            onChange={(e) => updateV("organization", e.target.value)}
          />
          <Input
            label="Job Title"
            placeholder="Lead Product Engineer"
            value={v.jobTitle}
            onChange={(e) => updateV("jobTitle", e.target.value)}
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 019-2834"
            value={v.phone}
            onChange={(e) => updateV("phone", e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={v.email}
            onChange={(e) => updateV("email", e.target.value)}
          />
          <div className="sm:col-span-2">
            <Input
              label="Website"
              placeholder="https://example.com"
              value={v.website}
              onChange={(e) => updateV("website", e.target.value)}
            />
          </div>
          <Input
            label="City"
            placeholder="San Francisco"
            value={v.city}
            onChange={(e) => updateV("city", e.target.value)}
          />
          <Input
            label="Country"
            placeholder="United States"
            value={v.country}
            onChange={(e) => updateV("country", e.target.value)}
          />
        </div>
      );
    }

    case "wifi": {
      const w = data.wifi || { ssid: "", password: "", encryption: "WPA", hidden: false };
      const updateW = (patch: Partial<typeof w>) => {
        onChange({ ...data, wifi: { ...w, ...patch } });
      };
      return (
        <div className="space-y-4">
          <Input
            label="Network Name (SSID)"
            placeholder="Office_Guest_5G"
            value={w.ssid}
            onChange={(e) => updateW({ ssid: e.target.value })}
            helperText="The exact Wi-Fi network name broadcasted by your router."
          />
          <Input
            label="Network Password"
            type="text"
            placeholder="Wi-Fi Security Key"
            value={w.password}
            onChange={(e) => updateW({ password: e.target.value })}
            helperText="Leave empty if your network has no password."
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Encryption Type
              </label>
              <select
                className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                value={w.encryption}
                onChange={(e) => updateW({ encryption: e.target.value as any })}
              >
                <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                <option value="WEP">WEP (Older)</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={w.hidden}
                  onChange={(e) => updateW({ hidden: e.target.checked })}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                Hidden Network
              </label>
            </div>
          </div>
        </div>
      );
    }

    case "social": {
      const s = data.social || {};
      const updateS = (key: string, val: string) => {
        onChange({ ...data, social: { ...s, [key]: val } });
      };
      return (
        <div className="space-y-3">
          <Input
            label="Instagram Profile"
            placeholder="https://instagram.com/username"
            value={s.instagram || ""}
            onChange={(e) => updateS("instagram", e.target.value)}
          />
          <Input
            label="YouTube Channel"
            placeholder="https://youtube.com/@channel"
            value={s.youtube || ""}
            onChange={(e) => updateS("youtube", e.target.value)}
          />
          <Input
            label="X / Twitter"
            placeholder="https://x.com/username"
            value={s.twitter || ""}
            onChange={(e) => updateS("twitter", e.target.value)}
          />
          <Input
            label="LinkedIn"
            placeholder="https://linkedin.com/in/username"
            value={s.linkedin || ""}
            onChange={(e) => updateS("linkedin", e.target.value)}
          />
          <Input
            label="GitHub"
            placeholder="https://github.com/username"
            value={s.github || ""}
            onChange={(e) => updateS("github", e.target.value)}
          />
        </div>
      );
    }

    case "payment": {
      const p = data.payment || { type: "upi", upiId: "", payeeName: "", amount: "", currency: "INR" };
      const updateP = (patch: Partial<typeof p>) => {
        onChange({ ...data, payment: { ...p, ...patch } });
      };
      return (
        <div className="space-y-4">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              type="button"
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                p.type === "upi" ? "bg-white dark:bg-slate-900 shadow-sm text-brand-600" : "text-slate-600 dark:text-slate-400"
              }`}
              onClick={() => updateP({ type: "upi" })}
            >
              UPI (GPay / PhonePe / Paytm)
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                p.type === "paypal" ? "bg-white dark:bg-slate-900 shadow-sm text-brand-600" : "text-slate-600 dark:text-slate-400"
              }`}
              onClick={() => updateP({ type: "paypal" })}
            >
              PayPal.me Link
            </button>
          </div>

          {p.type === "upi" ? (
            <div className="space-y-3">
              <Input
                label="UPI Virtual Payment Address (VPA)"
                placeholder="merchant@okhdfcbank"
                value={p.upiId || ""}
                onChange={(e) => updateP({ upiId: e.target.value })}
                helperText="Enter your valid UPI ID (e.g. name@upi)"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Payee Name"
                  placeholder="Acme Stores"
                  value={p.payeeName || ""}
                  onChange={(e) => updateP({ payeeName: e.target.value })}
                />
                <Input
                  label="Pre-set Amount (Optional)"
                  type="number"
                  placeholder="500"
                  value={p.amount || ""}
                  onChange={(e) => updateP({ amount: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                label="PayPal Username"
                placeholder="yourusername"
                value={p.paypalUser || ""}
                onChange={(e) => updateP({ paypalUser: e.target.value })}
                helperText="Generates https://paypal.me/yourusername"
              />
              <Input
                label="Amount (Optional)"
                type="number"
                placeholder="25"
                value={p.amount || ""}
                onChange={(e) => updateP({ amount: e.target.value })}
              />
            </div>
          )}
        </div>
      );
    }

    case "email": {
      const e = data.email || { email: "", subject: "", body: "" };
      const updateE = (patch: Partial<typeof e>) => {
        onChange({ ...data, email: { ...e, ...patch } });
      };
      return (
        <div className="space-y-3">
          <Input
            label="Recipient Email"
            type="email"
            placeholder="support@company.com"
            value={e.email}
            onChange={(evt) => updateE({ email: evt.target.value })}
          />
          <Input
            label="Subject Line"
            placeholder="Inquiry about product..."
            value={e.subject}
            onChange={(evt) => updateE({ subject: evt.target.value })}
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Message Body (Optional)
            </label>
            <textarea
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
              rows={3}
              placeholder="Write pre-filled message text here..."
              value={e.body}
              onChange={(evt) => updateE({ body: evt.target.value })}
            />
          </div>
        </div>
      );
    }

    case "sms": {
      const s = data.sms || { phone: "", message: "" };
      return (
        <div className="space-y-3">
          <Input
            label="Recipient Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={s.phone}
            onChange={(e) => onChange({ ...data, sms: { ...s, phone: e.target.value } })}
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Pre-filled Text Message
            </label>
            <textarea
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
              rows={3}
              placeholder="Hi, I would like more information..."
              value={s.message}
              onChange={(e) => onChange({ ...data, sms: { ...s, message: e.target.value } })}
            />
          </div>
        </div>
      );
    }

    case "phone":
      return (
        <Input
          label="Phone Number to Dial"
          type="tel"
          placeholder="+1 (555) 987-6543"
          value={data.phone || ""}
          onChange={(e) => onChange({ ...data, phone: e.target.value })}
          helperText="When scanned on mobile, immediately prompts to call this number."
        />
      );

    case "text":
      return (
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Plain Text Content
          </label>
          <textarea
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            rows={4}
            placeholder="Type any text message, coupon code, or instructions..."
            value={data.text || ""}
            onChange={(e) => onChange({ ...data, text: e.target.value })}
          />
        </div>
      );

    case "event": {
      const ev = data.event || {
        title: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
      };
      const updateEv = (patch: Partial<typeof ev>) => {
        onChange({ ...data, event: { ...ev, ...patch } });
      };
      return (
        <div className="space-y-3">
          <Input
            label="Event Title"
            placeholder="Annual Product Launch 2026"
            value={ev.title}
            onChange={(e) => updateEv({ title: e.target.value })}
          />
          <Input
            label="Location / Venue"
            placeholder="Moscone Center, SF or Zoom Link"
            value={ev.location}
            onChange={(e) => updateEv({ location: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date & Time"
              type="datetime-local"
              value={ev.startDate}
              onChange={(e) => updateEv({ startDate: e.target.value })}
            />
            <Input
              label="End Date & Time"
              type="datetime-local"
              value={ev.endDate}
              onChange={(e) => updateEv({ endDate: e.target.value })}
            />
          </div>
        </div>
      );
    }

    case "location": {
      const loc = data.location || { latitude: "", longitude: "", query: "" };
      return (
        <div className="space-y-3">
          <Input
            label="Search Address or Venue Name"
            placeholder="Times Square, New York, NY"
            value={loc.query}
            onChange={(e) => onChange({ ...data, location: { ...loc, query: e.target.value } })}
            helperText="Address or place name searched directly on Google Maps."
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Latitude (Optional)"
              placeholder="37.7749"
              value={loc.latitude}
              onChange={(e) => onChange({ ...data, location: { ...loc, latitude: e.target.value } })}
            />
            <Input
              label="Longitude (Optional)"
              placeholder="-122.4194"
              value={loc.longitude}
              onChange={(e) => onChange({ ...data, location: { ...loc, longitude: e.target.value } })}
            />
          </div>
        </div>
      );
    }

    case "app_smart_link": {
      const app = data.appSmartLink || { iosUrl: "", androidUrl: "", fallbackUrl: "" };
      const updateApp = (patch: Partial<typeof app>) => {
        onChange({ ...data, appSmartLink: { ...app, ...patch } });
      };
      return (
        <div className="space-y-3">
          <Input
            label="iOS App Store Link"
            placeholder="https://apps.apple.com/app/id123456789"
            value={app.iosUrl}
            onChange={(e) => updateApp({ iosUrl: e.target.value })}
          />
          <Input
            label="Android Google Play Link"
            placeholder="https://play.google.com/store/apps/details?id=com.example.app"
            value={app.androidUrl}
            onChange={(e) => updateApp({ androidUrl: e.target.value })}
          />
          <Input
            label="Fallback URL (Desktop / Web)"
            placeholder="https://company.com/download"
            value={app.fallbackUrl}
            onChange={(e) => updateApp({ fallbackUrl: e.target.value })}
            helperText="Destination if scanned on Mac/PC or unmapped device."
          />
        </div>
      );
    }

    default:
      return null;
  }
}
