"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/domain/schema";
import { cn } from "@/lib/cn";

export function ImageUploader({
  file,
  onChange,
  existingUrl,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  existingUrl?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : undefined),
    [file],
  );

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const validate = useCallback((next: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(next.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
      setError("Please use JPG, PNG, or WebP.");
      return false;
    }
    if (next.size > MAX_IMAGE_BYTES) {
      setError("Images must be 8 MB or smaller.");
      return false;
    }
    setError(null);
    return true;
  }, []);

  const takeFile = useCallback(
    (next?: File | null) => {
      if (!next) return;
      if (!validate(next)) return;
      onChange(next);
    },
    [onChange, validate],
  );

  const shown = preview || existingUrl;

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          takeFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "relative flex min-h-64 cursor-pointer flex-col items-center justify-center border border-dashed border-border bg-[#F3EFE8] px-4 py-10 text-center transition-colors",
          dragging && "border-champagne bg-[#EFE9DF]",
        )}
      >
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shown}
            alt="Selected garment preview"
            className="max-h-80 w-full object-contain"
          />
        ) : (
          <>
            <Upload className="text-champagne" size={22} />
            <p className="mt-4 text-sm text-charcoal">
              Drop a photo or click to choose
            </p>
            <p className="mt-2 text-xs text-warm-gray">
              JPG, PNG, WebP · up to 8 MB · camera supported on mobile
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          className="sr-only"
          onChange={(e) => takeFile(e.target.files?.[0])}
        />
      </div>
      {error ? (
        <p className="mt-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
      {file || existingUrl ? (
        <button
          type="button"
          className="mt-3 text-[11px] tracking-[0.14em] uppercase text-warm-gray hover:text-charcoal"
          onClick={() => {
            onChange(null);
            setError(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
        >
          Remove photo
        </button>
      ) : null}
    </div>
  );
}
