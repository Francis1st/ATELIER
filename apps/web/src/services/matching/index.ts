import { NoopMatchingProvider, StrictImageRightsPolicy } from "./noop";
import type { ImageRightsPolicy, ProductMatchingProvider } from "./types";

/**
 * Pluggable matching entrypoint.
 * Real providers (catalog / web detection) plug in here once credentials exist.
 * Cloudflare Pages static export cannot hold API secrets — use a worker proxy later.
 */
export function getMatchingProvider(): ProductMatchingProvider {
  const enabled = process.env.NEXT_PUBLIC_MATCHING_ENABLED === "true";
  const endpoint = process.env.NEXT_PUBLIC_MATCHING_ENDPOINT?.trim();
  if (enabled && endpoint) {
    // Stage 2: wire CatalogMatchingProvider / proxied WebDetectionProvider here.
    // Until then, stay on Noop so production never fakes success.
  }
  return new NoopMatchingProvider();
}

export function getImageRightsPolicy(): ImageRightsPolicy {
  return new StrictImageRightsPolicy();
}

export type {
  ImageRightsPolicy,
  MatchingSearchInput,
  MatchingSearchResult,
  ProductMatchingProvider,
} from "./types";
