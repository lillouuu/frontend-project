// Namespaces localStorage keys by company_id instead of one global key.
// Why: slogan/description/services/bio/etc. have no database column at
// all (see onboarding pages) — they only ever live in localStorage. Logout
// deliberately clears session data so a different user on the same browser
// doesn't inherit someone else's business data — but that also nuked this
// company-specific info on every logout, even for the SAME account logging
// back in. Namespacing by the real, stable company_id UUID fixes that:
// logging back into the same company recovers the data; logging into a
// different company still starts clean.
//
// This does NOT survive clearing browser data, a different device, or a
// different browser — only a real backend field for these fields would
// fully solve that. This is a frontend-only mitigation.

export function getCompanyData(base: string, companyId: string): string | null {
  if (typeof window === "undefined" || !companyId) return null;
  return localStorage.getItem(`${base}:${companyId}`);
}

export function setCompanyData(base: string, companyId: string, value: string): void {
  if (typeof window === "undefined" || !companyId) return;
  localStorage.setItem(`${base}:${companyId}`, value);
}