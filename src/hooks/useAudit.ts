import { useState, useEffect, useCallback } from "react";
import { createAudit, getAuditRecommendations } from "@/lib/api/audit";
import { MOCK_AUDIT_DATA, MOCK_RECOMMENDATIONS } from "@/lib/mockAuditData";
import type { AuditResponse } from "@/types/audit";
import type { Recommendation } from "@/types/recommendation";

// Shared by every page that needs audit data (Audit, Dashboard, Reports...).
// Now fetches TWO things: the audit itself, and its recommendations
// (a separate real entity per the confirmed backend schema — no longer
// embedded in the audit response).
export function useAudit() {
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const runAudit = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsFallback(false);
    try {
      const companyId =
        typeof window !== "undefined" ? localStorage.getItem("company_id") || "" : "";

      const storedLinkedinData =
        typeof window !== "undefined" ? localStorage.getItem("linkedin_data") : null;
      const linkedinData = storedLinkedinData ? JSON.parse(storedLinkedinData) : {};

      const result = await createAudit({
        company_id: companyId,
        linkedin_data: linkedinData,
      });
      setAuditData(result);

      // Fetch recommendations separately now that they're their own entity.
      // If this second call fails but the audit itself succeeded, don't
      // throw away the real audit data — just fall back to empty
      // recommendations rather than mock data for the whole page.
      try {
        const recs = await getAuditRecommendations(result.id);
        setRecommendations(recs);
      } catch (recErr) {
        console.warn("Audit succeeded but fetching recommendations failed:", recErr);
        setRecommendations([]);
      }
    } catch (err) {
      console.warn("Audit fetch failed, falling back to mock data:", err);
      setError(err instanceof Error ? err.message : "Failed to load audit data");
      setAuditData(MOCK_AUDIT_DATA); // remove this fallback once the backend is reliably reachable
      setRecommendations(MOCK_RECOMMENDATIONS);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runAudit();
  }, [runAudit]);

  return { auditData, recommendations, loading, error, isFallback, runAudit };
}