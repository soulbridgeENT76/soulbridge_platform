"use client";

export const WEBP_QUALITY_LOGO = 1;
export const WEBP_QUALITY_PHOTO = 0.85;

/**
 * Output size. Give both dimensions for a fixed box — `contain` fits the whole
 * image inside and centres it (transparent letterbox), `cover` fills the box
 * and crops the overflow. Give `height` alone to scale by height with the width
 * following the source ratio, which stores no padding at all — right for a
 * wordmark, which must neither be cropped nor gain empty margins.
 *
 * `trim` first crops the source to the bounding box of its non-transparent
 * pixels, so a logo exported with empty margins around it still fills the frame.
 */
export type WebpTarget = {
  width?: number;
  height: number;
  fit?: "contain" | "cover";
  trim?: boolean;
};

/** Where to draw the source so it fills the target per `fit`, keeping ratio. */
function placeInBox(
  sw: number,
  sh: number,
  tw: number,
  th: number,
  fit: "contain" | "cover",
) {
  const scale =
    fit === "cover" ? Math.max(tw / sw, th / sh) : Math.min(tw / sw, th / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  return { dx: (tw - dw) / 2, dy: (th - dh) / 2, dw, dh };
}

/**
 * The bounding box of the source's non-transparent pixels, at full resolution.
 * Returns null when the image is fully transparent (nothing to keep). Used to
 * strip the empty margin a logo may carry so it is sized by its artwork alone.
 */
function opaqueBounds(
  bitmap: ImageBitmap,
): { sx: number; sy: number; sw: number; sh: number } | null {
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(bitmap, 0, 0);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const w = canvas.width;
  const h = canvas.height;
  let minX = w,
    minY = h,
    maxX = -1,
    maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  return { sx: minX, sy: minY, sw: maxX - minX + 1, sh: maxY - minY + 1 };
}

/**
 * The encoded file plus the size it came out at. The dimensions are returned
 * rather than recomputed by the caller because this is the only place they are
 * known — a height-only target derives the width from the source ratio, and the
 * server that stores the result has no image decoder to measure it with.
 */
export type WebpResult = {
  blob: Blob;
  width: number;
  height: number;
};

export async function imageToWebp(
  file: File,
  quality: number = WEBP_QUALITY_PHOTO,
  target?: WebpTarget,
): Promise<WebpResult> {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });

  try {
    // Source rectangle to read from — the whole bitmap, or just its artwork
    // when trimming away transparent margins.
    let sx = 0;
    let sy = 0;
    let sw = bitmap.width;
    let sh = bitmap.height;
    if (target?.trim) {
      const b = opaqueBounds(bitmap);
      if (!b) throw new Error("이미지가 비어 있습니다.");
      ({ sx, sy, sw, sh } = b);
    }

    const canvas = document.createElement("canvas");
    if (target) {
      // Height-only target: the canvas takes the source ratio, so the artwork
      // fills it edge to edge and no padding is baked into the stored file.
      canvas.width = target.width ?? Math.round((sw * target.height) / sh);
      canvas.height = target.height;
    } else {
      canvas.width = sw;
      canvas.height = sh;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("이미지를 변환할 수 없습니다.");

    if (target?.width) {
      const { dx, dy, dw, dh } = placeInBox(
        sw,
        sh,
        target.width,
        target.height,
        target.fit ?? "contain",
      );
      // A fresh canvas is transparent and drawImage keeps the alpha channel,
      // so the letterbox stays see-through and the logo's transparency holds.
      ctx.drawImage(bitmap, sx, sy, sw, sh, dx, dy, dw, dh);
    } else {
      ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    }

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality),
    );
    if (!blob) throw new Error("이미지를 WebP로 변환하지 못했습니다.");

    return { blob, width: canvas.width, height: canvas.height };
  } finally {
    bitmap.close();
  }
}
