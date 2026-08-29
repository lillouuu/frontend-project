"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Wand2,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Pencil,
  Star,
  Sparkles,
  ArrowRight,
  Info,
  Building2,
  Target,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { useOptimization } from "@/hooks/useOptimization";

// TEMPORARY FRONTEND WORKAROUND — not a real fix. The backend's critere_code
// matching (ai.py create_audit) can only succeed if the AI module's raw
// recommendation objects carry a critere_code/critere/categorie field (they
// never do — confirmed against real audit output, which only has
// priorite/action/raison) or if evaluations count exactly equals
// recommendations count (also essentially never true). Net effect:
// critere_code comes back empty for every recommendation from every audit.
// This has been reported to the backend team. Until it's fixed there, this
// guesses the likely type_element from the recommendation's own action/raison
// text instead of defaulting blindly to "slogan" every time. It's a guess,
// clearly labeled as one in the UI — remove this once critere_code works.
function guessTypeElementFromText(action: string | null, raison: string | null): string | null {
  const text = `${action ?? ""} ${raison ?? ""}`.toLowerCase();
  const mentionsDirigeant = text.includes("dirigeant");

  if (mentionsDirigeant && (text.includes("résumé") || text.includes("resume") || text.includes("bio"))) {
    return "resume_dirigeant";
  }
  if (mentionsDirigeant && (text.includes("titre") || text.includes("poste") || text.includes("fonction"))) {
    return "titre_dirigeant";
  }
  if (text.includes("slogan")) {
    return "slogan";
  }
  if (text.includes("description")) {
    return "description_entreprise";
  }
  return null; // no confident guess — let the existing default ("slogan") stand
}

