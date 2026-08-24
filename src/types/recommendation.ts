// Matches backend/schemas/recommendationschema.py -> RecommendationResponse.
// Recommendations are a separate resource fetched via
// GET /api/audits/{auditId}/recommendations — not nested inside
// AuditResponse.analyse_ia.

// The backend enum (backend/models/recommendation.py -> RecommendationPriority)
// wasn't available when this was written. These are the values seen in the
// cahier de passation and in the audit page's existing filter/badge logic.
// If you get that model file, swap this for the real literal values.
export type RecommendationPriority = "CRITIQUE" | "IMPORTANTE" | "OPTIMISATION" | string;

export interface Recommendation {
  id: string;
  audit_id: string;
  critere_code: string;
  categorie: string;
  priorite: RecommendationPriority;
  action: string;
  raison: string;
}