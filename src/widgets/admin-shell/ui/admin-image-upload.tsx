"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, TriangleAlert } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { formatSize, type UploadSize } from "@shared/config/media";
import {
  imageToWebp,
  type WebpTarget,
  WEBP_QUALITY_LOGO,
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
  /** Reject files without a transparent background (logo on a solid block). */
  requireTransparent?: boolean;
  /** Accept SVG and skip the raster checks (vectors scale to any size). */
  allowSvg?: boolean;
  /**
   * Fit the accepted image into this box and re-encode as WebP, replacing the
   * form field's file. The stored asset is then always this exact size/format.
   */
  output?: WebpTarget;
  className?: string;
};

/** Upload cap. Well above a quality JPG at our largest spec (~2MB), but low
 *  enough to catch an accidental huge export before it hits the server. */
const MAX_FILE_MB = 12;

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
  requireTransparent,
  allowSvg,
  output,
  initialUrl,
  className,
}: AdminImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  /** Encoded width, submitted alongside the file — see `name` above. */
  const [width, setWidth] = useState("");
  /** Set once the operator explicitly removes the stored image. */
  const [cleared, setCleared] = useState(false);

  const reject = (message: string, url?: string) => {
    setError(message);
    setPreview(null);
    setWidth("");
    if (url) URL.revokeObjectURL(url);
    if (inputRef.current) inputRef.current.value = "";
  };

  /**
   * Accept a validated file. With `output`, re-encode it to a fixed-size WebP
   * and swap it into the file input, so the form submits the processed asset
   * rather than the raw upload.
   */
  const accept = async (file: File, url: string) => {
    if (output && inputRef.current) {
      try {
        const encoded = await imageToWebp(file, WEBP_QUALITY_LOGO, output);
        const dt = new DataTransfer();
        dt.items.add(
          new File([encoded.blob], "image.webp", { type: "image/webp" }),
        );
        inputRef.current.files = dt.files;
        setWidth(String(encoded.width));
      } catch {
        reject("이미지를 변환하지 못했습니다.", url);
        return;
      }
    }
    // Picking a file supersedes an earlier removal.
    setCleared(false);
    setPreview(url);
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

    // Vectors scale to any size and keep transparency — nothing to check.
    if (file.type === "image/svg+xml") {
      if (allowSvg) accept(file, url);
      else reject("SVG는 등록할 수 없습니다. PNG로 올려주세요.", url);
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
    setCleared(true);
    if (inputRef.current) inputRef.current.value = "";
  };

  // Shown inside the drop box so the requirement sits where the eye already is.
  const sizeLabel = requiredSize
    ? formatSize(requiredSize)
    : minHeight
      ? `세로 ${minHeight}px 이상`
      : null;

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
            {sizeLabel && (
              <span className="rounded-md bg-ink/[0.06] px-2 py-1 font-display text-[11px] font-semibold tabular-nums tracking-wide text-ink/55">
                {sizeLabel}
              </span>
            )}
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

      {/* Explicit list keeps SVG out of the picker entirely. Transparency-
          dependent assets (the logo) additionally rule out JPEG. */}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={
          requireTransparent
            ? "image/png,image/webp"
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
