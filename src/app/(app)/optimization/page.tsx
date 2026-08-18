"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wand2,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  Star,
  Sparkles,
  ArrowRight,
  Info,
  Building2,
  Target,
  ShieldAlert,
} from "lucide-react";

// --- Données d'exemple correspondant à la réponse du test O1 ---
const OPTIMIZATION_API_RESPONSE = {
  type_element: "slogan",
  contenu_original: "",
  faiblesses_corrigees: [
    "Absence totale de contenu initial",
    "Manque de clarté sur le secteur d’activité",
    "Absence de proposition de valeur",
    "Cible client non définie",
    "Positionnement inexistant",
  ],
  variantes: [
    {
      angle: "orienteexpertisetechnique",
      contenu:
        "Nexalys Conseil accompagne les entreprises dans l'optimisation de leurs processus métiers grâce à l'intégration d'ERP performants.\n\nNotre expertise couvre l'ensemble du cycle d'intégration : analyse des besoins, paramétrage, déploiement et formation des équipes.\n\nNous intervenons auprès de [secteursclientsprincipaux] pour leur permettre de gagner en efficacité opérationnelle, en visibilité sur leurs données et en agilité.\n\nNotre approche sur-mesure garantit des solutions alignées avec vos enjeux business et vos contraintes techniques.",
      explication:
        "Cette variante met en avant l'expertise technique de Nexalys Conseil en détaillant les étapes clés de l'intégration ERP. Elle cible les décideurs IT et opérationnels en soulignant les bénéfices concrets (efficacité, visibilité, agilité). Les mots-clés comme 'intégration ERP', 'processus métiers' et 'déploiement' sont intégrés naturellement pour le référencement.",
    },
    {
      angle: "orientebnficesclients",
      contenu:
        "Chez Nexalys Conseil, nous transformons vos défis opérationnels en opportunités grâce à des solutions ERP adaptées.\n\nQue vous soyez une PME en croissance ou un groupe international, notre mission est de simplifier votre gestion quotidienne, d'automatiser vos processus et de vous fournir des données fiables pour prendre des décisions claires.\n\nAvec [nombredannesdexprience] années d'expérience dans l'intégration ERP, nous avons aidé [nombredeclients] entreprises :\n- Réduire leurs coûts opérationnels ;\n- Accélérer leurs délais de traitement ;\n- Améliorer la collaboration entre services.\n\nNotre engagement : des résultats mesurables, sans perturbation de votre activité.",
      explication:
        "Cette variante adopte une approche centrée sur les bénéfices clients, en listant des résultats concrets (réduction des coûts, accélération des délais). Elle utilise un ton engageant et rassurant, idéal pour les dirigeants et responsables opérationnels. Les mots-clés comme 'solutions ERP', 'automatisation' et 'décisions claires' sont intégrés pour renforcer la visibilité.",
    },
    {
      angle: "orienteconfianceet proximit",
      contenu:
        "Nexalys Conseil, c'est avant tout une équipe de passionnés dédiée à la réussite de vos projets ERP.\n\nNous croyons que la technologie doit servir vos ambitions, pas les complexifier. C'est pourquoi nous privilégions une relation de proximité, basée sur l'écoute et la transparence, pour vous proposer des solutions ERP qui s'intègrent parfaitement à votre organisation.\n\nNotre méthode :\n1. Comprendre vos enjeux spécifiques ;\n2. Co-construire une solution sur-mesure ;\n3. Vous accompagner jusqu'à l'adoption totale par vos équipes.\n\nParce que chaque entreprise est unique, nous adaptons notre expertise à vos besoins, et non l'inverse.",
      explication:
        "Cette variante mise sur la relation client et la proximité, en insistant sur l'écoute et la co-construction. Elle est particulièrement adaptée pour les entreprises recherchant un partenaire de confiance plutôt qu'un simple prestataire. Les mots-clés comme 'projets ERP', 'solutions sur-mesure' et 'accompagnement' sont utilisés pour capter l'attention des décideurs en quête de fiabilité.",
    },
  ],
  marqueurs: [
    "[secteursclientsprincipaux]",
    "[nombredannesdexprience]",
    "[nombredeclients]",
  ],
  ameliorations_apportees: [
    "Création d'une description structurée et professionnelle",
    "Intégration naturelle des mots-clés métier (ERP, intégration, processus métiers, etc.)",
    "Mise en avant des bénéfices clients pour chaque variante",
    "Adaptation du ton à un public B2B (professionnel, clair et orienté résultats)",
    "Respect des contraintes de longueur (moins de 2000 caractères)",
  ],
  variante_recommandee: {
    angle: "orientebnficesclients",
    raison:
      "Cette variante est la plus efficace pour capter l'attention des décideurs B2B, car elle met directement en avant les résultats concrets et les gains pour l'entreprise. Elle répond aux attentes des clients en quête de solutions ERP qui améliorent leur performance opérationnelle, tout en restant accessible et engageante.",
  },
};

