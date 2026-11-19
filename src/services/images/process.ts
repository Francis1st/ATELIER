import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/domain/schema";

export type ProcessedImage = {
  originalBlob: Blob;
  coverBlob: Blob;
  mimeType: string;
  width: number;
  height: number;
  filename: string;
};

function assertImageFile(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    throw new Error("Please use JPG, PNG, or WebP images.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Images must be 8 MB or smaller.");
  }
}

function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this image. Try another file."));
    };
    img.src = url;
  });
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Failed to create image preview."));
        else resolve(blob);
      },
      type,
      quality,
    );
  });
}

export async function processImageFile(file: File): Promise<ProcessedImage> {
  assertImageFile(file);
  const img = await loadImage(file);
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  if (!width || !height) {
    throw new Error("This image has invalid dimensions.");
  }

  const maxEdge = 1200;
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  const coverW = Math.max(1, Math.round(width * scale));
  const coverH = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = coverW;
  canvas.height = coverH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  ctx.drawImage(img, 0, 0, coverW, coverH);

  const coverType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const coverBlob = await canvasToBlob(
    canvas,
    coverType,
    coverType === "image/jpeg" ? 0.82 : 0.92,
  );

  return {
    originalBlob: file,
    coverBlob,
    mimeType: file.type,
    width,
    height,
    filename: file.name || "wardrobe-image.jpg",
  };
}

export function extensionForMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}
