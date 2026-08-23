// Confirmed against backend/schemas/generationschema.py.
// Two real bugs fixed from what we had:
// 1. Request was missing `company_id` — the real GenerationCreate requires
//    it, our payload never sent it.
// 2. Response field is `marqueurs_a_completer` (proper snake_case), not
//    `marqueurs_acompleter` — this would have silently returned undefined
//    every time.

export interface GenerationBrief {
  sujet: string;
  objectif: string;
  message_cle?: string;
  elements_fournis?: Record<string, unknown>;
}

export interface ContexteEntreprise {
  nom: string;
  secteur: string;
  cible_client: string;
  services: string[];
  positionnement: string;
  ton_souhaite: string;
}

export interface GenerationRequest {
  company_id: string;
  type_contenu: string;
  brief: GenerationBrief;
  contexte_entreprise: ContexteEntreprise;
}

export interface GenerationVariante {
  angle: string;
  contenu: string;
  hashtags: string[];
  cta: string;
}

// variantes is typed as plain `dict` in the real schema (same pattern as
// audit/optimization) — inferred wrapped shape below based on how
// calendar.py constructs it: variantes={"variantes": [...]}.
export interface GenerationResponse {
  id: string;
  company_id: string;
  type_contenu: string;
  brief: GenerationBrief;
  variantes: { variantes: GenerationVariante[] };
  marqueurs_a_completer: string[] | null;
  created_at: string;
  titre_interne: string | null;
}