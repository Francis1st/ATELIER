import { createId } from "@/lib/id";
import { buildCuratedCoverPrompt, GENERATION_VERSION } from "./prompt";
import type {
  AiCoverGenerateInput,
  AiCoverGenerateResult,
  ImageGenerationProvider,
} from "./types";

export type { AiCoverGenerateInput, AiCoverGenerateResult, AiCoverStatus, ImageGenerationProvider } from "./types";
export { getAiCoverConsent, setAiCoverConsent, clearAiCoverConsent } from "./consent";
export { buildCuratedCoverPrompt, GENERATION_VERSION } from "./prompt";

const ENDPOINT = process.env.NEXT_PUBLIC_AI_COVER_ENDPOINT?.trim() || "";
const ENABLED = process.env.NEXT_PUBLIC_AI_COVER_ENABLED === "true";

class NoopAiCoverProvider implements ImageGenerationProvider {
  readonly id = "noop";
  readonly label = "Not configured";
  readonly isConfigured = false;
  readonly privacyNote =
    "AI Curated Cover opens when a protected image endpoint is connected. Until then, use Original or Studio Clean — no simulated AI images.";

  async generate(input: AiCoverGenerateInput): Promise<AiCoverGenerateResult> {
    if (!input.userConsent) {
      return {
        ok: false,
        status: "failed",
        error: "Consent is required before any photo leaves this device.",
      };
    }
    return {
      ok: false,
      status: "not_configured",
      error:
        "AI Curated Cover is not connected yet. Your wardrobe still works with Original and Studio Clean.",
    };
  }
}

/**
 * Client calls a server-side proxy you host (Cloudflare Worker / Pages Function /
 * other backend). The browser never sees a model API key.
 *
 * Expected contract (application/json response):
 *   { imageBase64: string, mimeType?: string, model?: string }
 * or binary image/* response body.
 */
class HttpAiCoverProvider implements ImageGenerationProvider {
  readonly id = "http-proxy";
  readonly label = "Curated Cover service";
  readonly isConfigured = true;
  readonly privacyNote =
    "Your photo is sent only to the configured ATELIER cover endpoint for one-time editing. Retention follows that service’s privacy policy — do not enable until you have reviewed it.";

  constructor(private endpoint: string) {}

  async generate(input: AiCoverGenerateInput): Promise<AiCoverGenerateResult> {
    if (!input.userConsent) {
      return {
        ok: false,
        status: "failed",
        error: "Consent is required before any photo leaves this device.",
      };
    }

    const prompt = buildCuratedCoverPrompt({
      category: input.category,
      colors: input.colors,
      name: input.name,
    });

    const form = new FormData();
    form.append("image", input.imageBlob, "garment.jpg");
    form.append("prompt", prompt);
    form.append("category", input.category);
    form.append("requestId", input.requestId);
    form.append("generationVersion", GENERATION_VERSION);
    if (input.name) form.append("name", input.name);
    if (input.colors?.length) form.append("colors", input.colors.join(","));

    let res: Response;
    try {
      res = await fetch(this.endpoint, {
        method: "POST",
        body: form,
        signal: AbortSignal.timeout(90_000),
      });
    } catch {
      return {
        ok: false,
        status: "failed",
        error: "Network error or timeout. Try again when you are online.",
      };
    }

    if (res.status === 429) {
      return {
        ok: false,
        status: "failed",
        error: "Rate limit reached. Try again later.",
      };
    }
    if (!res.ok) {
      return {
        ok: false,
        status: "failed",
        error: "Could not create a curated cover right now.",
      };
    }

    const contentType = res.headers.get("content-type") || "";
    try {
      if (contentType.includes("application/json")) {
        const data = (await res.json()) as {
          imageBase64?: string;
          mimeType?: string;
          model?: string;
        };
        if (!data.imageBase64) {
          return {
            ok: false,
            status: "failed",
            error: "Cover service returned an empty image.",
          };
        }
        const mime = data.mimeType || "image/jpeg";
        const binary = Uint8Array.from(atob(data.imageBase64), (c) =>
          c.charCodeAt(0),
        );
        return {
          ok: true,
          image: new Blob([binary], { type: mime }),
          providerId: this.id,
          model: data.model,
          generationVersion: GENERATION_VERSION,
          createdAt: new Date().toISOString(),
        };
      }

      if (contentType.startsWith("image/")) {
        const image = await res.blob();
        if (!image.size) {
          return {
            ok: false,
            status: "failed",
            error: "Cover service returned an empty image.",
          };
        }
        return {
          ok: true,
          image,
          providerId: this.id,
          generationVersion: GENERATION_VERSION,
          createdAt: new Date().toISOString(),
        };
      }

      return {
        ok: false,
        status: "failed",
        error: "Cover service returned an unexpected response.",
      };
    } catch {
      return {
        ok: false,
        status: "failed",
        error: "Could not read the curated cover response.",
      };
    }
  }
}

let cached: ImageGenerationProvider | null = null;

export function getAiCoverProvider(): ImageGenerationProvider {
  if (cached) return cached;
  if (ENABLED && ENDPOINT) {
    cached = new HttpAiCoverProvider(ENDPOINT);
  } else {
    cached = new NoopAiCoverProvider();
  }
  return cached;
}

export function newAiCoverRequestId(): string {
  return createId();
}
