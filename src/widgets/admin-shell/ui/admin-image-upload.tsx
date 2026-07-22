"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, TriangleAlert } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { formatSize, type UploadSize } from "@shared/config/media";
import {
  imageToWebp,
  type WebpTarget,
  WEBP_QUALITY_PHOTO,
} from "@shared/lib/image-to-webp";

type AdminImageUploadProps = {
  /** CSS aspect-ratio, e.g. "16 / 9", "3 / 4". */
  ratio?: string;
  /**
   * Form field name. Two hidden companions are submitted alongside it:
   * `<name>_width` (the encoded width, which only the browser knows) and
   * `<name>_cleared` (so "removed" is distinguishable from "left alone" —
   * clearing a file input looks identical to never touching it).
   */
  name?: string;
  /** Already-stored image to show until a new one is picked. */
  initialUrl?: string | null;
  /** How the preview fills the box. Use "contain" for logos. */
  fit?: "cover" | "contain";
  /**
   * Exact pixel size the file must have. Anything else is rejected before it
   * reaches the form, so the resizing server always gets a predictable original.
   */
  requiredSize?: UploadSize;
  /**
   * Minimum pixel height — for assets used at several sizes (e.g. the logo,
   * which the site always renders at a fixed height with an automatic width).
   */
  minHeight?: number;
  /**
   * Suggested pixel size shown as guidance, NOT enforced. For fields that crop
   * any upload to a fixed ratio via `output` — the operator can upload any size
   * and we resize; the hint just tells them what resolution stays sharp.
   */
  recommendedSize?: UploadSize;
  /**
   * Suggested minimum height shown as guidance, NOT enforced — for the PNG logo
   * path, which is re-encoded to a fixed height. A smaller source is upscaled
   * (softer) but still accepted; the hint just names the sharp threshold.
   */
  recommendedMinHeight?: number;
  /** Reject files without a transparent background (logo on a solid block). */
  requireTransparent?: boolean;
  /**
   * Also accept SVG, stored untouched — for the logo, which takes SVG or PNG.
   * A vector skips every raster check and the WebP re-encode; its intrinsic
   * ratio is read from the file. PNG still runs the raster checks + `output`.
   */
  allowSvg?: boolean;
  /**
   * Fit the accepted image into this box and re-encode as WebP, replacing the
   * form field's file. The stored asset is then always this exact size/format.
   */
  output?: WebpTarget;
  /**
   * WebP quality for `output`. Photographs compress well; pass WEBP_QUALITY_PHOTO.
   */
  outputQuality?: number;
  className?: string;
};

/** Client-side upload cap — stays under the 50MB storage bucket limit while
 *  catching an accidental huge export before it hits the server. */
const MAX_FILE_MB = 30;

/** Downscale once and read the pixels — used by the alpha + padding checks. */
function samplePixels(
  img: HTMLImageElement,
  n = 128,
): Uint8ClampedArray | null {
  const canvas = document.createElement("canvas");
  canvas.width = n;
  canvas.height = n;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, n, n);
  return ctx.getImageData(0, 0, n, n).data;
}

/** True if any pixel is not fully opaque. */
function hasTransparency(data: Uint8ClampedArray): boolean {
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 250) return true;
  }
  return false;
}

/**
 * How much of the canvas the artwork actually fills, per axis. A tightly
 * cropped logo fills ~1 on both; a logo exported with transparent padding
 * around it fills much less, which would make it render small in the header.
 */
