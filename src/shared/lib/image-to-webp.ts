"use client";

export const WEBP_QUALITY_LOGO = 1;
export const WEBP_QUALITY_PHOTO = 0.85;

/**
 * Output size. Give both dimensions for a fixed box — `contain` fits the whole
 * image inside and centres it (transparent letterbox), `cover` fills the box
 * and crops the overflow. Give `height` alone to scale by height with the width
 * following the source ratio, which stores no padding at all — right for a
 * wordmark, which must neither be cropped nor gain empty margins.
 */
export type WebpTarget = {
  width?: number;
  height: number;
  fit?: "contain" | "cover";
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
    const canvas = document.createElement("canvas");
    if (target) {
      // Height-only target: the canvas takes the source ratio, so the artwork
      // fills it edge to edge and no padding is baked into the stored file.
      canvas.width =
        target.width ??
        Math.round((bitmap.width * target.height) / bitmap.height);
      canvas.height = target.height;
    } else {
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("이미지를 변환할 수 없습니다.");

    if (target?.width) {
      const { dx, dy, dw, dh } = placeInBox(
        bitmap.width,
        bitmap.height,
        target.width,
        target.height,
        target.fit ?? "contain",
      );
      // A fresh canvas is transparent and drawImage keeps the alpha channel,
      // so the letterbox stays see-through and the logo's transparency holds.
      ctx.drawImage(bitmap, dx, dy, dw, dh);
    } else {
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
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
