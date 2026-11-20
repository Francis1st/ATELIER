"use client";

import { useEffect, useMemo, useState } from "react";
import type { ActiveCoverType, Category } from "@/domain/types";
import { coverTypeLabel } from "@/domain/types";
import { cn } from "@/lib/cn";
import {
  getAiCoverConsent,
  getAiCoverProvider,
  newAiCoverRequestId,
  setAiCoverConsent,
  type AiCoverStatus,
} from "@/services/ai-cover";
import {
  previewCuratedCover,
  type CoverDraftOptions,
} from "@/services/images/process";
import type { AiCoverAttachment } from "@/services/wardrobe/repository";
import { Button } from "@/components/ui/Button";

export type CoverStudioValue = {
  rotate: 0 | 90 | 180 | 270;
  focalY: number;
  activeCoverType: ActiveCoverType;
  aiCover: AiCoverAttachment | null;
};

const TABS: ActiveCoverType[] = ["original", "curated", "ai"];

export function CoverStudio({
  file,
  existingOriginalUrl,
  existingStudioUrl,
  existingAiUrl,
  category,
  colors,
  name,
  value,
  onChange,
}: {
  file: File | null;
  existingOriginalUrl?: string;
  existingStudioUrl?: string;
  existingAiUrl?: string;
  category: Category;
  colors: string[];
  name: string;
  value: CoverStudioValue;
  onChange: (next: CoverStudioValue) => void;
}) {
  const provider = useMemo(() => getAiCoverProvider(), []);
  const [studioPreview, setStudioPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<AiCoverStatus>(
    provider.isConfigured ? "ready" : "not_configured",
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(
    () => Boolean(getAiCoverConsent()),
  );
  const [compare, setCompare] = useState(false);

  const originalUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return existingOriginalUrl;
  }, [file, existingOriginalUrl]);

  const aiObjectUrl = useMemo(() => {
    if (!value.aiCover) return null;
    return URL.createObjectURL(value.aiCover.blob);
  }, [value.aiCover]);

  const aiPreview = aiObjectUrl ?? existingAiUrl ?? null;
  const studioShown = file ? studioPreview : existingStudioUrl ?? null;

  useEffect(() => {
    return () => {
      if (file && originalUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(originalUrl);
      }
    };
  }, [file, originalUrl]);

  useEffect(() => {
    return () => {
      if (aiObjectUrl) URL.revokeObjectURL(aiObjectUrl);
    };
  }, [aiObjectUrl]);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    let url: string | null = null;
    const opts: CoverDraftOptions = {
      rotate: value.rotate,
      focalY: value.focalY,
    };
    void (async () => {
      try {
        const preview = await previewCuratedCover(file, opts);
        if (cancelled) {
          URL.revokeObjectURL(preview.url);
          return;
        }
        url = preview.url;
        setStudioPreview(preview.url);
      } catch {
        if (!cancelled) setStudioPreview(null);
      }
    })();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [file, value.rotate, value.focalY]);

  const activePreview =
    value.activeCoverType === "original"
      ? originalUrl
      : value.activeCoverType === "ai"
        ? aiPreview || studioShown || originalUrl
        : studioShown || originalUrl;

  const compareLeft = originalUrl;
  const compareRight =
    value.activeCoverType === "ai" ? aiPreview : studioShown;

  async function runAiGenerate() {
    if (!file && !existingOriginalUrl) {
      setStatus("failed");
      setStatusMessage("Add a photo before generating an AI cover.");
      return;
    }
    if (!provider.isConfigured) {
      setStatus("not_configured");
      setStatusMessage(provider.privacyNote);
      return;
    }
    if (!consentChecked) {
      setStatus("failed");
      setStatusMessage("Confirm the privacy notice before generating.");
      return;
    }

    setAiCoverConsent(provider.id);
    setStatus("preparing");
    setStatusMessage("Preparing your photo…");

    let blob: Blob | null = file;
    if (!blob && existingOriginalUrl) {
      try {
        const res = await fetch(existingOriginalUrl);
        blob = await res.blob();
      } catch {
        blob = null;
      }
    }
    if (!blob) {
      setStatus("failed");
      setStatusMessage("Could not read the original photo.");
      return;
    }

    setStatus("generating");
    setStatusMessage("Creating your curated cover…");
    const result = await provider.generate({
      imageBlob: blob,
      category,
      colors,
      name,
      userConsent: true,
      requestId: newAiCoverRequestId(),
    });

    if (!result.ok) {
      setStatus(result.status);
      setStatusMessage(result.error);
      return;
    }

    setStatus("completed");
    setStatusMessage("Checking the result… Confirm details before using.");
    onChange({
      ...value,
      aiCover: {
        blob: result.image,
        providerId: result.providerId,
        generationVersion: result.generationVersion,
        model: result.model,
      },
      activeCoverType: "ai",
    });
  }

  const hasSource = Boolean(file || existingOriginalUrl || existingStudioUrl);

  if (!hasSource) {
    return (
      <section className="border border-border bg-[#F3EFE8]/40 p-5">
        <p className="text-[11px] tracking-[0.2em] uppercase text-warm-gray">
          Curate Your Cover
        </p>
        <p className="mt-3 text-sm text-warm-gray">
          Upload a photo first. You can save with Original or Studio Clean — AI
          is optional.
        </p>
      </section>
    );
  }

  return (
    <section className="border border-border">
      <div className="border-b border-border px-4 py-3 sm:px-5">
        <p className="text-[11px] tracking-[0.2em] uppercase text-warm-gray">
          Curate Your Cover
        </p>
        <p className="mt-1 text-sm text-warm-gray">
          Original is always kept. Studio Clean stays on this device. AI Curated
          only runs after you ask.
        </p>
      </div>

      <div
        className="flex border-b border-border"
        role="tablist"
        aria-label="Cover type"
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={value.activeCoverType === tab}
            disabled={tab === "ai" && status === "generating"}
            onClick={() => onChange({ ...value, activeCoverType: tab })}
            className={cn(
              "min-h-11 flex-1 px-2 text-[11px] tracking-[0.12em] uppercase transition-colors",
              value.activeCoverType === tab
                ? "bg-charcoal text-ivory"
                : "bg-transparent text-warm-gray hover:text-charcoal",
            )}
          >
            {coverTypeLabel(tab)}
          </button>
        ))}
      </div>

      <div className="grid gap-0 md:grid-cols-2">
        <div className="relative min-h-56 bg-[#EDE8E0] md:min-h-80">
          {compare && compareLeft && compareRight ? (
            <div className="grid h-full grid-cols-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={compareLeft}
                alt="Original photo"
                className="h-full max-h-96 w-full object-contain md:max-h-none"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={compareRight}
                alt={`${coverTypeLabel(value.activeCoverType)} preview`}
                className="h-full max-h-96 w-full object-contain md:max-h-none"
              />
            </div>
          ) : activePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activePreview}
              alt={`${coverTypeLabel(value.activeCoverType)} preview`}
              className="h-full max-h-96 w-full object-contain p-2 md:max-h-[28rem]"
            />
          ) : (
            <div className="flex h-56 items-center justify-center text-sm text-warm-gray md:h-80">
              Preview unavailable
            </div>
          )}
          {value.activeCoverType === "ai" && (aiPreview || existingAiUrl) ? (
            <span className="absolute left-3 top-3 bg-charcoal/80 px-2 py-1 text-[10px] tracking-[0.16em] uppercase text-ivory">
              AI Curated
            </span>
          ) : null}
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          {value.activeCoverType === "curated" ? (
            <>
              <label className="block text-sm text-charcoal">
                <span className="text-[11px] tracking-[0.14em] uppercase text-warm-gray">
                  Rotate
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {([0, 90, 180, 270] as const).map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => onChange({ ...value, rotate: deg })}
                      className={cn(
                        "min-h-11 min-w-14 border px-3 text-xs",
                        value.rotate === deg
                          ? "border-charcoal text-charcoal"
                          : "border-border text-warm-gray",
                      )}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </label>
              <label className="block text-sm text-charcoal">
                <span className="text-[11px] tracking-[0.14em] uppercase text-warm-gray">
                  Vertical crop
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(value.focalY * 100)}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      focalY: Number(e.target.value) / 100,
                    })
                  }
                  className="mt-3 w-full accent-charcoal"
                  disabled={!file}
                />
                {!file ? (
                  <p className="mt-2 text-xs text-warm-gray">
                    Replace the photo to adjust Studio Clean framing.
                  </p>
                ) : null}
              </label>
            </>
          ) : null}

          {value.activeCoverType === "ai" ? (
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-warm-gray">
                {provider.isConfigured
                  ? provider.privacyNote
                  : "Not configured — connect a cover endpoint to enable generation. Original and Studio Clean remain fully usable."}
              </p>
              <label className="flex items-start gap-3 text-sm text-charcoal">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  disabled={!provider.isConfigured}
                />
                <span>
                  I understand this photo will be sent to the configured cover
                  service for editing, and that AI results can change details. I
                  will confirm the garment before using it as my cover.
                </span>
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  onClick={() => void runAiGenerate()}
                  disabled={
                    !provider.isConfigured ||
                    status === "preparing" ||
                    status === "generating"
                  }
                  className="w-full sm:w-auto"
                >
                  {status === "preparing" || status === "generating"
                    ? "Working…"
                    : value.aiCover || existingAiUrl
                      ? "Regenerate"
                      : "Generate AI Cover"}
                </Button>
                {(aiPreview || existingAiUrl) && originalUrl ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full sm:w-auto"
                    onClick={() => setCompare((c) => !c)}
                  >
                    {compare ? "Hide compare" : "Compare"}
                  </Button>
                ) : null}
              </div>
              {statusMessage ? (
                <p
                  className={cn(
                    "text-sm",
                    status === "failed" || status === "not_configured"
                      ? "text-red-800"
                      : "text-warm-gray",
                  )}
                  role="status"
                >
                  {statusMessage}
                </p>
              ) : null}
            </div>
          ) : null}

          {value.activeCoverType === "original" ? (
            <p className="text-sm leading-relaxed text-warm-gray">
              Archival original — never overwritten by Studio Clean or AI. You
              can always restore this as the gallery cover.
            </p>
          ) : null}

          {value.activeCoverType !== "ai" &&
          originalUrl &&
          studioShown ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCompare((c) => !c)}
            >
              {compare ? "Hide compare" : "Compare with Original"}
            </Button>
          ) : null}

          <p className="text-xs text-warm-gray">
            Active cover:{" "}
            <span className="text-charcoal">
              {coverTypeLabel(value.activeCoverType)}
            </span>
            . Saving works without AI.
          </p>
        </div>
      </div>
    </section>
  );
}
