export type ContentType =
  | "url"
  | "text"
  | "vcard"
  | "wifi"
  | "email"
  | "sms"
  | "phone"
  | "whatsapp"
  | "social"
  | "payment"
  | "location"
  | "event"
  | "app_smart_link";

export type DotShape =
  | "square"
  | "dots"
  | "rounded"
  | "classy"
  | "classy-rounded"
  | "extra-rounded";

export type CornerSquareShape = "square" | "dot" | "extra-rounded";
export type CornerDotShape = "square" | "dot";
export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export type FrameStyle = "none" | string;

export interface GradientColor {
  type: "linear" | "radial";
  rotation: number;
  colorStops: { offset: number; color: string }[];
}

export interface QRSlot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface QRDesignConfig {
  dotsStyle: DotShape;
  dotsColor: string;
  dotsColorType: "single" | "gradient";
  dotsGradient?: GradientColor;
  bgColor: string;
  bgTransparent: boolean;
  cornersSquareStyle: CornerSquareShape;
  cornersSquareColor: string;
  cornersDotStyle: CornerDotShape;
  cornersDotColor: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  logoUrl: string | null;
  logoSize: number; // 0.1 to 0.35
  logoMargin: number;
  frameStyle: FrameStyle;
  frameText: string;
  frameColor: string;
  frameTextColor: string;
  frameQrSlot?: QRSlot;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization: string;
  jobTitle: string;
  phone: string;
  email: string;
  website: string;
  street: string;
  city: string;
  country: string;
}

export interface WifiData {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

export interface WhatsAppData {
  phone: string;
  message: string;
}

export interface SocialLinksData {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  github?: string;
  website?: string;
}

export interface PaymentData {
  type: "upi" | "paypal";
  upiId?: string;
  payeeName?: string;
  amount?: string;
  currency?: string;
  paypalUser?: string;
}

export interface LocationData {
  latitude: string;
  longitude: string;
  query: string;
}

export interface EventData {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface AppSmartLinkData {
  iosUrl: string;
  androidUrl: string;
  fallbackUrl: string;
}

export interface ContentPayload {
  type: ContentType;
  url?: string;
  text?: string;
  vcard?: VCardData;
  wifi?: WifiData;
  email?: EmailData;
  sms?: SmsData;
  phone?: string;
  whatsapp?: WhatsAppData;
  social?: SocialLinksData;
  payment?: PaymentData;
  location?: LocationData;
  event?: EventData;
  appSmartLink?: AppSmartLinkData;
}

export interface QRCodeRecord {
  id: string;
  title: string;
  qrType: "static" | "dynamic";
  contentType: ContentType;
  rawPayload: string;
  shortCode?: string;
  destinationUrl?: string;
  contentData: ContentPayload;
  design: QRDesignConfig;
  createdAt: string;
  scanCount: number;
  isActive: boolean;
  expiresAt?: string;
  maxScans?: number;
  folder?: string;
  tags?: string[];
}

export interface ScanEvent {
  id: string;
  qrCodeId: string;
  scannedAt: string;
  country: string;
  city: string;
  deviceType: string;
  os: string;
  browser: string;
  referrer: string;
}
