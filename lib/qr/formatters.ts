import { ContentPayload } from "@/types/qr";

/**
 * Encodes structured user inputs into industry-standard QR payload strings.
 * For example: vCard 3.0, Wi-Fi standard (WIFI:T:WPA;S:...), tel:, mailto:, geo:, etc.
 */

export function formatPayload(content: ContentPayload): string {
  switch (content.type) {
    case "url": {
      const url = content.url?.trim() || "https://example.com";
      if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
      }
      return url;
    }

    case "text":
      return content.text?.trim() || "Hello, World!";

    case "vcard": {
      const v = content.vcard;
      if (!v) return "BEGIN:VCARD\nVERSION:3.0\nFN:Contact\nEND:VCARD";
      const fullName = `${v.firstName} ${v.lastName}`.trim() || "Contact";
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${v.lastName || ""};${v.firstName || ""};;;`,
        `FN:${fullName}`,
      ];
      if (v.organization) lines.push(`ORG:${v.organization}`);
      if (v.jobTitle) lines.push(`TITLE:${v.jobTitle}`);
      if (v.phone) lines.push(`TEL;TYPE=CELL:${v.phone}`);
      if (v.email) lines.push(`EMAIL:${v.email}`);
      if (v.website) lines.push(`URL:${v.website}`);
      if (v.street || v.city || v.country) {
        lines.push(`ADR;TYPE=WORK:;;${v.street || ""};${v.city || ""};;;${v.country || ""}`);
      }
      lines.push("END:VCARD");
      return lines.join("\n");
    }

    case "wifi": {
      const w = content.wifi;
      if (!w || !w.ssid) return "WIFI:S:MyWifi;T:WPA;P:password;;";
      const enc = w.encryption || "WPA";
      const pass = enc === "nopass" ? "" : w.password || "";
      const hidden = w.hidden ? "true" : "false";
      return `WIFI:T:${enc};S:${escapeWifiString(w.ssid)};P:${escapeWifiString(pass)};H:${hidden};;`;
    }

    case "email": {
      const e = content.email;
      if (!e) return "mailto:hello@example.com";
      const params = new URLSearchParams();
      if (e.subject) params.set("subject", e.subject);
      if (e.body) params.set("body", e.body);
      const query = params.toString();
      return `mailto:${e.email}${query ? `?${query}` : ""}`;
    }

    case "sms": {
      const s = content.sms;
      if (!s) return "sms:+10000000000";
      const bodyParam = s.message ? `?body=${encodeURIComponent(s.message)}` : "";
      return `sms:${s.phone}${bodyParam}`;
    }

    case "phone":
      return `tel:${content.phone?.trim() || "+10000000000"}`;

    case "whatsapp": {
      const wa = content.whatsapp;
      if (!wa) return "https://wa.me/10000000000";
      const cleanPhone = wa.phone.replace(/[^0-9]/g, "");
      const msgParam = wa.message ? `?text=${encodeURIComponent(wa.message)}` : "";
      return `https://wa.me/${cleanPhone}${msgParam}`;
    }

    case "social": {
      const s = content.social;
      if (!s) return "https://instagram.com";
      // Pick first non-empty link or website
      return (
        s.instagram ||
        s.twitter ||
        s.linkedin ||
        s.youtube ||
        s.github ||
        s.website ||
        "https://example.com"
      );
    }

    case "payment": {
      const p = content.payment;
      if (!p) return "https://paypal.me";
      if (p.type === "upi" && p.upiId) {
        const params = new URLSearchParams();
        params.set("pa", p.upiId);
        if (p.payeeName) params.set("pn", p.payeeName);
        if (p.amount) params.set("am", p.amount);
        params.set("cu", p.currency || "INR");
        return `upi://pay?${params.toString()}`;
      } else if (p.paypalUser) {
        const amt = p.amount ? `/${p.amount}` : "";
        return `https://paypal.me/${p.paypalUser.replace(/^@/, "")}${amt}`;
      }
      return "https://paypal.me";
    }

    case "location": {
      const loc = content.location;
      if (!loc) return "https://maps.google.com";
      if (loc.latitude && loc.longitude) {
        return `https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`;
      }
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.query || "Times Square")}`;
    }

    case "event": {
      const ev = content.event;
      if (!ev) return "BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR";
      const fmtDate = (dStr: string) => {
        if (!dStr) return "20260903T100000Z";
        return new Date(dStr).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      };
      return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `SUMMARY:${ev.title || "Calendar Event"}`,
        `DESCRIPTION:${ev.description || ""}`,
        `LOCATION:${ev.location || ""}`,
        `DTSTART:${fmtDate(ev.startDate)}`,
        `DTEND:${fmtDate(ev.endDate)}`,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\n");
    }

    case "app_smart_link": {
      const smart = content.appSmartLink;
      return smart?.fallbackUrl || smart?.iosUrl || smart?.androidUrl || "https://example.com";
    }

    default:
      return "https://example.com";
  }
}

function escapeWifiString(str: string): string {
  return str.replace(/([\\;,:"])/g, "\\$1");
}
