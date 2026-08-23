// Matches exactly what the /api/audits endpoint returns
// (see cahier de passation, section 3.1 — Test A1 / A2)

export interface SousScoreCategorie {
  code: string;
  libelle: string;
  obtenu: number;
  max: number;
  pourcentage: number;
  evaluee: boolean;
}

export interface AuditScore {
  score_global: number;
  score_entreprise: number;
  score_dirigeant: number;
  dirigeant_present: boolean;
  sous_scores_categories: SousScoreCategorie[];
}

export interface Evaluation {
  categorie: string;
  critere: string;
  niveau: string;
  preuve: string;
  justification: string;
}

export interface Recommandation {
  priorite: "CRITIQUE" | "IMPORTANTE" | "OPTIMISATION" | "CRITICAL";
  action: string;
  raison: string;
}

export interface AnalyseIA {
  evaluations: Evaluation[];
  points_forts: string[];
  points_faibles: string[];
  recommandations: Recommandation[];
  synthese: string;
}

// The full shape your Audit page needs — exactly what AUDIT_DATA was hardcoded to
export interface AuditResponse {
  score: AuditScore;
  analyse_ia: AnalyseIA;
}

// What you send TO /api/audits (per the Swagger screenshot: company_id + linkedin_data)
// linkedin_data is the full extraction JSON from the cahier de passation section 1.1 —
// left as `unknown` here since your frontend won't build that payload by hand,
// it'll come from wherever the LinkedIn connection/extraction step hands it to you.
export interface AuditRequest {
  company_id: string;
  linkedin_data: unknown;
}