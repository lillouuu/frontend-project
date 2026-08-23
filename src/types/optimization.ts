// Confirmed against backend/schemas/optimizationschema.py.
// Real request is much simpler than what we guessed: just recommendation_id
// (a real UUID now, not a guessed resultat_audit object).

export interface OptimisationContexteEntreprise {
  nom: string;
  secteur: string;
  cible_client: string;
  services: string[];
  positionnement: string;
  ton_souhaite: string;
}

export interface OptimisationRequest {
  recommendation_id: string;
  type_element: string;
  contenu_actuel?: string | null;
  contexte_entreprise: OptimisationContexteEntreprise;
}

export interface OptimisationVariante {
  angle: string;
  contenu: string;
  explication: string;
}

export interface VarianteRecommandee {
  angle: string;
  raison: string;
}

// variantes/variante_recommandee are typed as plain `dict` in the real
// schema — same caution as audit's score_detail/analyse_ia. Shape below is
// our best inference from the cahier de passation examples.
export interface OptimisationResponse {
  id: string;
  recommendation_id: string;
  type_element: string;
  contenu_original: string | null;
  contexte_entreprise: OptimisationContexteEntreprise | null;
  variantes: { variantes: OptimisationVariante[] };
  variante_recommandee: VarianteRecommandee;
  marqueurs: string[] | null;
  faiblesses_corrigees: string[] | null;
  ameliorations_apportees: string[] | null;
  decision: string | null;
  contenu_final: string | null;
  created_at: string;
}

// The real accept/modify/reject feature (PATCH /api/ai/optimizations/decisions)
// — from the original cahier des charges, not built until now.
export type OptimizationDecision = "accept" | "modify" | "reject";

export interface OptimizationVerdict {
  optimization_id: string;
  decision: OptimizationDecision;
  prompt?: string | null;
}

export interface OptimizationDecisionRequest {
  verdicts: OptimizationVerdict[];
}

export interface OptimizationVerdictResult {
  optimization_id: string;
  decision: OptimizationDecision;
  status: "success" | "error";
  message: string;
  result: Record<string, unknown> | null;
}