import { getCompanyData } from "@/lib/companyStorage";

// Mirrors the `entreprise` object saved by onboarding/company/page.tsx
// under the "onboarding_entreprise" key (namespaced per company_id via
// companyStorage.ts). Only listing the fields content generation needs —
// the onboarding blob also has slogan, description, coordonnees, cta, etc.
// which aren't relevant here.
interface OnboardingEntreprise {
  nom: string;
  secteur: string | null;
  services: string[];
}

export interface StoredCompanyContext {
  nom: string;
  secteur: string;
  services: string[];
}

const FALLBACK: StoredCompanyContext = {
  nom: "",
  secteur: "",
  services: [],
};

export function getStoredCompanyContext(): StoredCompanyContext {
  if (typeof window === "undefined") return FALLBACK;

  const companyId = localStorage.getItem("company_id");
  if (!companyId) return FALLBACK;

  const raw = getCompanyData("onboarding_entreprise", companyId);
  if (!raw) return FALLBACK;

  try {
    const entreprise: OnboardingEntreprise = JSON.parse(raw);
    return {
      nom: entreprise.nom ?? "",
      // NOTE: onboarding's Step 2 form currently always writes secteur as
      // null (no input field for it exists yet). This will come back as
      // "" until that's added — flagging so it doesn't look like a bug here.
      secteur: entreprise.secteur ?? "",
      services: Array.isArray(entreprise.services) ? entreprise.services : [],
    };
  } catch (err) {
    console.warn("Failed to parse onboarding_entreprise from localStorage:", err);
    return FALLBACK;
  }
}