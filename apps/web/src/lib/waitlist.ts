/**
 * Waitlist integration surface.
 * Enable with NEXT_PUBLIC_WAITLIST_ENABLED=true and NEXT_PUBLIC_WAITLIST_ENDPOINT.
 * Without those, the UI must not fake a successful signup.
 */
export const WAITLIST_ENABLED =
  process.env.NEXT_PUBLIC_WAITLIST_ENABLED === "true" &&
  Boolean(process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT?.trim());

export const WAITLIST_ENDPOINT =
  process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT?.trim() || "";

export type WaitlistResult =
  | { ok: true }
  | { ok: false; error: string; duplicate?: boolean };

export async function submitWaitlist(email: string): Promise<WaitlistResult> {
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (!WAITLIST_ENABLED || !WAITLIST_ENDPOINT) {
    return {
      ok: false,
      error: "The waitlist is not open yet. Please check back soon.",
    };
  }

  try {
    const res = await fetch(WAITLIST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalized, source: "atelier-web" }),
    });
    if (res.status === 409) {
      return {
        ok: false,
        duplicate: true,
        error: "This email is already on the waitlist.",
      };
    }
    if (!res.ok) {
      return { ok: false, error: "Could not join right now. Try again later." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Try again when you are online." };
  }
}