function artworkFill(data: Uint8ClampedArray, n = 128) {
  let minX = n,
    minY = n,
    maxX = -1,
    maxY = -1;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (data[(y * n + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return { width: 0, height: 0 }; // fully transparent
  return { width: (maxX - minX + 1) / n, height: (maxY - minY + 1) / n };
}

/**
 * The logo's intrinsic size, read from the SVG's viewBox (preferred) or its
 * width/height attributes. Only the ratio matters downstream — it drives the
 * hero mask's aspect ratio — so the numbers are rounded to integers the server
 * can validate. Returns null for a non-SVG or an SVG with no declared size.
 */
async function svgIntrinsicSize(
  file: File,
): Promise<{ width: number; height: number } | null> {
  const text = await file.text();
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  if (doc.querySelector("parsererror")) return null;
  const svg = doc.querySelector("svg");
  if (!svg) return null;

  const viewBox = svg.getAttribute("viewBox");
  if (viewBox) {
    const [, , w, h] = viewBox.split(/[\s,]+/).map(Number);
    if (w > 0 && h > 0) return { width: Math.round(w), height: Math.round(h) };
  }
  const w = parseFloat(svg.getAttribute("width") ?? "");
  const h = parseFloat(svg.getAttribute("height") ?? "");
  if (w > 0 && h > 0) return { width: Math.round(w), height: Math.round(h) };
  return null;
}

/**
 * Visual image picker with local preview and exact-size enforcement. Upload
 * itself is not wired — the selected file is previewed client-side only.
 * TODO(backend): send the file to storage and store the returned URL.
 */
export function AdminImageUpload({
  ratio = "16 / 9",
  name,
  fit = "cover",
  requiredSize,
  minHeight,
  recommendedSize,
  recommendedMinHeight,
  requireTransparent,
  allowSvg,
  output,
  outputQuality = WEBP_QUALITY_PHOTO,
  initialUrl,
  className,
}: AdminImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  /** Encoded width, submitted alongside the file — see `name` above. */
  const [width, setWidth] = useState("");
  /** Intrinsic height, submitted for SVG so the server can keep its ratio. */
  const [height, setHeight] = useState("");
  /** Set once the operator explicitly removes the stored image. */
  const [cleared, setCleared] = useState(false);

  const reject = (message: string, url?: string) => {
    setError(message);
    setPreview(null);
    setWidth("");
    setHeight("");
    if (url) URL.revokeObjectURL(url);
    if (inputRef.current) inputRef.current.value = "";
  };

  /**
   * Accept a validated file. With `output`, re-encode it to a fixed-size WebP
   * and swap it into the file input, so the form submits the processed asset
   * rather than the raw upload.
   */
  const accept = async (file: File, url: string) => {
    let previewUrl = url;
    if (output && inputRef.current) {
      try {
        const encoded = await imageToWebp(file, outputQuality, output);
        const dt = new DataTransfer();
        dt.items.add(
          new File([encoded.blob], "image.webp", { type: "image/webp" }),
        );
        inputRef.current.files = dt.files;
        setWidth(String(encoded.width));
        setHeight(String(encoded.height));
        // Preview the processed asset — e.g. the logo with its transparent
        // margin already trimmed — so the operator sees exactly what gets
        // stored the moment they pick the file, not after a save.
        URL.revokeObjectURL(url);
        previewUrl = URL.createObjectURL(encoded.blob);
      } catch {
        reject("이미지를 변환하지 못했습니다.", url);
        return;
      }
    }
    // Picking a file supersedes an earlier removal.
    setCleared(false);
    setPreview(previewUrl);
  };

  const pick = (file?: File) => {
    if (!file) return;
    setError(null);

    const mb = file.size / 1024 / 1024;
    if (mb > MAX_FILE_MB) {
      reject(
        `${mb.toFixed(1)}MB 파일입니다. ${MAX_FILE_MB}MB 이하로 올려주세요 — 사진은 PNG 대신 고품질 JPG로 저장하면 크게 줄어듭니다.`,
      );
      return;
    }

    const url = URL.createObjectURL(file);

    // SVG: stored untouched when allowed (a vector needs no raster checks and
    // no re-encode). Its ratio is read from the file and submitted; the raw SVG
    // already sits in the input from the change event.
    if (file.type === "image/svg+xml") {
      if (!allowSvg) {
        reject("SVG는 등록할 수 없습니다.", url);
        return;
      }
      svgIntrinsicSize(file).then((size) => {
        if (!size) {
          reject(
            "SVG 크기를 읽을 수 없습니다. viewBox 또는 width·height가 있는 파일로 올려주세요.",
            url,
          );
          return;
        }
        setWidth(String(size.width));
        setHeight(String(size.height));
        setCleared(false);
        setPreview(url);
      });
      return;
    }

    // JPEG has no alpha channel, so it can never satisfy requireTransparent.
    // Say so up front instead of failing the vaguer transparency check below.
    if (requireTransparent && file.type === "image/jpeg") {
      reject("JPG는 투명 배경을 담을 수 없습니다. PNG로 올려주세요.", url);
      return;
    }

    if (!requiredSize && !minHeight && !requireTransparent) {
      accept(file, url);
      return;
    }

    // Measure the real file before accepting it, so a wrong asset never
    // reaches the site (e.g. an opaque logo would show as a black block).
    const probe = new window.Image();
    probe.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = probe;

      if (
        requiredSize &&
        (w !== requiredSize.width || h !== requiredSize.height)
      ) {
        reject(
          `${w} × ${h} 이미지입니다. ${formatSize(requiredSize)} 만 등록할 수 있어요.`,
          url,
        );
        return;
      }
      if (minHeight && h < minHeight) {
        reject(
          `세로 ${h}px 이미지입니다. ${minHeight}px 이상이어야 선명하게 나와요.`,
          url,
        );
        return;
      }
      if (requireTransparent) {
        const pixels = samplePixels(probe);
        if (pixels && !hasTransparency(pixels)) {
          reject(
            "배경이 투명하지 않습니다. 배경을 지운 파일로 올려주세요.",
            url,
          );
          return;
        }
        // Empty margins are trimmed automatically on encode (output.trim), so
        // padding is no longer rejected — only a wholly transparent file, which
        // has no artwork to keep, is caught here.
        if (pixels && artworkFill(pixels).width === 0) {
          reject("전체가 투명한 파일입니다.", url);
          return;
        }
      }
      accept(file, url);
    };
    probe.onerror = () => reject("이미지를 읽을 수 없는 파일입니다.", url);
    probe.src = url;
  };

  const clear = () => {
    setPreview(null);
    setError(null);
    setWidth("");
    setHeight("");
    setCleared(true);
    if (inputRef.current) inputRef.current.value = "";
  };

  // Shown inside the drop box so the requirement sits where the eye already is.
  // Enforced fields (requiredSize / minHeight) state the hard rule; otherwise a
  // recommendedSize states the target ratio + a suggested resolution.
  const sizeLabel = requiredSize
    ? formatSize(requiredSize)
    : minHeight
      ? `세로 ${minHeight}px 이상`
      : null;
  // "16 / 9" (CSS) → "16:9" (display).
  const ratioText = ratio.replace(/\s*\/\s*/, ":");

  return (
    <div className={cn("w-full", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors",
          error
            ? "border-red-400 bg-red-500/[0.04]"
            : "border-ink/20 bg-ink/[0.02] hover:border-brand hover:bg-brand/[0.04]",
        )}
        style={{ aspectRatio: ratio }}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="미리보기"
              className={cn(
                "h-full w-full",
                fit === "contain" ? "object-contain p-3" : "object-cover",
              )}
            />
            {/* Make it obvious the filled box is still clickable. */}
            <span className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all group-hover:bg-ink/50 group-hover:opacity-100">
              <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink">
                이미지 변경
              </span>
            </span>
          </>
        ) : (
          <span
            className={cn(
              "flex flex-col items-center gap-2 px-2 text-center",
              error ? "text-red-500/80" : "text-ink/45",
            )}
          >
            <span
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                error
                  ? "bg-red-500/10"
                  : "bg-ink/[0.06] group-hover:bg-brand group-hover:text-paper",
              )}
            >
              <ImagePlus size={20} />
            </span>
            <span className="text-xs font-semibold leading-tight text-ink/70">
              이미지 업로드
            </span>
            {allowSvg ? (
              <span className="rounded-md bg-ink/[0.06] px-2 py-1 font-display text-[11px] font-semibold tracking-wide text-ink/55">
                SVG · PNG
                {recommendedMinHeight ? ` (권장 세로 ${recommendedMinHeight}px+)` : ""}
              </span>
            ) : sizeLabel ? (
              <span className="rounded-md bg-ink/[0.06] px-2 py-1 font-display text-[11px] font-semibold tabular-nums tracking-wide text-ink/55">
                {sizeLabel}
              </span>
            ) : recommendedSize ? (
              <span className="flex flex-col items-center gap-1">
                <span className="rounded-md bg-ink/[0.06] px-2 py-1 font-display text-[11px] font-semibold tracking-wide text-ink/55">
                  {ratioText} 비율로 자동 조정
                </span>
                <span className="font-display text-[11px] tabular-nums text-ink/45">
                  권장 {formatSize(recommendedSize)}
                </span>
              </span>
            ) : null}
          </span>
        )}
      </button>

      {error && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-red-600">
          <TriangleAlert size={13} className="mt-px shrink-0" />
          {error}
        </p>
      )}

      {preview && (
        <button
          type="button"
          onClick={clear}
          className="mt-2 inline-flex items-center gap-1 text-xs text-ink/50 transition-colors hover:text-red-600"
        >
          <X size={13} /> 제거
        </button>
      )}

      {/* The logo adds SVG to its raster list; other fields keep SVG out of the
          picker entirely, and transparency-dependent ones rule out JPEG. */}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={
          requireTransparent
            ? `image/png,image/webp${allowSvg ? ",image/svg+xml" : ""}`
            : "image/png,image/jpeg,image/webp"
        }
        onChange={(e) => pick(e.target.files?.[0])}
        className="hidden"
      />

      {/* Companions to the file field. The width exists only here — the server
          receives an opaque blob and has no decoder to measure it. The cleared
          flag exists because an emptied file input is byte-identical to an
          untouched one, so without it the operator could never remove an image. */}
      {name && (
        <>
          <input type="hidden" name={`${name}_width`} value={width} />
          <input type="hidden" name={`${name}_height`} value={height} />
          <input
            type="hidden"
            name={`${name}_cleared`}
            value={cleared ? "1" : ""}
          />
        </>
      )}
    </div>
  );
}
