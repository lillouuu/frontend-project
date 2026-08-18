"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Copy,
  Check,
  PenSquare,
  RefreshCw,
  Bookmark,
  Share2,
  Hash,
  Megaphone,
  Layers,
  FileText,
  Lightbulb,
  ArrowRight,
  Send,
  ThumbsUp,
  MessageSquare,
  Globe,
  AlertCircle,
} from "lucide-react";

const API_RESPONSE_DATA = {
  type_contenu: "etude_de_cas",
  titre_interne:
    "Migration ERP en environnement critique : le cas d’un acteur agroalimentaire",
  variantes: [
    {
      angle: "Approche technique et sécurisée pour éviter l’interruption de production",
      contenu:
        "Dans l’agroalimentaire, une migration ERP ne tolère aucune improvisation.\n\nUn de nos clients du secteur faisait face à un défi majeur : son ERP, devenu obsolète, menaçait la continuité de sa chaîne de production. Une bascule mal maîtrisée aurait pu entraîner un arrêt coûteux et prolongé.\n\nNotre réponse ? Une migration progressive, module par module, couplée à la mise en place d’un environnement de secours opérationnel. Cette approche a permis de :\n- Maintenir la production en continu pendant toute la durée du projet\n- Limiter les risques techniques liés à la bascule\n- Valider chaque étape avant de passer à la suivante\n\nRésultat : [résultat chiffré].\n\nUne preuve que même les projets ERP les plus critiques peuvent être menés à bien avec une méthodologie adaptée aux enjeux industriels.\n\nVous préparez une migration ERP dans un environnement sensible ? Parlons-en.",
      hashtags: [
        "#ERP",
        "#Agroalimentaire",
        "#TransformationDigitale",
        "#Industrie",
        "#ConseilIT",
      ],
      cta: "Échangeons sur vos enjeux de migration ERP [lien à compléter]",
    },
    {
      angle: "Focus sur la méthodologie adaptée aux contraintes industrielles",
      contenu:
        "Quand un ERP devient un risque pour la production, la migration ne peut pas être traitée comme un projet standard.\n\nPour [nom du client], acteur du secteur agroalimentaire, l’obsolescence de son système représentait une menace directe sur sa chaîne de production. L’enjeu ? Éviter tout arrêt, même temporaire.\n\nNotre méthodologie a reposé sur trois piliers :\n- Une analyse préalable des modules critiques pour la production\n- La création d’un environnement de secours garantissant la continuité des opérations\n- Une migration par étapes, avec des tests en conditions réelles avant chaque bascule\n\nCette approche sur-mesure a permis de sécuriser le projet sans compromettre l’activité.\n\nRésultat : [résultat chiffré].\n\nUn exemple concret de notre expertise en accompagnement ERP pour les industries à flux tendus.\n\nBesoin d’une stratégie adaptée à vos contraintes opérationnelles ? Contactez-nous.",
      hashtags: [
        "#ERPIndustriel",
        "#ContinuiteOperationnelle",
        "#ConseilEnTransformation",
        "#PMEIndustrielles",
        "#TechnologieCritique",
      ],
      cta: "Découvrez comment sécuriser votre migration ERP [lien à compléter]",
    },
  ],
  marqueurs_acompleter: [
    "[résultat chiffré]",
    "[lien à compléter]",
    "[nom du client]",
  ],
};

