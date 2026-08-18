"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  History,
  RotateCw,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

// --- Complete Source Data ---
const AUDIT_DATA = {
  score: {
    score_global: 83,
    score_entreprise: 75,
    score_dirigeant: 100,
    dirigeant_present: true,
    sous_scores_categories: [
      {
        code: "page_entreprise",
        libelle: "Page entreprise",
        obtenu: 15,
        max: 16,
        pourcentage: 94,
        evaluee: true,
      },
      {
        code: "activite_engagement",
        libelle: "Activité et engagement",
        obtenu: 0,
        max: 4,
        pourcentage: 0,
        evaluee: true,
      },
      {
        code: "dirigeant",
        libelle: "Profil du dirigeant",
        obtenu: 13,
        max: 13,
        pourcentage: 100,
        evaluee: true,
      },
      {
        code: "coherence",
        libelle: "Cohérence dirigeant/entreprise",
        obtenu: 2,
        max: 2,
        pourcentage: 100,
        evaluee: true,
      },
    ],
  },
  analyse_ia: {
    evaluations: [
      {
        categorie: "page_entreprise",
        critere: "slogan",
        niveau: "2",
        preuve: "Leading the data revolution across industries",
        justification:
          "Le slogan est clair, professionnel et valorise la proposition de valeur de l’entreprise en mettant en avant son leadership dans la révolution data.",
      },
      {
        categorie: "page_entreprise",
        critere: "description_entreprise",
        niveau: "3",
        preuve:
          "DataCorp International est un acteur global de la transformation data. Nous accompagnons les grandes entreprises dans leur stratégie data, de la collecte à la valorisation, avec des solutions d’intelligence artificielle, de business intelligence et de gouvernance à grande échelle. Présents dans 15 pays, nous servons les secteurs de la finance, de l’industrie et de la distribution.",
        justification:
          "La description est structurée et contient l’activité, la cible client, la proposition de valeur, les éléments différenciants et des mots-clés pertinents.",
      },
      {
        categorie: "page_entreprise",
        critere: "services",
        niveau: "2",
        preuve:
          "Stratégie data, Intelligence artificielle, Business intelligence, Gouvernance de données, Formation data",
        justification:
          "Les services sont clairement expliqués et leur valeur pour les clients est identifiable.",
      },
      {
        categorie: "page_entreprise",
        critere: "seo_mots_cles",
        niveau: "2",
        preuve: "Data Strategy, IA, BI, Data Governance, Big Data",
        justification:
          "Les mots-clés sont pertinents et liés au secteur, intégrés naturellement dans les spécialités de l’entreprise.",
      },
      {
        categorie: "page_entreprise",
        critere: "publications_entreprise",
        niveau: "2",
        preuve:
          "Notre rapport annuel sur l’état de la maturité data des entreprises européennes est disponible. Retour sur notre conférence data de Paris.",
        justification:
          "Les publications sont professionnelles et adaptées à l’activité de l’entreprise, démontrant une expertise dans le domaine data.",
      },
      {
        categorie: "dirigeant",
        critere: "titre_dirigeant",
        niveau: "2",
        preuve:
          "CEO & Founder at DataCorp International | Keynote speaker | Data strategy for Fortune 500",
        justification:
          "Le titre est précis et valorise l’expertise du dirigeant en mettant en avant son rôle, ses compétences et sa cible.",
      },
      {
        categorie: "dirigeant",
        critere: "resume_dirigeant",
        niveau: "3",
        preuve:
          "Serial entrepreneur in the data space. J’ai fondé DataCorp en 2008 avec la conviction que la data allait transformer chaque industrie. Aujourd’hui, nous accompagnons plus de 400 grandes entreprises dans le monde. Ancien consultant en stratégie, diplômé de Polytechnique, je partage régulièrement mes analyses sur l’avenir de l’IA en entreprise.",
        justification:
          "Le résumé est structuré et contient l’expertise, les réalisations, la vision et la proposition de valeur du dirigeant.",
      },
      {
        categorie: "dirigeant",
        critere: "experience_dirigeant",
        niveau: "2",
        preuve:
          "Direction générale, vision stratégique, développement international sur 15 pays. Conseil en stratégie pour des clients du secteur financier.",
        justification:
          "L’expérience est détaillée et cohérente avec l’activité de l’entreprise, mettant en avant des rôles pertinents et des réalisations significatives.",
      },
      {
        categorie: "dirigeant",
        critere: "competences_dirigeant",
        niveau: "2",
        preuve:
          "Data Strategy, Leadership, Artificial Intelligence, Public Speaking, Business Development, Entrepreneurship, Management",
        justification:
          "Les compétences sont pertinentes et cohérentes avec le domaine d’activité de l’entreprise et le rôle du dirigeant.",
      },
      {
        categorie: "dirigeant",
        critere: "publications_dirigeant",
        niveau: "2",
        preuve:
          "3 tendances IA que tout dirigeant devrait suivre en 2026. Mon analyse après avoir échangé avec des dizaines de CEO cette année.",
        justification:
          "La publication est professionnelle et démontre une expertise dans le domaine de l’IA et du leadership.",
      },
      {
        categorie: "coherence",
        critere: "coherence_dirigeant_entreprise",
        niveau: "2",
        preuve:
          "Serial entrepreneur in the data space. J’ai fondé DataCorp en 2008 avec la conviction que la data allait transformer chaque industrie. Aujourd’hui, nous accompagnons plus de 400 grandes entreprises dans le monde. DataCorp International est un acteur global de la transformation data.",
        justification:
          "Il existe une forte cohérence entre l’expertise du dirigeant, sa communication personnelle et le positionnement de l’entreprise, tous centrés sur la transformation data et l’IA.",
      },
    ],
    points_forts: [
      "Description d’entreprise très complète et structurée, couvrant tous les aspects clés (activité, cible, proposition de valeur, différenciation).",
      "Slogan percutant et professionnel qui renforce le positionnement de leader dans le domaine data.",
      "Services bien détaillés et alignés avec les spécialités de l’entreprise.",
      "Mots-clés SEO pertinents et intégrés naturellement.",
      "Publications de l’entreprise et du dirigeant démontrant une expertise solide et une ligne éditoriale cohérente.",
      "Profil du dirigeant très bien construit, avec un titre précis, un résumé détaillé et des compétences alignées avec l’activité de l’entreprise.",
      "Forte cohérence entre le profil du dirigeant et l’entreprise, renforçant la crédibilité et l’expertise perçue.",
    ],
    points_faibles: [
      "Les publications de l’entreprise pourraient être plus variées et approfondies pour mieux illustrer l’expertise sectorielle.",
      "Le contenu des publications du dirigeant, bien que pertinent, pourrait être plus régulier pour maintenir l’engagement.",
    ],
    recommandations: [
      {
        priorite: "OPTIMISATION",
        action:
          "Diversifier les formats de publications (vidéos, infographies, études de cas) pour enrichir le contenu et mieux illustrer l’expertise.",
        raison:
          "Cela permettrait de capter davantage l’attention des abonnés et de démontrer concrètement la valeur des solutions proposées.",
      },
      {
        priorite: "OPTIMISATION",
        action:
          "Augmenter la fréquence des publications du dirigeant pour renforcer sa visibilité et son leadership d’opinion.",
        raison:
          "Un rythme de publication plus soutenu permettrait de maintenir un engagement élevé et de positionner le dirigeant comme une référence dans le domaine.",
      },
      {
        priorite: "IMPORTANTE",
        action:
          "Ajouter des témoignages clients ou des études de cas dans la description de l’entreprise et les publications.",
        raison:
          "Cela renforcerait la crédibilité et illustrerait concrètement l’impact des solutions proposées par DataCorp International.",
      },
    ],
    synthese:
      "La présence LinkedIn de DataCorp International et de son dirigeant Alexandre Chen est globalement excellente, avec une stratégie de personal branding et de communication d’entreprise bien alignée. La description de l’entreprise est complète, les services sont clairement présentés, et les mots-clés SEO sont pertinents. Le profil du dirigeant est très professionnel, avec une forte cohérence entre son expertise et l’activité de l’entreprise. Les publications, bien que pertinentes, pourraient être diversifiées et plus fréquentes pour maximiser l’engagement et la démonstration d’expertise.",
  },
};

