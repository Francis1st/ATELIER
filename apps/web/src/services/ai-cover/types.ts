import type { Category } from "@/domain/types";

export type AiCoverStatus =
  | "not_configured"
  | "ready"
  | "preparing"
  | "generating"
  | "completed"
  | "failed"
  | "cancelled";

export type AiCoverGenerateInput = {
  imageBlob: Blob;
  category: Category;
  colors?: string[];
  name?: string;
  /** User explicitly consented to send this photo to the cloud provider. */
  userConsent: boolean;
  requestId: string;
};

export type AiCoverGenerateResult =
  | {
      ok: true;
      image: Blob;
      providerId: string;
      model?: string;
      generationVersion: string;
      createdAt: string;
    }
  | {
      ok: false;
      status: Exclude<AiCoverStatus, "completed" | "ready" | "preparing" | "generating">;
      error: string;
    };

export interface ImageGenerationProvider {
  readonly id: string;
  readonly label: string;
  /** True only when a real remote endpoint is configured. */
  readonly isConfigured: boolean;
  /** Human-readable policy URL or provider note for consent UI. */
  readonly privacyNote: string;
  generate(input: AiCoverGenerateInput): Promise<AiCoverGenerateResult>;
}
