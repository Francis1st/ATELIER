import type { Category } from "./types";

/** Visual facts vs model guesses must stay distinguishable. */
export type EvidenceKind = "observed" | "inferred" | "unknown";

export type EvidenceField<T> = {
  value?: T;
  kind: EvidenceKind;
  note?: string;
};

export type GarmentRecognitionResult = {
  category: EvidenceField<Category>;
  subcategory: EvidenceField<string>;
  dominantColors: EvidenceField<string[]>;
  silhouette: EvidenceField<string>;
  materialClues: EvidenceField<string[]>;
  pattern: EvidenceField<string>;
  visibleDetails: EvidenceField<string[]>;
  detectedText: EvidenceField<string[]>;
  brandCandidates: EvidenceField<string[]>;
  modelOrSkuCandidates: EvidenceField<string[]>;
  uncertainty: number;
  sourceEvidence: string[];
};

export const MATCH_LEVELS = [
  "VERIFIED_EXACT",
  "LIKELY_EXACT",
  "VISUALLY_SIMILAR",
  "UNKNOWN",
] as const;
export type MatchLevel = (typeof MATCH_LEVELS)[number];

export const IMAGE_RIGHTS_STATUSES = [
  "allowed_display",
  "link_only",
  "unknown",
  "forbidden",
] as const;
export type ImageRightsStatus = (typeof IMAGE_RIGHTS_STATUSES)[number];

export type ProductMatchEvidence = {
  brandDomainOk?: boolean;
  skuOnPage?: boolean;
  colorwayMentioned?: boolean;
  titleOverlap?: number;
  notes: string[];
};

export type ProductMatchCandidate = {
  candidateId: string;
  brand?: string;
  productName?: string;
  modelOrSku?: string;
  colorway?: string;
  productPageUrl?: string;
  productPageDomain?: string;
  imageUrl?: string;
  provider: string;
  evidence: ProductMatchEvidence;
  visualSimilarity?: number;
  skuEvidence?: number;
  brandEvidence?: number;
  colorEvidence?: number;
  matchLevel: MatchLevel;
  imageRightsStatus: ImageRightsStatus;
  imageLicenseReference?: string;
  retrievalTimestamp: string;
};