export default function OptimizationPage() {
  // --- Champs du corps de la requête POST /api/optimisations ---
  const [typeElement, setTypeElement] = useState("slogan");
  const [contenuActuel, setContenuActuel] = useState("");
  const [tonSouhaite, setTonSouhaite] = useState("professionnel");

  // Champs obligatoires : contexte_entreprise
  const [contexte, setContexte] = useState({
    nom: "Nexalys Conseil",
    secteur: "Conseil IT & Intégration ERP",
    cible_client: "PME & Groupes Internationaux (Décideurs IT)",
    services: "Intégration ERP, Analyse de besoins, Formation",
    positionnement: "Expertise sur-mesure & accompagnement de proximité",
  });

  // Champs utiles : resultat_audit
  const [resultatAudit] = useState({
    critere_code: "slogan",
    niveau: 1,
    justification_audit:
      "Absence totale de proposition de valeur et positionnement inexistant sur le profil.",
    recommandation_id: "reco_001",
  });

  // --- États pour l'affichage de l'interface ---
  const [copiedAngle, setCopiedAngle] = useState<string | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(1);
  const [data] = useState(OPTIMIZATION_API_RESPONSE);
  const [isLoading, setIsLoading] = useState(false);

  const currentVariant = data.variantes[selectedVariantIndex];

  const handleCopy = (text: string, angle: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAngle(angle);
    setTimeout(() => setCopiedAngle(null), 2000);
  };

  const handleRunOptimization = () => {
    // Structure exacte envoyée au backend POST /api/optimisations
    const requestBody = {
      type_element: typeElement,
      contenu_actuel: contenuActuel,
      resultat_audit: resultatAudit,
      contexte_entreprise: {
        nom: contexte.nom,
        secteur: contexte.secteur,
        cible_client: contexte.cible_client,
        services: contexte.services.split(",").map((s) => s.trim()),
        positionnement: contexte.positionnement,
        ton_souhaite: tonSouhaite,
      },
    };

    console.log("Envoi de la requête POST /api/optimisations :", requestBody);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1200); // Simulation de latence réseau
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
        </div>
        <Link
          href="/generation"
          className="inline-flex items-center gap-2 rounded-xl bg-[#4a7aa8] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#3f6a94]"
        >
          Suivant : Générer du Contenu <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Bannière du résultat de l'audit (resultat_audit) */}
      <div className="mb-6 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 shadow-sm flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px]">
              Défaut Identifié par l'Audit (Niveau {resultatAudit.niveau})
            </span>
            <span className="rounded bg-amber-200/60 px-1.5 py-0.5 text-[10px] font-mono text-amber-800">
              {resultatAudit.recommandation_id}
            </span>
          </div>
          <p className="mt-1 font-medium text-amber-900">
            {resultatAudit.justification_audit}
          </p>
        </div>
      </div>

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
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  { id: "slogan", label: "Slogan" },
                  { id: "description_entreprise", label: "Description" },
                  { id: "headline", label: "Titre Exécutif" },
                  { id: "about", label: "À propos / Bio" },
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
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#4a7aa8] py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#3f6a94] disabled:opacity-50"
            >
              <Wand2 className="h-4 w-4" />
              {isLoading ? "Génération en cours..." : "Lancer l'Optimisation"}
            </button>
          </div>
        </div>

        {/* Colonne Droite : Résultats (3 Variantes + Recommandation) */}
        <div className="flex flex-col gap-6 lg:col-span-7">
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
            {data.variantes.map((v, idx) => {
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
          {data.marqueurs.length > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs text-sky-800">
              <Info className="h-4 w-4 flex-shrink-0 text-sky-600" />
              <span>
                Marqueurs à personnaliser dans le texte :{" "}
                <strong>{data.marqueurs.join(", ")}</strong>
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
                onClick={() =>
                  handleCopy(currentVariant.contenu, currentVariant.angle)
                }
                className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-slate-800"
              >
                {copiedAngle === currentVariant.angle ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedAngle === currentVariant.angle
                  ? "Copié !"
                  : "Copier la variante"}
              </button>
            </div>

            {/* Texte généré */}
            <div className="rounded-xl bg-slate-50/70 p-4 border border-slate-100 text-xs leading-relaxed text-slate-800 whitespace-pre-line font-sans">
              {currentVariant.contenu}
            </div>

            {/* Explication stratégique & SEO */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-[#4a7aa8]" /> Explication
                & SEO :
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
              {data.ameliorations_apportees.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}