export default function OptimizationPage() {
  const searchParams = useSearchParams();

  // --- Champs du corps de la requête POST /api/ai/optimizations ---
  // recommendation_id and type_element now come directly from the Audit
  // page's real recommendation (id + critere_code) — no more guessing
  // from keyword-matching text.
  const [recommendationId, setRecommendationId] = useState<string | null>(null);
  const [typeElement, setTypeElement] = useState("slogan");
  const [contenuActuel, setContenuActuel] = useState("");
  const [tonSouhaite, setTonSouhaite] = useState("professionnel");
  const [actionText, setActionText] = useState<string | null>(null);
  const [raisonText, setRaisonText] = useState<string | null>(null);

  // FIX: this used to be hardcoded to the cahier's example company
  // ("Nexalys Conseil") — every real optimization would've silently
  // submitted fake company data instead of the logged-in user's actual
  // company. Now pulled from the same linkedin_data already used by
  // useAudit/useDashboard. cible_client and positionnement have no real
  // source in the onboarding data, so those stay empty (placeholder hint
  // text only) rather than fake values.
  const [contexte, setContexte] = useState(() => {
    if (typeof window === "undefined") {
      return { nom: "", secteur: "", cible_client: "", services: "", positionnement: "" };
    }
    try {
      const stored = localStorage.getItem("linkedin_data");
      const entreprise = stored ? JSON.parse(stored)?.entreprise : null;
      return {
        nom: entreprise?.nom ?? "",
        secteur: entreprise?.secteur ?? "",
        cible_client: "",
        services: Array.isArray(entreprise?.services) ? entreprise.services.join(", ") : "",
        positionnement: "",
      };
    } catch {
      return { nom: "", secteur: "", cible_client: "", services: "", positionnement: "" };
    }
  });

  const [cameFromAudit, setCameFromAudit] = useState(false);
  // True when we arrived from a real recommendation but had to guess
  // type_element ourselves because critere_code came back empty (backend
  // bug — see guessTypeElementFromText above). Shown in the UI so this
  // never looks like a silent, confident auto-selection.
  const [guessedTypeElement, setGuessedTypeElement] = useState(false);

  useEffect(() => {
    const recId = searchParams.get("recommendation_id");
    const critereCode = searchParams.get("critere_code");
    const action = searchParams.get("action");
    const raison = searchParams.get("raison");

    if (!recId) return;

    // FIX: OptimizationCreate (backend schema) never asks the frontend for
    // critere_code at all — the backend looks it up itself from the
    // Recommendation row via recommendation_id. So an empty critere_code
    // should never block submission; recommendation_id is the only thing
    // that's actually required.
    setRecommendationId(recId);
    setActionText(action);
    setRaisonText(raison);
    setContenuActuel(""); // no original content available from the audit — mode création
    setCameFromAudit(true);

    if (critereCode) {
      setTypeElement(critereCode);
      setGuessedTypeElement(false);
    } else {
      const guess = guessTypeElementFromText(action, raison);
      if (guess) {
        setTypeElement(guess);
        setGuessedTypeElement(true);
      }
      // no confident guess — typeElement stays at its "slogan" default,
      // and the UI below makes clear this wasn't matched, guessed, or
      // confirmed, so the user knows to check it manually.
    }
  }, [searchParams]);

  // --- États pour l'affichage de l'interface ---
  const [copiedAngle, setCopiedAngle] = useState<string | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [modifyPromptFor, setModifyPromptFor] = useState<string | null>(null);
  const [modifyPromptText, setModifyPromptText] = useState("");
  const {
    data,
    loading,
    isFallback,
    run,
    submitDecision,
    decisionSubmitting,
    decisionError,
    decisionSuccess,
  } = useOptimization();

  // variantes is a wrapped dict per the real schema — { variantes: [...] }
  const currentVariant = data?.variantes.variantes[selectedVariantIndex];

  const handleCopy = (text: string, angle: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAngle(angle);
    setTimeout(() => setCopiedAngle(null), 2000);
  };

  const handleRunOptimization = async () => {
    if (!recommendationId) {
      // Optimization requires a real recommendation_id from the backend —
      // can't run standalone without one (unlike before, when we faked one).
      return;
    }
    setSelectedVariantIndex(0);
    await run({
      recommendation_id: recommendationId,
      type_element: typeElement,
      contenu_actuel: contenuActuel,
      contexte_entreprise: {
        nom: contexte.nom,
        secteur: contexte.secteur,
        cible_client: contexte.cible_client,
        services: contexte.services.split(",").map((s: string) => s.trim()),
        positionnement: contexte.positionnement,
        ton_souhaite: tonSouhaite,
      },
    });
  };

  const handleDecision = async (decision: "accept" | "modify" | "reject", prompt?: string) => {
    if (!data) return;
    await submitDecision({
      optimization_id: data.id,
      decision,
      prompt: prompt || undefined,
    });
    setModifyPromptFor(null);
    setModifyPromptText("");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-sans text-slate-800">
      {/* En-tête de la page */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Optimisation IA du Profil & de la Page
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Transformez vos champs LinkedIn peu performants en textes à forte conversion grâce à des angles stratégiques personnalisés.
          </p>
          {isFallback && (
            <span className="mt-2 inline-block rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
              Showing sample data — backend unreachable
            </span>
          )}
        </div>
        <Link
          href="/content"
          className="inline-flex items-center gap-2 rounded-xl bg-[#4a7aa8] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#3f6a94]"
        >
          Suivant : Générer du Contenu <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Bannière de la recommandation d'audit (si venu depuis l'Audit) */}
      {cameFromAudit && (
        <div className="mb-6 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 shadow-sm flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px]">
                Depuis l'audit — Recommandation
              </span>
              <span className="rounded bg-amber-200/60 px-1.5 py-0.5 text-[10px] font-mono text-amber-800">
                {typeElement}
              </span>
            </div>
            {actionText && <p className="mt-1 font-medium text-amber-900">{actionText}</p>}
            {raisonText && <p className="mt-1 text-amber-800/90">{raisonText}</p>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Colonne Gauche : Paramètres et Contexte Entreprise (Données POST) */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Target className="h-4 w-4 text-[#4a7aa8]" /> Paramètres d'Optimisation
            </h2>

            {/* Type d'élément */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Type Élément <span className="text-red-500">*</span>
                {guessedTypeElement && (
                  <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-amber-600">
                    Estimé — vérifiez
                  </span>
                )}
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  { id: "slogan", label: "Slogan" },
                  { id: "description_entreprise", label: "Description" },
                  { id: "titre_dirigeant", label: "Titre Exécutif" },
                  { id: "resume_dirigeant", label: "À propos / Bio" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTypeElement(item.id)}
                    className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all ${
                      typeElement === item.id
                        ? "border-[#4a7aa8] bg-[#4a7aa8]/10 text-[#4a7aa8]"
                        : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu Actuel (Gère le mode création si vide) */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Contenu Actuel
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  {contenuActuel.trim() === "" ? "Mode Création" : "Mode Amélioration"}
                </span>
              </div>
              <textarea
                rows={3}
                placeholder="Laissez vide pour créer un nouveau contenu (Mode Création)..."
                value={contenuActuel}
                onChange={(e) => setContenuActuel(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 outline-none focus:border-[#4a7aa8] focus:bg-white transition-all"
              />
            </div>

            {/* Ton Souhaité */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Ton Souhaité
              </label>
              <select
                value={tonSouhaite}
                onChange={(e) => setTonSouhaite(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700 outline-none focus:border-[#4a7aa8] focus:bg-white transition-all"
              >
                <option value="professionnel">Professionnel (Par défaut)</option>
                <option value="engageant">Engageant & Dynamique</option>
                <option value="autoritaire">Expert & Autoritaire</option>
                <option value="accessible">Inspirant & Accessible</option>
              </select>
            </div>

            <hr className="border-slate-100" />

            {/* Contexte Entreprise (Champs obligatoires) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-[#4a7aa8]" /> Contexte Entreprise <span className="text-red-500">*</span>
              </h3>

              <div>
                <label className="text-[11px] text-slate-500 font-medium">Nom de l'entreprise</label>
                <input
                  type="text"
                  value={contexte.nom}
                  onChange={(e) => setContexte({ ...contexte, nom: e.target.value })}
                  className="mt-0.5 w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-700 outline-none focus:border-[#4a7aa8]"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 font-medium">Secteur d'activité</label>
                <input
                  type="text"
                  value={contexte.secteur}
                  onChange={(e) => setContexte({ ...contexte, secteur: e.target.value })}
                  className="mt-0.5 w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-700 outline-none focus:border-[#4a7aa8]"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 font-medium">Cible client</label>
                <input
                  type="text"
                  value={contexte.cible_client}
                  onChange={(e) => setContexte({ ...contexte, cible_client: e.target.value })}
                  className="mt-0.5 w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-700 outline-none focus:border-[#4a7aa8]"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 font-medium">Services (séparés par des virgules)</label>
                <input
                  type="text"
                  value={contexte.services}
                  onChange={(e) => setContexte({ ...contexte, services: e.target.value })}
                  className="mt-0.5 w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-700 outline-none focus:border-[#4a7aa8]"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 font-medium">Positionnement</label>
                <input
                  type="text"
                  value={contexte.positionnement}
                  onChange={(e) => setContexte({ ...contexte, positionnement: e.target.value })}
                  className="mt-0.5 w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-700 outline-none focus:border-[#4a7aa8]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunOptimization}
              disabled={loading || !recommendationId}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#4a7aa8] py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#3f6a94] disabled:opacity-50"
            >
              <Wand2 className="h-4 w-4" />
              {loading ? "Génération en cours..." : "Lancer l'Optimisation"}
            </button>
            {!recommendationId && (
              <p className="text-center text-[11px] text-slate-400">
                Ouvrez cette page depuis une recommandation d'audit (bouton "Apply this fix")
                pour lancer une optimisation réelle.
              </p>
            )}
            {recommendationId && guessedTypeElement && (
              <p className="text-center text-[11px] text-amber-600">
                Type élément estimé à partir du texte de la recommandation (critere_code
                manquant côté backend — signalé à l&apos;équipe). Vérifiez ci-dessus avant
                de lancer.
              </p>
            )}
          </div>
        </div>

        {/* Colonne Droite : Résultats (3 Variantes + Recommandation) */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {data && currentVariant ? (
            <>
              {/* Carte de la Variante Recommandée */}
              <div className="rounded-2xl border border-[#4a7aa8]/30 bg-[#4a7aa8]/5 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4a7aa8]">
                  <Star className="h-4 w-4 fill-[#4a7aa8]" />
                  Variante Recommandée par l'IA :{" "}
                  <span className="underline">{data.variante_recommandee.angle}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-700">
                  {data.variante_recommandee.raison}
                </p>
              </div>

              {/* Onglets de sélection des variantes */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                {data.variantes.variantes.map((v, idx) => {
                  const isRec = v.angle === data.variante_recommandee.angle;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                        selectedVariantIndex === idx
                          ? "bg-[#4a7aa8] text-white shadow-sm"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span>Variante {idx + 1}</span>
                      {isRec && (
                        <span className="rounded bg-amber-400 px-1 py-0.2 text-[9px] font-extrabold text-slate-900 uppercase">
                          Top
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Notification pour les marqueurs/placeholders */}
              {(data.marqueurs?.length ?? 0) > 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs text-sky-800">
                  <Info className="h-4 w-4 flex-shrink-0 text-sky-600" />
                  <span>
                    Marqueurs à personnaliser dans le texte :{" "}
                    <strong>{data.marqueurs?.join(", ")}</strong>
                  </span>
                </div>
              )}

              {/* Contenu de la variante active */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Angle stratégique
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 capitalize">
                      {currentVariant.angle}
                    </h4>
                  </div>

                  <button
                    onClick={() => handleCopy(currentVariant.contenu, currentVariant.angle)}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-slate-800"
                  >
                    {copiedAngle === currentVariant.angle ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copiedAngle === currentVariant.angle ? "Copié !" : "Copier la variante"}
                  </button>
                </div>

                {/* Texte généré */}
                <div className="rounded-xl bg-slate-50/70 p-4 border border-slate-100 text-xs leading-relaxed text-slate-800 whitespace-pre-line font-sans">
                  {currentVariant.contenu}
                </div>

                {/* Explication stratégique & SEO */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-[#4a7aa8]" /> Explication & SEO :
                  </span>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {currentVariant.explication}
                  </p>
                </div>
              </div>

              {/* Liste des améliorations apportées */}
              <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Améliorations Apportées
                </h3>
                <ul className="mt-3 space-y-2 text-xs text-emerald-900/80">
                  {(data.ameliorations_apportees ?? []).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Décision : accepter / modifier / rejeter — PATCH /api/ai/optimizations/decisions */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
                  Que faire de cette optimisation ?
                </h3>

                {data.decision ? (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Décision déjà enregistrée : {data.decision}
                  </div>
                ) : (
                  <>
                    {modifyPromptFor === data.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={modifyPromptText}
                          onChange={(e) => setModifyPromptText(e.target.value)}
                          placeholder="Décrivez ce qu'il faut changer..."
                          className="w-full rounded-lg border border-slate-200 p-2.5 text-xs outline-none focus:border-[#4a7aa8]"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setModifyPromptFor(null)}
                            className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            Annuler
                          </button>
                          <button
                            type="button"
                            disabled={decisionSubmitting || !modifyPromptText.trim()}
                            onClick={() => handleDecision("modify", modifyPromptText)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0f1c33] py-2 text-xs font-semibold text-white hover:bg-[#1a2f50] disabled:opacity-50"
                          >
                            {decisionSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            Envoyer la demande
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={decisionSubmitting}
                          onClick={() => handleDecision("accept")}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                        >
                          <Check className="h-3.5 w-3.5" /> Accepter
                        </button>
                        <button
                          type="button"
                          disabled={decisionSubmitting}
                          onClick={() => setModifyPromptFor(data.id)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 py-2.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Modifier
                        </button>
                        <button
                          type="button"
                          disabled={decisionSubmitting}
                          onClick={() => handleDecision("reject")}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Rejeter
                        </button>
                      </div>
                    )}

                    {decisionSuccess && (
                      <p className="mt-2 text-xs font-semibold text-emerald-600">
                        Décision enregistrée avec succès.
                      </p>
                    )}
                    {decisionError && (
                      <p className="mt-2 text-xs font-semibold text-rose-600">{decisionError}</p>
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-sm text-slate-400">
              Configurez les paramètres et cliquez sur "Lancer l'Optimisation"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}