/**
 * Calculates scannability health score and WCAG contrast ratio for QR code customization.
 * Ensures custom colors, dot shapes, and logos do not break real-world phone scanners.
 */

function getLuminance(hex: string): number {
  const cleanHex = hex.replace("#", "");
  // Support 3-character hex
  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = parseInt(fullHex.substring(0, 2), 16) / 255;
  const g = parseInt(fullHex.substring(2, 4), 16) / 255;
  const b = parseInt(fullHex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function calculateContrastRatio(fgHex: string, bgHex: string): number {
  try {
    const l1 = getLuminance(fgHex);
    const l2 = getLuminance(bgHex);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 21; // Default safe fallback
  }
}

export interface HealthCheckResult {
  score: number; // 0 to 100
  status: "excellent" | "good" | "warning" | "critical";
  contrastRatio: number;
  warnings: string[];
  tips: string[];
}

export function evaluateQrHealth(config: {
  fgColor: string;
  bgColor: string;
  ecLevel: "L" | "M" | "Q" | "H";
  hasLogo: boolean;
  logoSizePercent: number;
  contentLength: number;
}): HealthCheckResult {
  const warnings: string[] = [];
  const tips: string[] = [];
  let score = 100;

  // 1. Contrast Check
  const contrast = calculateContrastRatio(config.fgColor, config.bgColor);
  if (contrast < 3.0) {
    score -= 45;
    warnings.push("Extremely low contrast! Most smartphone cameras will fail to scan this code.");
  } else if (contrast < 4.5) {
    score -= 20;
    warnings.push("Suboptimal contrast. Scan speed will be slow under dim lighting.");
  } else {
    tips.push("High contrast ensures fast scan recognition.");
  }

  // 2. Inverted QR Check (Light QR on dark background)
  try {
    const fgLum = getLuminance(config.fgColor);
    const bgLum = getLuminance(config.bgColor);
    if (fgLum > bgLum) {
      score -= 15;
      warnings.push("Inverted colors (light QR on dark background) may fail on native camera apps.");
    }
  } catch {
    // Ignore calculation error
  }

  // 3. Logo Redundancy & Error Correction Level
  if (config.hasLogo) {
    if (config.ecLevel === "L" || config.ecLevel === "M") {
      score -= 25;
      warnings.push("Logo embedded with low error correction (L/M). Switch to Level H (High 30%) to prevent scan failure.");
    } else {
      tips.push("Level H error correction protects data against logo occlusion.");
    }

    if (config.logoSizePercent > 30) {
      score -= 25;
      warnings.push("Logo size exceeds 30% of QR surface area. Reed-Solomon redundancy threshold exceeded.");
    }
  }

  // 4. Content Density Check for Static QR
  if (config.contentLength > 250) {
    score -= 15;
    warnings.push("Heavy payload detected (>250 chars). Dense micro-modules may blur on small prints.");
    tips.push("Switching to a Dynamic QR short link reduces module density by up to 70%.");
  }

  score = Math.max(0, Math.min(100, score));

  let status: HealthCheckResult["status"] = "excellent";
  if (score < 45) status = "critical";
  else if (score < 70) status = "warning";
  else if (score < 90) status = "good";

  return {
    score,
    status,
    contrastRatio: parseFloat(contrast.toFixed(2)),
    warnings,
    tips,
  };
}
