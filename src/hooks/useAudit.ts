/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import {
  createAudit,
  getAuditsForCompany,
  getAudit,
  getAuditRecommendations,
} from "@/lib/api/audit";
import { MOCK_AUDIT_DATA, MOCK_RECOMMENDATIONS } from "@/lib/mockAuditData";
import { getCompanyData } from "@/lib/companyStorage";
import { ApiError } from "@/lib/apiClient";
import type { AuditResponse } from "@/types/audit";
import type { Recommendation } from "@/types/recommendation";

// Top-level helper (not redefined every render) — safe to call from any
// useCallback below without stale-closure concerns, since setRecommendations
// from useState has a stable identity across renders.
async function fetchRecommendationsSafely(
  auditId: string,
  setRecommendations: (recs: Recommendation[]) => void
) {
  try {
    const recs = await getAuditRecommendations(auditId);
    setRecommendations(recs);
  } catch (recErr) {
    console.warn("Audit loaded but fetching recommendations failed:", recErr);
    setRecommendations([]);
  }
}

// Shared by every page that needs audit data (Audit, Dashboard, Reports...).
export function useAudit() {
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  // Distinguishes "backend unreachable" (fine, show mock data) from "we
  // have nothing real to send" (not fine — sending {} crashes the Java
  // service with a NullPointerException on e.logo(), confirmed root cause).
  const [needsProfile, setNeedsProfile] = useState(false);

  // Reads + validates what's needed to create an audit. Returns null (and
  // sets needsProfile) if onboarding hasn't produced usable data yet.
  const getValidatedProfile = useCallback((): {
    companyId: string;
    linkedinData: unknown;
  } | null => {
    const companyId =
      typeof window !== "undefined" ? localStorage.getItem("company_id") || "" : "";
      // FIX: reads the company-scoped key instead of a single global one —
    // recovers real data after logout/login for the same company (logout
    // no longer wipes this, see lib/companyStorage.ts).
    const storedLinkedinData = getCompanyData("linkedin_data", companyId);

    if (!companyId || !storedLinkedinData) {
      setNeedsProfile(true);
      return null;
    }

    let linkedinData: unknown;
    try {
      linkedinData = JSON.parse(storedLinkedinData);
    } catch {
      setNeedsProfile(true);
      return null;
    }

    const entreprise = (linkedinData as { entreprise?: unknown })?.entreprise;
    if (!entreprise || Object.keys(entreprise as object).length === 0) {
      setNeedsProfile(true);
      return null;
    }

    return { companyId, linkedinData };
  }, []);

  // Explicit "create a brand-new audit" — wired to buttons that really mean
  // that: "New Audit", "Generate report", "Run your first audit". Always
  // POSTs a fresh audit (and a fresh Mistral call), even if one exists.
  const runAudit = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsFallback(false);
    setNeedsProfile(false);

    const profile = getValidatedProfile();
    if (!profile) {
      setLoading(false);
      return;
    }

    try {
      const result = await createAudit({
        company_id: profile.companyId,
        linkedin_data: profile.linkedinData,
      });
      setAuditData(result);
      if (result?.id) {
        await fetchRecommendationsSafely(result.id, setRecommendations);
      }
    } catch (err) {
      // FIX: plan/quota restrictions (403 — e.g. "Monthly quota reached
      // (5/5 audits)" on Découverte) used to fall into this same mock-data
      // fallback as a genuinely unreachable backend. That silently hid the
      // real reason behind a fake "here's sample data" success state —
      // exactly backwards, since a quota block is real, actionable
      // information the person needs to see, not something to paper over.
      if (err instanceof ApiError && err.status === 403) {
        console.warn("Audit blocked by plan/quota restriction:", err);
        setError(err.message);
        setIsFallback(false);
      } else {
        console.warn("Audit creation failed, falling back to mock data:", err);
        setError(err instanceof Error ? err.message : "Failed to load audit data");
        setAuditData(MOCK_AUDIT_DATA);
        setRecommendations(MOCK_RECOMMENDATIONS);
        setIsFallback(true);
      }
    } finally {
      setLoading(false);
    }
  }, [getValidatedProfile]);

  // FIX: this used to unconditionally call createAudit() (a POST) on every
  // mount — meaning every page visit fired a brand-new Mistral call and
  // discarded whatever audit you'd already seen. Now: show the most recent
  // EXISTING audit (GET /api/audits/company/{id}), and only auto-create the
  // very first one when the company genuinely has none yet.
  const loadLatestAudit = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsFallback(false);
    setNeedsProfile(false);

    const companyId =
      typeof window !== "undefined" ? localStorage.getItem("company_id") || "" : "";
    if (!companyId) {
      setNeedsProfile(true);
      setLoading(false);
      return;
    }

    try {
      const audits = await getAuditsForCompany(companyId);

      if (audits.length === 0) {
        // No audit exists yet for this company — create the first one
        // automatically (mirrors the cahier's "audit automatique" step
        // right after onboarding). runAudit manages its own loading state.
        await runAudit();
        return;
      }

      const latest = audits.reduce((a, b) =>
        new Date(a.created_at) > new Date(b.created_at) ? a : b
      );
      const full = await getAudit(latest.id);
      setAuditData(full);
      await fetchRecommendationsSafely(latest.id, setRecommendations);
      setLoading(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        console.warn("Loading audit blocked by plan/quota restriction:", err);
        setError(err.message);
        setIsFallback(false);
      } else {
        console.warn("Loading latest audit failed, falling back to mock data:", err);
        setError(err instanceof Error ? err.message : "Failed to load audit data");
        setAuditData(MOCK_AUDIT_DATA);
        setRecommendations(MOCK_RECOMMENDATIONS);
        setIsFallback(true);
      }
      setLoading(false);
    }
  }, [runAudit]);

  useEffect(() => {
    loadLatestAudit();
  }, [loadLatestAudit]);

  return {
    auditData,
    recommendations,
    loading,
    error,
    isFallback,
    needsProfile,
    runAudit, // explicit "create a new audit" — New Audit / Generate report buttons
    refresh: loadLatestAudit, // re-check for the latest existing audit — Try again button
  };
}