export default function GenerationPage() {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    topic: "Accompagnement d’un client agroalimentaire dans sa migration ERP",
    format: "Case Study",
    tone: "Professionnel & Expert",
    targetAudience: "PME et ETI industrielles",
    includeCTA: true,
  });

  // Pre-loaded initial state so you can preview without clicking generate
  const [generatedPost, setGeneratedPost] = useState<typeof API_RESPONSE_DATA | null>(API_RESPONSE_DATA);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setGeneratedPost(API_RESPONSE_DATA);
      setSelectedVariantIndex(0);
      setLoading(false);
    }, 800);
  };

  const currentVariant = generatedPost?.variantes[selectedVariantIndex];

  const handleCopyFullPost = () => {
    if (!currentVariant) return;
    const fullContent = `${currentVariant.contenu}\n\n${currentVariant.cta}\n\n${currentVariant.hashtags.join(" ")}`;
    navigator.clipboard.writeText(fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-sans text-slate-800">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            AI Content Generator
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Générez des posts LinkedIn, études de cas et sous-formats optimisés pour vos cibles industrielles.
          </p>
        </div>
        <Link
          href="/calendar"
          className="inline-flex items-center gap-2 rounded-xl bg-[#4a7aa8] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#3f6a94]"
        >
          Planifier au calendrier <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Form Parameters */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <PenSquare className="h-5 w-5 text-[#4a7aa8]" />
              <h2 className="text-base font-bold text-slate-900">Paramètres & Brief Stratégique</h2>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Sujet du Brief
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs outline-none transition-all focus:border-[#4a7aa8] focus:ring-1 focus:ring-[#4a7aa8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Format de Contenu
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    { id: "Thought Leadership", icon: Lightbulb },
                    { id: "Case Study", icon: FileText },
                    { id: "Carousel Blueprint", icon: Layers },
                    { id: "Product Launch", icon: Megaphone },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, format: item.id })}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all ${
                          formData.format === item.id
                            ? "border-[#4a7aa8] bg-[#4a7aa8]/10 text-[#4a7aa8]"
                            : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="truncate">{item.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tonalité
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium outline-none transition-all focus:border-[#4a7aa8]"
                >
                  <option>Professionnel & Expert</option>
                  <option>Direct & Orienté Résultats</option>
                  <option>Inspirant & Visionnaire</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Cible / Audience
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs outline-none transition-all focus:border-[#4a7aa8] focus:ring-1 focus:ring-[#4a7aa8]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4a7aa8] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#3f6a94] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Générer les variantes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Pre-rendered Preview */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {generatedPost && currentVariant ? (
            <div className="space-y-4">
              {/* Internal Title Header */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4a7aa8]">
                  Titre interne
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  {generatedPost.titre_interne}
                </h3>
              </div>

              {/* Variant Selector Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                {generatedPost.variantes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      selectedVariantIndex === idx
                        ? "bg-[#4a7aa8] text-white shadow-sm"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Variante {idx + 1}
                  </button>
                ))}
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="text-xs font-medium text-slate-500 pr-2">
                  Angle : <strong className="text-slate-800">{currentVariant.angle}</strong>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                      saved ? "border-amber-300 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    {saved ? "Sauvegardé" : "Sauvegarder"}
                  </button>
                  <button
                    onClick={handleCopyFullPost}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-slate-800"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copié !" : "Copier le post"}
                  </button>
                </div>
              </div>

              {/* Missing Fields Alert Chip */}
              {generatedPost.marqueurs_acompleter.length > 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600" />
                  <span>
                    Champs à compléter :{" "}
                    <strong>{generatedPost.marqueurs_acompleter.join(", ")}</strong>
                  </span>
                </div>
              )}

              {/* LinkedIn Native Style Mock Preview */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4a7aa8] font-bold text-white text-sm">
                    NC
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Nexalys Conseil • Expert ERP</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      À l'instant • <Globe className="h-3 w-3" />
                    </p>
                  </div>
                </div>

                {/* Main Post Body */}
                <div className="mt-4 space-y-3 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                  {currentVariant.contenu}
                </div>

                {/* CTA Callout */}
                <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs font-semibold text-[#4a7aa8]">
                  {currentVariant.cta}
                </div>

                {/* Hashtags */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {currentVariant.hashtags.map((tag: string, idx: number) => (
                    <span key={idx} className="inline-flex items-center text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                      <Hash className="h-3 w-3 mr-0.5" />
                      {tag.replace("#", "")}
                    </span>
                  ))}
                </div>

                {/* Feed Footer */}
                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <button className="flex items-center gap-1 hover:text-slate-600"><ThumbsUp className="h-4 w-4" /> J'aime</button>
                  <button className="flex items-center gap-1 hover:text-slate-600"><MessageSquare className="h-4 w-4" /> Commenter</button>
                  <button className="flex items-center gap-1 hover:text-slate-600"><Share2 className="h-4 w-4" /> Partager</button>
                  <button className="flex items-center gap-1 hover:text-slate-600"><Send className="h-4 w-4" /> Envoyer</button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}