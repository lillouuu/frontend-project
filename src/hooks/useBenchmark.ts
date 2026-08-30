import { useState, useEffect, useCallback } from "react";
import { getMyCompanies } from "@/lib/api/company";
import { getAuditsForCompany } from "@/lib/api/audit";
import { createBenchmark } from "@/lib/api/benchmark";
import type { BenchmarkResponse } from "@/types/benchmark";

export interface BenchmarkCandidate {
  id: string;
  name: string;
  latestAuditId: string | null; // null = no completed audit yet, not selectable as a competitor
}

// A "competitor" here is NOT a real external LinkedIn page — there is no
// lookup capability anywhere in this system for that. It's literally
// another company under YOUR OWN account with its own completed audit
// (confirmed directly against backend/routers/ai.py's create_benchmark,
// which 403s on any audit whose company doesn't share your account_id).
export function useBenchmark() {
  const [candidates, setCandidates] = useState<BenchmarkCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Defaults to whatever company_id is currently active, but stays
  // independently overridable — re-running onboarding to create a test
  // company silently changes the global company_id pointer, so this must
  // not be blindly trusted as "yours" forever.
  const [yourCompanyId, setYourCompanyId] = useState<string | null>(null);

  const [result, setResult] = useState<BenchmarkResponse | null>(null);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const companies = await getMyCompanies();

      const withAuditStatus = await Promise.all(
        companies.map(async (c) => {
          const audits = await getAuditsForCompany(c.id).catch(() => []);
          // get_company_audits already orders desc by created_at server-side,
          // but sort defensively rather than trust that blindly.
          const sorted = [...audits].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          return {
            id: c.id,
            name: c.name,
            latestAuditId: sorted[0]?.id ?? null,
          };
        })
      );

      setCandidates(withAuditStatus);

      const currentCompanyId =
        typeof window !== "undefined" ? localStorage.getItem("company_id") : null;
      const stillExists = withAuditStatus.some((c) => c.id === currentCompanyId);
      setYourCompanyId(stillExists ? currentCompanyId : withAuditStatus[0]?.id ?? null);
    } catch (err) {
      console.warn("Loading companies for benchmark failed:", err);
      setError(err instanceof Error ? err.message : "Failed to load companies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const runBenchmark = useCallback(
    async (competitorCompanyIds: string[]) => {
      if (!yourCompanyId) {
        setRunError("Select which company is yours first.");
        return;
      }

      const competitorAuditIds = competitorCompanyIds
        .map((id) => candidates.find((c) => c.id === id)?.latestAuditId)
        .filter((id): id is string => Boolean(id));

      if (competitorAuditIds.length === 0) {
        setRunError("Selected competitors have no completed audit yet.");
        return;
      }

      setRunning(true);
      setRunError(null);
      setResult(null);
      try {
        const benchmark = await createBenchmark({
          company_id: yourCompanyId,
          audit_ids: competitorAuditIds,
        });
        setResult(benchmark);
      } catch (err) {
        setRunError(err instanceof Error ? err.message : "Benchmark failed");
      } finally {
        setRunning(false);
      }
    },
    [yourCompanyId, candidates]
  );

  return {
    candidates,
    loading,
    error,
    yourCompanyId,
    setYourCompanyId,
    result,
    running,
    runError,
    runBenchmark,
    reload: load,
  };
}