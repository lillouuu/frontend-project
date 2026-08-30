import { useState, useEffect, useCallback } from "react";
import {
  getAuditsForCompany,
  getAuditRecommendations,
  getAuditOptimizations,
} from "@/lib/api/audit";
import { getCompanyData } from "@/lib/companyStorage";
import { MOCK_DASHBOARD_DATA } from "@/lib/mockDashboardData";
import type { DashboardResponse, PublicationMetrics } from "@/types/dashboard";

// FIX: this hook used to call a dashboard-specific endpoint
// (GET /api/companies/{id}/dashboard) that was never actually built on the
// backend — confirmed directly against the live Swagger UI, which has no
// dashboard route at all. That's why every visit fell back to mock data
// with a 404 underneath it.
//
// Every field DashboardResponse needs turns out to be derivable from
// endpoints that DO exist:
//   - score_evolution / linkedin_score  <- GET /api/audits/company/{id}
//   - recommendations_priority          <- GET /api/audits/{id}/recommendations
//   - optimization_progression          <- GET /api/audits/{id}/optimizations
//   - engagement / publication_frequency <- linkedin_data already in localStorage
// So instead of one endpoint, this composes those four real sources.

// FIX: linkedin_data is namespaced per company_id via companyStorage.ts
// (see onboarding/manager/page.tsx) — this used to read the old plain
// global key directly, which nothing writes to anymore, so engagement
// always silently computed as all zeros.
function computeEngagement(companyId: string): { engagement: PublicationMetrics; publication_frequency: number } {
  const empty: PublicationMetrics = {
    total_publications: 0,
    total_reactions: 0,
    total_comments: 0,
    total_shares: 0,
    avg_engagement: 0,
  };

  const stored = getCompanyData("linkedin_data", companyId);
  if (!stored) return { engagement: empty, publication_frequency: 0 };

  try {
    const parsed = JSON.parse(stored) as {
      entreprise?: {
        publications?: Array<{ reactions?: number; commentaires?: number; partages?: number }>;
      };
    };
    const pubs = parsed?.entreprise?.publications ?? [];
    const total_publications = pubs.length;
    const total_reactions = pubs.reduce((sum, p) => sum + (p.reactions ?? 0), 0);
    const total_comments = pubs.reduce((sum, p) => sum + (p.commentaires ?? 0), 0);
    const total_shares = pubs.reduce((sum, p) => sum + (p.partages ?? 0), 0);
    const avg_engagement =
      total_publications > 0
        ? Math.round(((total_reactions + total_comments + total_shares) / total_publications) * 10) / 10
        : 0;

    return {
      engagement: { total_publications, total_reactions, total_comments, total_shares, avg_engagement },
      publication_frequency: total_publications,
    };
  } catch {
    return { engagement: empty, publication_frequency: 0 };
  }
}

export function useDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsFallback(false);
    setNeedsProfile(false);

    const companyId = typeof window !== "undefined" ? localStorage.getItem("company_id") : null;
    if (!companyId) {
      setNeedsProfile(true);
      setLoading(false);
      return;
    }

    try {
      const audits = await getAuditsForCompany(companyId);
      const sorted = [...audits].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      const latest = sorted[sorted.length - 1] ?? null;
      const earliest = sorted[0] ?? null;

      const score_evolution = sorted.map((a) => ({
        date: a.created_at,
        score_global: a.score_global,
        score_entreprise: a.score_entreprise,
        score_dirigeant: a.score_dirigeant,
      }));

      const [recs, opts] = latest
        ? await Promise.all([
            getAuditRecommendations(latest.id).catch(() => []),
            getAuditOptimizations(latest.id).catch(() => []),
          ])
        : [[], []];

      const recommendations_priority = {
        critique: recs.filter((r) => r.priorite === "CRITIQUE").length,
        importante: recs.filter((r) => r.priorite === "IMPORTANTE").length,
        optimisation: recs.filter((r) => r.priorite === "OPTIMISATION").length,
      };

      const optimization_progression = {
        total: opts.length,
        accepted: opts.filter((o) => o.decision === "accept").length,
        modified: opts.filter((o) => o.decision === "modify").length,
        rejected: opts.filter((o) => o.decision === "reject").length,
        pending: opts.filter((o) => !o.decision).length,
      };

      const decided =
        optimization_progression.accepted +
        optimization_progression.modified +
        optimization_progression.rejected;

      const { engagement, publication_frequency } = computeEngagement(companyId);

      setData({
        company_id: companyId,
        linkedin_score: latest?.score_global ?? null,
        score_evolution,
        engagement,
        publication_frequency,
        recommendations_priority,
        optimization_progression,
        objectives_tracking: {
          score_improvement:
            latest && earliest && sorted.length > 1
              ? latest.score_global - earliest.score_global
              : null,
          total_recommendations: recs.length,
          total_optimizations: opts.length,
          completion_rate: opts.length > 0 ? decided / opts.length : 0,
        },
      });
    } catch (err) {
      console.warn("Dashboard fetch failed, falling back to mock data:", err);
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
      setData(MOCK_DASHBOARD_DATA);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, isFallback, needsProfile, reload: load };
}