import type {
  ImageRightsPolicy,
  MatchingSearchInput,
  MatchingSearchResult,
  ProductMatchingProvider,
} from "./types";
import type { ProductMatchCandidate } from "@/domain/matching";

/**
 * Production-safe default. Never invents brands, SKUs, or product photos.
 */
export class NoopMatchingProvider implements ProductMatchingProvider {
  readonly id = "noop";
  readonly label = "Not configured";
  readonly isConfigured = false;

  async search(input: MatchingSearchInput): Promise<MatchingSearchResult> {
    if (!input.userConsentExternal) {
      return {
        status: "unavailable",
        reason:
          "External matching stays off until you explicitly allow a photo to leave this device.",
      };
    }
    return {
      status: "unavailable",
      reason:
        "Official product matching is not connected yet. Keep using your own photo — no fake results.",
    };
  }
}

/** Conservative default: unknown remote images are link-only, never zip/cache. */
export class StrictImageRightsPolicy implements ImageRightsPolicy {
  evaluate(candidate: ProductMatchCandidate) {
    if (candidate.imageRightsStatus === "allowed_display") {
      return {
        mayDisplay: true,
        mayCache: true,
        mayExportInZip: false,
        status: candidate.imageRightsStatus,
        note: "Display allowed under recorded license; do not re-export third-party bytes.",
      };
    }
    if (candidate.imageRightsStatus === "link_only") {
      return {
        mayDisplay: false,
        mayCache: false,
        mayExportInZip: false,
        status: "link_only" as const,
        note: "Show product page link only — do not hotlink or cache the image.",
      };
    }
    return {
      mayDisplay: false,
      mayCache: false,
      mayExportInZip: false,
      status: candidate.imageRightsStatus,
      note: "Rights unknown or forbidden — keep the user’s photo as cover.",
    };
  }
}
