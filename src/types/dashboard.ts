// CORRECTION: the original comment here claimed this was "confirmed against
// backend/schemas/dashboardschema.py" via a real GET /api/companies/{id}/dashboard
// endpoint. That endpoint does not exist — confirmed directly against the live
// Swagger UI, which only has audit/optimization/generation routes under "ai"
// plus company/executive/user/account CRUD. There is no dashboard-specific
// endpoint anywhere on the backend.
//
// This shape is now composed client-side in hooks/useDashboard.ts from real,
// confirmed endpoints instead: GET /api/audits/company/{id} (score history),
// GET /api/audits/{id}/recommendations (priority counts), and
// GET /api/audits/{id}/optimizations (progress counts) — plus engagement
// numbers computed from the linkedin_data already sitting in localStorage.
// The shape itself was solid and worth keeping; only its data source was wrong.

export interface ScoreEvolution {
  date: string;
  score_global: number;
  score_entreprise: number;
  score_dirigeant: number | null;
}

export interface PublicationMetrics {
  total_publications: number;
  total_reactions: number;
  total_comments: number;
  total_shares: number;
  avg_engagement: number;
}

export interface RecommendationsPriority {
  critique: number;
  importante: number;
  optimisation: number;
}

export interface OptimizationProgression {
  total: number;
  accepted: number;
  modified: number;
  rejected: number;
  pending: number;
}

export interface ObjectivesTracking {
  score_improvement: number | null;
  total_recommendations: number;
  total_optimizations: number;
  completion_rate: number;
}

export interface DashboardResponse {
  company_id: string;
  linkedin_score: number | null;
  score_evolution: ScoreEvolution[];
  engagement: PublicationMetrics;
  publication_frequency: number;
  recommendations_priority: RecommendationsPriority;
  optimization_progression: OptimizationProgression;
  objectives_tracking: ObjectivesTracking;
}