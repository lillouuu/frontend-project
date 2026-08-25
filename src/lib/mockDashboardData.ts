import type { DashboardResponse } from "@/types/dashboard";

export const MOCK_DASHBOARD_DATA: DashboardResponse = {
  company_id: "mock-company-id",
  linkedin_score: 58,
  score_evolution: [
    { date: new Date(Date.now() - 60 * 86400000).toISOString(), score_global: 41, score_entreprise: 45, score_dirigeant: 30 },
    { date: new Date(Date.now() - 30 * 86400000).toISOString(), score_global: 49, score_entreprise: 52, score_dirigeant: 45 },
    { date: new Date().toISOString(), score_global: 58, score_entreprise: 50, score_dirigeant: 78 },
  ],
  engagement: {
    total_publications: 4,
    total_reactions: 62,
    total_comments: 9,
    total_shares: 3,
    avg_engagement: 3.2,
  },
  publication_frequency: 4,
  recommendations_priority: { critique: 1, importante: 1, optimisation: 1 },
  optimization_progression: { total: 0, accepted: 0, modified: 0, rejected: 0, pending: 0 },
  objectives_tracking: {
    score_improvement: 17,
    total_recommendations: 3,
    total_optimizations: 0,
    completion_rate: 0,
  },
};