"use client";

export const WEBP_QUALITY_LOGO = 1;
export const WEBP_QUALITY_PHOTO = 0.85;

/**
 * Fixed output box. `contain` fits the whole image inside and centres it
 * (transparent letterbox — right for a wordmark, which must not be cropped);
 * `cover` fills the box and crops the overflow.
 */
export type WebpTarget = {
  width: number;
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

export async function imageToWebp(
  file: File,
  quality: number = WEBP_QUALITY_PHOTO,
  target?: WebpTarget,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });

  try {
    const canvas = document.createElement("canvas");
    canvas.width = target?.width ?? bitmap.width;
    canvas.height = target?.height ?? bitmap.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("이미지를 변환할 수 없습니다.");

    if (target) {
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
      ctx.drawImage(bitmap, 0, 0);
    }

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality),
    );
    if (!blob) throw new Error("이미지를 WebP로 변환하지 못했습니다.");

    return blob;
  } finally {
    bitmap.close();
  }
}
