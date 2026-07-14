"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@shared/lib/cn";

type AdminImageUploadProps = {
  /** CSS aspect-ratio, e.g. "16 / 9", "3 / 4". */
  ratio?: string;
  /** Input name for when the backend wires up submission. */
  name?: string;
  /** How the preview fills the box. Use "contain" for logos. */
  fit?: "cover" | "contain";
  className?: string;
};

/**
 * Visual image picker with local preview. Upload itself is not wired —
 * the selected file is previewed client-side only.
 * TODO(backend): send the file to storage and store the returned URL.
 */
export function AdminImageUpload({
  ratio = "16 / 9",
  name,
  fit = "cover",
  className,
}: AdminImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const pick = (file?: File) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const clear = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-ink/25 bg-ink/[0.02] transition-colors hover:border-brand/50"
        style={{ aspectRatio: ratio }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="미리보기"
            className={cn(
              "h-full w-full",
              fit === "contain" ? "object-contain p-3" : "object-cover"
            )}
          />
        ) : (
          <span className="flex flex-col items-center gap-2 text-ink/40">
            <ImagePlus size={26} />
            <span className="text-xs font-medium">이미지 업로드</span>
          </span>
        )}
      </button>

      {preview && (
        <button
          type="button"
          onClick={clear}
          className="mt-2 inline-flex items-center gap-1 text-xs text-ink/50 transition-colors hover:text-red-600"
        >
          <X size={13} /> 제거
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        onChange={(e) => pick(e.target.files?.[0])}
        className="hidden"
      />
    </div>
  );
}
