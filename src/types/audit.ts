// Matches backend/schemas/auditschema.py exactly. The backend flattens
// score_global/score_entreprise/score_dirigeant/dirigeant_present onto the
// response directly (not nested under a "score" object like the raw AI
// module's output in the cahier de passation) and returns recommendations
// as a separate resource — see types/recommendation.ts.

export interface SousScoreCategorie {
  code: string;
  libelle: string;
  obtenu: number;
  max: number;
  pourcentage: number;
  evaluee: boolean;
}

// Backend types this as a plain `dict` (Pydantic doesn't constrain it), so
// this shape is inferred from what audit/page.tsx, dashboard/page.tsx, and
// mockAuditData.ts already assume: score_detail.sous_scores_categories.
export interface ScoreDetail {
  sous_scores_categories: SousScoreCategorie[];
}

export interface Evaluation {
  categorie: string;
  critere: string;
  niveau: string;
  preuve: string;
  justification: string;
}

// Backend types this as a plain `dict` too. No `recommandations` field —
// those come from GET /api/audits/{id}/recommendations instead
// (see types/recommendation.ts).
export interface AnalyseIA {
  evaluations: Evaluation[];
  points_forts: string[];
  points_faibles: string[];
  synthese: string;
}

// Matches backend/schemas/auditschema.py -> AuditResponse
export interface AuditResponse {
  id: string;
  company_id: string;
  score_global: number;
  score_entreprise: number;
  score_dirigeant: number | null;
  dirigeant_present: boolean;
  score_detail: ScoreDetail;
  analyse_ia: AnalyseIA;
  created_at: string;
}

// Matches backend/schemas/auditschema.py -> AuditListResponse
// (lighter version for list views — no score_detail/analyse_ia)
export interface AuditListResponse {
  id: string;
  company_id: string;
  score_global: number;
  score_entreprise: number;
  score_dirigeant: number | null;
  dirigeant_present: boolean;
  created_at: string;
}

// Matches backend/schemas/auditschema.py -> AuditCreate
export interface AuditRequest {
  company_id: string;
  linkedin_data: unknown;
}