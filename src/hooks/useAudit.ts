import { useState, useEffect, useCallback } from "react";
import { createAudit, getAuditRecommendations } from "@/lib/api/audit";
import { MOCK_AUDIT_DATA, MOCK_RECOMMENDATIONS } from "@/lib/mockAuditData";
import type { AuditResponse } from "@/types/audit";
import type { Recommendation } from "@/types/recommendation";

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

  const runAudit = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsFallback(false);
    setNeedsProfile(false);

    try {
      const companyId =
        typeof window !== "undefined" ? localStorage.getItem("company_id") || "" : "";

      const storedLinkedinData =
        typeof window !== "undefined" ? localStorage.getItem("linkedin_data") : null;

      // FIX: previously fell back to {} silently when linkedinData was
      // missing, which the Java AI service can't handle — it NPEs on
      // e.logo() when entreprise is null. An empty profile is a real
      // state to handle, not something to paper over with {}.
      if (!companyId || !storedLinkedinData) {
        setNeedsProfile(true);
        setLoading(false);
        return;
      }

      let linkedinData: unknown;
      try {
        linkedinData = JSON.parse(storedLinkedinData);
      } catch {
        setNeedsProfile(true);
        setLoading(false);
        return;
      }

      // Guard against parsed-but-still-empty entreprise too (e.g.
      // onboarding started but never actually filled in before saving).
      const entreprise = (linkedinData as { entreprise?: unknown })?.entreprise;
      if (!entreprise || Object.keys(entreprise as object).length === 0) {
        setNeedsProfile(true);
        setLoading(false);
        return;
      }

      const result = await createAudit({
        company_id: companyId,
        linkedin_data: linkedinData,
      });
      setAuditData(result);

      if (result?.id) {
        try {
          const recs = await getAuditRecommendations(result.id);
          setRecommendations(recs);
        } catch (recErr) {
          console.warn("Audit succeeded but fetching recommendations failed:", recErr);
          setRecommendations([]);
        }
      }
    } catch (err) {
      console.warn("Audit fetch failed, falling back to mock data:", err);
      setError(err instanceof Error ? err.message : "Failed to load audit data");
      setAuditData(MOCK_AUDIT_DATA);
      setRecommendations(MOCK_RECOMMENDATIONS);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runAudit();
  }, [runAudit]);

  return { auditData, recommendations, loading, error, isFallback, needsProfile, runAudit };
}