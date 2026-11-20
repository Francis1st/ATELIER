import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/domain/schema";

export type CoverDraftOptions = {
  /** Clockwise rotation applied when building the curated cover. */
  rotate?: 0 | 90 | 180 | 270;
  /** Vertical focal point inside the source (0 = top, 1 = bottom). */
  focalY?: number;
  /** Target aspect for the curated cover. Default 3/4 editorial. */
  aspect?: number;
  /** Longest edge for curated output. */
  maxEdge?: number;
};

export type ProcessedImage = {
  /** Untouched file bytes — archival original. */
  originalBlob: Blob;
  /** Locally framed + compressed display version. */
  curatedBlob: Blob;
  /** @deprecated alias of curatedBlob for older call sites */
  coverBlob: Blob;
  mimeType: string;
  width: number;
  height: number;
  curatedWidth: number;
  curatedHeight: number;
  filename: string;
  focalY: number;
  rotation: 0 | 90 | 180 | 270;
};

function assertImageFile(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    throw new Error("Please use JPG, PNG, or WebP images.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Images must be 8 MB or smaller.");
  }
}

async function loadBitmap(blob: Blob): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(blob, {
      imageOrientation: "from-image",
    } as ImageBitmapOptions);
  } catch {
    // Older engines: fall back without orientation hint.
    return createImageBitmap(blob);
  }
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

function drawOriented(
  ctx: CanvasRenderingContext2D,
  bitmap: ImageBitmap,
  rotate: 0 | 90 | 180 | 270,
) {
  const w = bitmap.width;
  const h = bitmap.height;
  if (rotate === 90) {
    ctx.translate(h, 0);
    ctx.rotate(Math.PI / 2);
  } else if (rotate === 180) {
    ctx.translate(w, h);
    ctx.rotate(Math.PI);
  } else if (rotate === 270) {
    ctx.translate(0, w);
    ctx.rotate(-Math.PI / 2);
  }
  ctx.drawImage(bitmap, 0, 0);
}

function orientedSize(
  width: number,
  height: number,
  rotate: 0 | 90 | 180 | 270,
) {
  return rotate === 90 || rotate === 270
    ? { width: height, height: width }
    : { width, height };
}

/**
 * Build a 3:4 (or custom aspect) curated cover with center-weighted crop.
 * Original file bytes are never modified.
 */
export async function processImageFile(
  file: File,
  options: CoverDraftOptions = {},
): Promise<ProcessedImage> {
  assertImageFile(file);
  const rotate = options.rotate ?? 0;
  const focalY = Math.min(1, Math.max(0, options.focalY ?? 0.45));
  const aspect = options.aspect ?? 3 / 4;
  const maxEdge = options.maxEdge ?? 1400;

  const bitmap = await loadBitmap(file);
  try {
    const oriented = orientedSize(bitmap.width, bitmap.height, rotate);
    if (!oriented.width || !oriented.height) {
      throw new Error("This image has invalid dimensions.");
    }

    // Draw oriented full frame into an offscreen canvas for crop source.
    const source = document.createElement("canvas");
    source.width = oriented.width;
    source.height = oriented.height;
    const sctx = source.getContext("2d");
    if (!sctx) throw new Error("Canvas is not available in this browser.");
    drawOriented(sctx, bitmap, rotate);

    // Cover crop to target aspect using focalY.
    let cropW = oriented.width;
    let cropH = Math.round(cropW / aspect);
    if (cropH > oriented.height) {
      cropH = oriented.height;
      cropW = Math.round(cropH * aspect);
    }
    const sx = Math.max(0, Math.round((oriented.width - cropW) / 2));
    const maxSy = Math.max(0, oriented.height - cropH);
    const sy = Math.round(maxSy * focalY);

    const scale = Math.min(1, maxEdge / Math.max(cropW, cropH));
    const outW = Math.max(1, Math.round(cropW * scale));
    const outH = Math.max(1, Math.round(cropH * scale));

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not available in this browser.");
    // Soft ivory fill behind transparent PNGs so Gallery never shows checkerboard.
    ctx.fillStyle = "#EDE8E0";
    ctx.fillRect(0, 0, outW, outH);
    ctx.drawImage(source, sx, sy, cropW, cropH, 0, 0, outW, outH);

    const coverType = file.type === "image/png" ? "image/png" : "image/jpeg";
    const curatedBlob = await canvasToBlob(
      canvas,
      coverType,
      coverType === "image/jpeg" ? 0.84 : 0.92,
    );

    return {
      originalBlob: file,
      curatedBlob,
      coverBlob: curatedBlob,
      mimeType: file.type,
      width: bitmap.width,
      height: bitmap.height,
      curatedWidth: outW,
      curatedHeight: outH,
      filename: file.name || "wardrobe-image.jpg",
      focalY,
      rotation: rotate,
    };
  } finally {
    bitmap.close();
  }
}

/** Preview object URL helper — caller must revoke. */
export async function previewCuratedCover(
  file: File,
  options: CoverDraftOptions = {},
): Promise<{ url: string; width: number; height: number }> {
  const processed = await processImageFile(file, options);
  return {
    url: URL.createObjectURL(processed.curatedBlob),
    width: processed.curatedWidth,
    height: processed.curatedHeight,
  };
}

export function extensionForMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}
