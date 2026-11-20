const KEY = "atelier.ai-cover.consent.v1";

export type AiCoverConsentRecord = {
  acceptedAt: string;
  providerId: string;
};

export function getAiCoverConsent(): AiCoverConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AiCoverConsentRecord;
    if (!parsed?.acceptedAt || !parsed?.providerId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setAiCoverConsent(providerId: string): AiCoverConsentRecord {
  const record: AiCoverConsentRecord = {
    acceptedAt: new Date().toISOString(),
    providerId,
  };
  localStorage.setItem(KEY, JSON.stringify(record));
  return record;
}

export function clearAiCoverConsent(): void {
  localStorage.removeItem(KEY);
}
