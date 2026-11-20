import type {
  GarmentRecognitionResult,
  ProductMatchCandidate,
} from "@/domain/matching";

export type MatchingSearchInput = {
  /** Local object URL or blob — never sent unless user consented. */
  imageBlob: Blob;
  knownBrand?: string;
  categoryHint?: string;
  userConsentExternal: boolean;
};

export type MatchingSearchResult =
  | { status: "ok"; candidates: ProductMatchCandidate[]; recognition?: GarmentRecognitionResult }
  | { status: "unavailable"; reason: string }
  | { status: "no_results"; reason: string }
  | { status: "error"; reason: string };

export type ImageRightsDecision = {
  mayDisplay: boolean;
  mayCache: boolean;
  mayExportInZip: boolean;
  status: ProductMatchCandidate["imageRightsStatus"];
  note: string;
};

export interface ProductMatchingProvider {
  readonly id: string;
  readonly label: string;
  /** True only when a real remote service is configured. */
  readonly isConfigured: boolean;
  search(input: MatchingSearchInput): Promise<MatchingSearchResult>;
}

export interface ImageRightsPolicy {
  evaluate(candidate: ProductMatchCandidate): ImageRightsDecision;
}
