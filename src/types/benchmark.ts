// Matches backend/schemas/benchmarkschema.py exactly, plus the real
// `resultat` shape produced by backend/services/benchmark.py's
// build_benchmark() — confirmed by reading that function directly, not
// guessed. Comparable criteria come from BENCHMARK_CRITERIA in that same
// file: frequence_publication, engagement, strategie_editoriale, branding,
// positionnement, mots_cles.

export interface BenchmarkCreate {
  company_id: string;
  audit_ids: string[]; // audits belonging to OTHER companies under your account
}

export interface BenchmarkCriterionScore {
  libelle: string;
  entreprise: number | null; // your score for this criterion, 0-100
  moyenne_concurrents: number | null; // average of selected competitors, 0-100
}

export interface BenchmarkRecommandation {
  priorite: "CRITIQUE" | "IMPORTANTE" | "OPTIMISATION" | string;
  action: string;
  raison: string;
}

export interface BenchmarkResultat {
  score_benchmark: number | null;
  scores_par_critere: Record<string, BenchmarkCriterionScore>;
  points_forts: string[];
  points_faibles: string[];
  recommandations: BenchmarkRecommandation[];
}

export interface BenchmarkResponse {
  id: string;
  company_id: string;
  audit_ids: string[];
  resultat: BenchmarkResultat;
  created_at: string;
}