type FilterType = "ALL" | "CRITICAL" | "IMPORTANTE" | "OPTIMISATION";

export default function AuditPage() {
  const [filter, setFilter] = useState<FilterType>("ALL");

  const { score, analyse_ia } = AUDIT_DATA;

  // Filter recommendations based on tab selection
  const filteredRecs =
    filter === "ALL"
      ? analyse_ia.recommandations
      : analyse_ia.recommandations.filter((r) => r.priorite === filter);

  // Group Evaluations by category for standard displaying
  const companyEvals = analyse_ia.evaluations.filter(
    (e) => e.categorie === "page_entreprise"
  );
  const managerEvals = analyse_ia.evaluations.filter(
    (e) => e.categorie === "dirigeant" || e.categorie === "coherence"
  );

  // Category sub scores mapping
  const companySubScore = score.sous_scores_categories.find(
    (s) => s.code === "page_entreprise"
  );
  const managerSubScore = score.sous_scores_categories.find(
    (s) => s.code === "dirigeant"
  );

  // Render score level dots based on criterion level
  const renderDots = (niveauStr: string) => {
    const level = parseInt(niveauStr, 10) || 0;
    return (
      <div className="flex gap-1.5">
        {[1, 2, 3].map((dotIndex) => {
          let dotColor = "bg-slate-200";
          if (level > 0 && dotIndex <= level) {
            if (level === 3) dotColor = "bg-emerald-500";
            else if (level === 2) dotColor = "bg-amber-500";
            else if (level === 1) dotColor = "bg-rose-500";
          }
          return (
            <div
              key={dotIndex}
              className={`h-2 w-2 rounded-full ${dotColor}`}
            />
          );
        })}
      </div>
    );
  };

  // Helper to format string criterion keys nicely
  const formatCriterionName = (key: string) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden bg-slate-50 text-slate-800">
      {/* Topbar */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-bold text-slate-900">Audit Report</h1>
          <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-600">
            <Clock size={13} /> Jul 22, 2026
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <History size={14} /> History
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-[#0077B5] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#005f93] transition-colors">
            <RotateCw size={14} /> New Audit
          </button>
        </div>
      </header>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Main Score Gauge & Category Split */}
        <div className="grid grid-cols-[160px_1fr] gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center gap-2 border-r border-slate-200 pr-6">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  stroke="#e2e8f0"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  stroke={score.score_global >= 75 ? "#10b981" : "#f59e0b"}
                  strokeDasharray={`${score.score_global}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center leading-none">
                <span className="text-3xl font-extrabold text-slate-900">
                  {score.score_global}
                </span>
                <span className="text-xs text-slate-400 font-medium">/100</span>
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-800">
              Overall Score
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {score.score_global >= 80 ? "Advanced" : "Intermediate"}
            </span>
          </div>

          <div className="flex flex-col justify-center gap-3.5">
            <span className="w-fit rounded-full border border-slate-200 bg-slate-100 px-3.5 py-1 text-xs font-medium text-slate-600">
              Company Page 70% · Manager Profile 30%
            </span>
            <div className="grid grid-cols-2 gap-4">
              {/* Company Breakdown Card */}
              <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">
                    Company Page
                  </span>
                  <span className="font-bold text-emerald-600">
                    {score.score_entreprise}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${score.score_entreprise}%` }}
                  />
                </div>
              </div>

              {/* Manager Breakdown Card */}
              <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">
                    Manager Profile
                  </span>
                  <span className="font-bold text-emerald-600">
                    {score.score_dirigeant}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${score.score_dirigeant}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-scores Itemized Lists */}
        <div className="grid grid-cols-2 gap-4">
          {/* Company Page Criteria */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Company Page
                </h3>
                <span className="text-xs text-slate-500">
                  Logo, Slogan, Description & SEO
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-600">
                  {companySubScore?.pourcentage}%
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {companySubScore?.obtenu} / {companySubScore?.max} pts
                </div>
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${companySubScore?.pourcentage}%` }}
              />
            </div>
            <div className="divide-y divide-slate-100">
              {companyEvals.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 text-xs"
                >
                  <span className="font-medium text-slate-700">
                    {formatCriterionName(item.critere)}
                  </span>
                  {renderDots(item.niveau)}
                </div>
              ))}
            </div>
          </div>

          {/* Manager Profile Criteria */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Manager Profile
                </h3>
                <span className="text-xs text-slate-500">
                  Title, Bio, Skills & Alignment
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-600">
                  {managerSubScore?.pourcentage}%
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {managerSubScore?.obtenu} / {managerSubScore?.max} pts
                </div>
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${managerSubScore?.pourcentage}%` }}
              />
            </div>
            <div className="divide-y divide-slate-100">
              {managerEvals.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 text-xs"
                >
                  <span className="font-medium text-slate-700">
                    {formatCriterionName(item.critere)}
                  </span>
                  {renderDots(item.niveau)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
              <CheckCircle2 size={16} /> Strengths
            </div>
            <div className="space-y-2.5 text-xs text-slate-700">
              {analyse_ia.points_forts.map((fort, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                    ✓
                  </div>
                  <span className="leading-relaxed">{fort}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-rose-600">
              <XCircle size={16} /> Weaknesses
            </div>
            <div className="space-y-2.5 text-xs text-slate-700">
              {analyse_ia.points_faibles.map((faible, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                    ✕
                  </div>
                  <span className="leading-relaxed">{faible}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations Filter List */}
        <div className="flex flex-col gap-3.5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Recommendations
            </h3>
            <div className="flex gap-1.5">
              {(["ALL", "CRITICAL", "IMPORTANTE", "OPTIMISATION"] as const).map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full px-3 py-1 text-xs transition-colors ${
                      filter === f
                        ? "bg-[#0077B5] font-semibold text-white"
                        : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {f === "ALL"
                      ? "All"
                      : f.charAt(0) + f.slice(1).toLowerCase()}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {filteredRecs.map((rec, i) => {
              const queryParams = new URLSearchParams({
                priorite: rec.priorite,
                action: rec.action,
                raison: rec.raison,
              }).toString();

              return (
                <div
                  key={i}
                  className="flex items-start gap-3.5 rounded-lg border border-slate-200 bg-slate-50/60 p-3.5"
                >
                  <span
                    className={`mt-0.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      rec.priorite === "CRITICAL"
                        ? "border-rose-200 bg-rose-50 text-rose-600"
                        : rec.priorite === "IMPORTANTE"
                        ? "border-amber-200 bg-amber-50 text-amber-600"
                        : "border-emerald-200 bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {rec.priorite}
                  </span>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-900">
                      {rec.action}
                    </div>
                    <div className="mt-1 text-xs leading-relaxed text-slate-600">
                      {rec.raison}
                    </div>
                    <Link
                      href={`/optimization?${queryParams}`}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0077B5] hover:underline"
                    >
                      Apply this fix <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Summary */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#0077B5]">
            <Sparkles size={15} /> AI Summary
          </div>
          <p className="text-xs leading-relaxed text-slate-600">
            {analyse_ia.synthese}
          </p>
        </div>
      </div>
    </div>
  );
}