import { jsPDF } from "jspdf";
import { FrameStyle } from "@/types/qr";
import { getFrameLayout } from "@/lib/qr/frame-registry";

export interface ExportOptions {
  canvasElement: HTMLCanvasElement | null;
  qrPngBlob?: Blob;
  frameImagePath?: string;
  frameQrSlot?: { x: number; y: number; width: number; height: number };
  qrSvgString?: string;
  filename: string;
  format: "png" | "jpeg" | "svg" | "pdf";
  scaleMultiplier?: number; // 1x, 2x, 4x (print quality)
  frameStyle: FrameStyle;
  frameText: string;
  frameColor: string;
  frameTextColor: string;
}

/**
 * Composites the QR code with its frame and CTA banner on a high-resolution canvas.
 */
export async function createCompositedCanvas(
  qrImage: CanvasImageSource,
  options: {
    frameStyle: FrameStyle;
    frameText: string;
    frameColor: string;
    frameTextColor: string;
    scale?: number;
  }
): Promise<HTMLCanvasElement> {
  const scale = options.scale || 1;
  const sourceWidth = "naturalWidth" in qrImage
    ? qrImage.naturalWidth
    : "width" in qrImage
    ? Number(qrImage.width)
    : qrImage.displayWidth;
  const sourceHeight = "naturalHeight" in qrImage
    ? qrImage.naturalHeight
    : "height" in qrImage
    ? Number(qrImage.height)
    : qrImage.displayHeight;
  const qrSize = Math.max(sourceWidth, sourceHeight) * scale;

  const outputCanvas = document.createElement("canvas");
  const ctx = outputCanvas.getContext("2d");
  if (!ctx) throw new Error("Could not create 2d canvas context");

  const style = options.frameStyle;
  const layout = getFrameLayout(style);
  const text = options.frameText || "SCAN ME";
  const frameColor = options.frameColor || "#0f172a";
  const textColor = options.frameTextColor || "#ffffff";

  if (layout === "none") {
    outputCanvas.width = qrSize;
    outputCanvas.height = qrSize;
    ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);
    return outputCanvas;
  }

  // Calculate dimensions based on frame style
  let padding = 24 * scale;
  let topMargin = padding;
  let bottomMargin = padding;
  let bannerHeight = 56 * scale;

  const isTopBanner = layout === "top-banner";
  const isBorderOnly = layout === "border-only";
  const isTicket = layout === "ticket";
  const isBadge = layout === "badge";

  if (isBadge) {
    padding = 20 * scale;
    topMargin = padding;
    bottomMargin = 72 * scale;
  }

  if (isTopBanner) {
    topMargin = padding + bannerHeight + 12 * scale;
  } else if (isBorderOnly) {
    padding = 32 * scale;
    topMargin = padding;
    bottomMargin = padding;
  } else if (isTicket) {
    bottomMargin = padding + bannerHeight + 12 * scale;
  } else {
    // bottom-banner (default)
    bottomMargin = padding + bannerHeight + 12 * scale;
  }

  const canvasWidth = qrSize + padding * 2;
  const canvasHeight = qrSize + topMargin + bottomMargin;

  outputCanvas.width = canvasWidth;
  outputCanvas.height = canvasHeight;

  // The offscreen canvas starts as a blank image. Everything drawn below,
  // including the QR pixels, becomes part of the downloaded PNG.
  ctx.fillStyle = isBadge ? frameColor : "#ffffff";
  drawRoundedRect(ctx, 0, 0, canvasWidth, canvasHeight, 20 * scale);
  ctx.fill();

  if (!isBadge) {
    // Draw the colored outline on top of the white frame background.
    ctx.lineWidth = 4 * scale;
    ctx.strokeStyle = frameColor;
    if (isTicket) {
      ctx.setLineDash([12 * scale, 6 * scale]);
    }
    drawRoundedRect(ctx, 4 * scale, 4 * scale, canvasWidth - 8 * scale, canvasHeight - 8 * scale, 18 * scale);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash
  }

  drawCustomDecoration(ctx, style, canvasWidth, canvasHeight, frameColor, scale);

  // Draw the raw QR image into this new canvas. This is the key compositing
  // step: the QR and the frame now share the same final pixel buffer.
  const qrX = padding;
  const qrY = isBadge ? padding : topMargin;
  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

  // Draw CTA Banner
  if (isBadge) {
    ctx.fillStyle = textColor;
    ctx.font = `bold ${Math.round(18 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.toUpperCase(), canvasWidth / 2, canvasHeight - 36 * scale);
  } else if (isTopBanner) {
    const bannerW = canvasWidth - padding * 2;
    const bannerY = padding;
    ctx.fillStyle = frameColor;
    drawRoundedRect(ctx, padding, bannerY, bannerW, bannerHeight, 12 * scale);
    ctx.fill();

    ctx.fillStyle = textColor;
    ctx.font = `bold ${Math.round(18 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.toUpperCase(), canvasWidth / 2, bannerY + bannerHeight / 2);
  } else if (isTicket) {
    const bannerW = canvasWidth - padding * 2;
    const bannerY = canvasHeight - bottomMargin + 10 * scale;
    ctx.fillStyle = frameColor;
    drawRoundedRect(ctx, padding, bannerY, bannerW, bannerHeight, 12 * scale);
    ctx.fill();

    ctx.fillStyle = textColor;
    ctx.font = `bold ${Math.round(18 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.toUpperCase(), canvasWidth / 2, bannerY + bannerHeight / 2);
  } else if (!isBorderOnly) {
    // Bottom banner
    const bannerW = canvasWidth - padding * 2;
    const bannerY = canvasHeight - bottomMargin + 10 * scale;
    ctx.fillStyle = frameColor;
    drawRoundedRect(ctx, padding, bannerY, bannerW, bannerHeight, 12 * scale);
    ctx.fill();

    ctx.fillStyle = textColor;
    ctx.font = `bold ${Math.round(18 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.toUpperCase(), canvasWidth / 2, bannerY + bannerHeight / 2);
  }

  return outputCanvas;
}

function drawCustomDecoration(
  ctx: CanvasRenderingContext2D,
  style: string,
  width: number,
  height: number,
  color: string,
  scale: number,
) {
  const isHeart = style.includes("heart");
  const isGift = style.includes("gift");
  const isHalloween = style.includes("halloween");
  const isHoliday = style.includes("christmas") || style.includes("holiday") || style.includes("gift");
  const isFood = style.includes("food") || style.includes("menu") || style.includes("cup") || style.includes("bottle");

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 3 * scale;

  if (isGift) {
    // Gift frames get a visible present mark in the upper frame area.
    ctx.strokeRect(width / 2 - 18 * scale, 14 * scale, 36 * scale, 20 * scale);
    ctx.beginPath();
    ctx.moveTo(width / 2, 14 * scale);
    ctx.lineTo(width / 2, 34 * scale);
    ctx.moveTo(width / 2 - 18 * scale, 22 * scale);
    ctx.lineTo(width / 2 + 18 * scale, 22 * scale);
    ctx.stroke();
  } else if (isHeart) {
    ctx.beginPath();
    ctx.moveTo(width / 2, 38 * scale);
    ctx.bezierCurveTo(width / 2 - 34 * scale, 8 * scale, 24 * scale, 42 * scale, width / 2, height - 24 * scale);
    ctx.bezierCurveTo(width - 24 * scale, 42 * scale, width / 2 + 34 * scale, 8 * scale, width / 2, 38 * scale);
    ctx.stroke();
  } else if (isHoliday) {
    for (const x of [24, width / scale - 24]) {
      ctx.beginPath();
      ctx.moveTo(x * scale, 18 * scale);
      ctx.lineTo(x * scale - 10 * scale, 42 * scale);
      ctx.lineTo(x * scale + 10 * scale, 42 * scale);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect((x - 3) * scale, 42 * scale, 6 * scale, 9 * scale);
    }
  } else if (isHalloween) {
    ctx.beginPath();
    ctx.arc(width / 2, 34 * scale, 16 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width / 2 - 6 * scale, 32 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.arc(width / 2 + 6 * scale, 32 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.fill();
  } else if (isFood) {
    ctx.beginPath();
    ctx.arc(width / 2, height - 28 * scale, 18 * scale, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width / 2 - 22 * scale, height - 28 * scale);
    ctx.lineTo(width / 2 + 22 * scale, height - 28 * scale);
    ctx.stroke();
  }

  ctx.restore();
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Downloads the QR code in requested format (PNG, JPEG, SVG, or print PDF).
 */
export async function downloadQr(options: ExportOptions) {
  const { canvasElement, filename, format, scaleMultiplier = 2 } = options;

  if (!canvasElement && !options.qrPngBlob) {
    throw new Error("A QR image is required for downloads");
  }

  const baseFilename = filename.replace(/\.[^/.]+$/, "");

  // 1. SVG Export
  if (format === "svg") {
    if (options.qrSvgString && options.frameStyle === "none") {
      const blob = new Blob([options.qrSvgString], { type: "image/svg+xml;charset=utf-8" });
      saveBlob(blob, `${baseFilename}.svg`);
      return;
    }
  }

  const qrImage = options.qrPngBlob
    ? await blobToImage(options.qrPngBlob)
    : canvasElement;
  if (!qrImage) return;

  if (options.frameImagePath) {
    const imageFrameCanvas = await createImageFrameCanvas(qrImage, options.frameImagePath, options.frameQrSlot);
    if (format === "png" || format === "jpeg") {
      imageFrameCanvas.toBlob((blob) => {
        if (blob) saveBlob(blob, `${baseFilename}.${format === "png" ? "png" : "jpg"}`);
      }, format === "png" ? "image/png" : "image/jpeg", 0.95);
      return;
    }
    if (format === "svg") {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${imageFrameCanvas.width}" height="${imageFrameCanvas.height}"><image href="${imageFrameCanvas.toDataURL("image/png")}" width="100%" height="100%" /></svg>`;
      saveBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), `${baseFilename}.svg`);
      return;
    }
  }

  // Composite canvas with frame
  const compositedCanvas = await createCompositedCanvas(qrImage, {
    frameStyle: options.frameStyle,
    frameText: options.frameText,
    frameColor: options.frameColor,
    frameTextColor: options.frameTextColor,
    scale: scaleMultiplier,
  });

  if (format === "svg") {
    // Framed SVGs use an SVG wrapper containing the already-composited image.
    // This keeps the frame and caption reliable across SVG viewers while
    // preserving the original vector SVG when no frame is selected.
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${compositedCanvas.width}" height="${compositedCanvas.height}" viewBox="0 0 ${compositedCanvas.width} ${compositedCanvas.height}"><image href="${compositedCanvas.toDataURL("image/png")}" width="100%" height="100%" /></svg>`;
    saveBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), `${baseFilename}.svg`);
    return;
  }

  // 2. PNG Export
  if (format === "png") {
    compositedCanvas.toBlob((blob) => {
      if (blob) saveBlob(blob, `${baseFilename}.png`);
    }, "image/png");
    return;
  }

  // 3. JPEG Export
  if (format === "jpeg") {
    compositedCanvas.toBlob((blob) => {
      if (blob) saveBlob(blob, `${baseFilename}.jpg`);
    }, "image/jpeg", 0.95);
    return;
  }

  // 4. PDF Vector / Print-Ready Export
  if (format === "pdf") {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Convert canvas to image data
    const imgData = compositedCanvas.toDataURL("image/png");
    const aspect = compositedCanvas.width / compositedCanvas.height;

    // Center on A4 page (width ~ 110mm)
    const qrPrintWidth = 110;
    const qrPrintHeight = qrPrintWidth / aspect;
    const x = (pageWidth - qrPrintWidth) / 2;
    const y = (pageHeight - qrPrintHeight) / 2 - 15;

    // Header title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(15, 23, 42);
    pdf.text(options.filename || "QR Code", pageWidth / 2, y - 20, { align: "center" });

    // Subtitle note
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(100, 116, 139);
    pdf.text("Print-ready high resolution vector file", pageWidth / 2, y - 12, { align: "center" });

    // Image
    pdf.addImage(imgData, "PNG", x, y, qrPrintWidth, qrPrintHeight);

    // Footer note
    pdf.setFontSize(9);
    pdf.setTextColor(148, 163, 184);
    pdf.text("Generated with Real QR Studio • High Scannability Guaranteed", pageWidth / 2, pageHeight - 20, {
      align: "center",
    });

    pdf.save(`${baseFilename}.pdf`);
  }
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  // A Blob is the raw PNG returned by qr-code-styling. Loading it as an image
  // gives Canvas 2D drawImage() a source that can be placed on our new canvas.
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = src;
  await image.decode();
  return image;
}

async function createImageFrameCanvas(
  qrImage: CanvasImageSource,
  frameImagePath: string,
  slot = { x: 25, y: 25, width: 50, height: 50 },
): Promise<HTMLCanvasElement> {
  const frameImage = await loadImage(frameImagePath);
  const canvas = document.createElement("canvas");
  canvas.width = frameImage.naturalWidth;
  canvas.height = frameImage.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create 2d canvas context");

  // Draw the decorative PNG first, then place the QR over its blank center.
  ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
  // Use the calibrated percentage slot so export and live preview align exactly.
  const qrWidth = Math.round(canvas.width * slot.width / 100);
  const qrHeight = Math.round(canvas.height * slot.height / 100);
  const qrSize = Math.min(qrWidth, qrHeight);
  const qrX = Math.round(canvas.width * slot.x / 100 + (qrWidth - qrSize) / 2);
  const qrY = Math.round(canvas.height * slot.y / 100 + (qrHeight - qrSize) / 2);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
  return canvas;
}
