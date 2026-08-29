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
import { useGeneration } from "@/hooks/useGeneration";
import { getStoredCompanyContext } from "@/lib/companyContext";

// Maps the UI's format buttons to the type_contenu values the API expects
// (per cahier de passation section 2.3). "Product Launch" isn't in the
// documented examples — using "annonce" as a best guess; confirm with
// Stagiaire 3 if there's an exact value for it.
const FORMAT_TO_TYPE_CONTENU: Record<string, string> = {
  "Thought Leadership": "publication",
  "Case Study": "etude_de_cas",
  "Carousel Blueprint": "carrousel",
  "Product Launch": "annonce",
};

export default function GenerationPage() {
  const { data: generatedPost, loading, isFallback, generate } = useGeneration();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const [formData, setFormData] = useState({
    topic: "Accompagnement d'un client agroalimentaire dans sa migration ERP",
    format: "Case Study",
    tone: "Professionnel & Expert",
    targetAudience: "PME et ETI industrielles",
    // FIX: was hardcoded to "expertise" for every single generation,
    // regardless of actual intent. Real values seen in the cahier de
    // passation's own test cases: "prospects", "expertise", "visibilite",
    // "recrutement".
    objectif: "expertise",
    messageCle: "",
    // Free-form "clé: valeur" per line — parsed into elements_fournis below.
    // Per the cahier: "plus on fournit d'éléments factuels réels, meilleur
    // est le contenu et moins le LLM est tenté d'inventer." This was never
    // collected at all before, so every generation had less real context
    // than the backend can actually use.
    elementsFournisText: "",
    includeCTA: true,
  });

  function parseElementsFournis(text: string): Record<string, string> | undefined {
    const result: Record<string, string> = {};
    text.split("\n").forEach((line) => {
      const idx = line.indexOf(":");
      if (idx > 0) {
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        if (key) result[key] = value;
      }
    });
    return Object.keys(result).length > 0 ? result : undefined;
  }

  // FIX: this used to be a hardcoded fake company ("Nexalys Conseil") —
  // every generation would've silently submitted fake data instead of the
  // logged-in user's actual company. positionnement has no real source in
  // onboarding data, so it stays user-editable with a placeholder hint.
  const [companyContext, setCompanyContext] = useState(() => {
    const stored = getStoredCompanyContext();
    return { ...stored, positionnement: "" };
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedVariantIndex(0);

    // FIX: company_id was missing entirely — the real GenerationCreate
    // schema requires it.
    const companyId =
      typeof window !== "undefined" ? localStorage.getItem("company_id") || "" : "";

    await generate({
      company_id: companyId,
      type_contenu: FORMAT_TO_TYPE_CONTENU[formData.format] ?? "publication",
      brief: {
        sujet: formData.topic,
        objectif: formData.objectif,
        message_cle: formData.messageCle || undefined,
        elements_fournis: parseElementsFournis(formData.elementsFournisText),
      },
      contexte_entreprise: {
        nom: companyContext.nom,
        secteur: companyContext.secteur,
        cible_client: formData.targetAudience,
        services: companyContext.services,
        positionnement: companyContext.positionnement,
        ton_souhaite: formData.tone,
      },
    });
  };

  // variantes is wrapped per the real schema — { variantes: [...] }
  const currentVariant = generatedPost?.variantes.variantes[selectedVariantIndex];

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
          {isFallback && (
            <span className="mt-2 inline-block rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
              Showing sample data — backend unreachable
            </span>
          )}
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
                  Objectif
                </label>
                <select
                  value={formData.objectif}
                  onChange={(e) => setFormData({ ...formData, objectif: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium outline-none transition-all focus:border-[#4a7aa8]"
                >
                  <option value="visibilite">Visibilité</option>
                  <option value="prospects">Prospects</option>
                  <option value="recrutement">Recrutement</option>
                  <option value="expertise">Expertise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Message clé <span className="normal-case text-slate-400">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={formData.messageCle}
                  onChange={(e) => setFormData({ ...formData, messageCle: e.target.value })}
                  placeholder="e.g. Sécuriser une migration ERP critique sans arrêter la production"
                  className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs outline-none transition-all focus:border-[#4a7aa8] focus:ring-1 focus:ring-[#4a7aa8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Éléments factuels <span className="normal-case text-slate-400">(optionnel, un par ligne : clé: valeur)</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.elementsFournisText}
                  onChange={(e) => setFormData({ ...formData, elementsFournisText: e.target.value })}
                  placeholder={"probleme: ERP obsolète, risque d'arrêt de production\nsolution: migration progressive par modules"}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs outline-none transition-all focus:border-[#4a7aa8] focus:ring-1 focus:ring-[#4a7aa8]"
                />
                <p className="mt-1 text-[10px] text-slate-400">
                  Plus il y a de faits réels ici, moins l'IA a besoin d'inventer.
                </p>
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

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Positionnement
                </label>
                <input
                  type="text"
                  value={companyContext.positionnement}
                  onChange={(e) =>
                    setCompanyContext({ ...companyContext, positionnement: e.target.value })
                  }
                  placeholder="e.g. Cabinet spécialisé dans les projets ERP critiques"
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

        {/* Right Column: Preview */}
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
                {generatedPost.variantes.variantes.map((_, idx) => (
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
              {(generatedPost.marqueurs_a_completer?.length ?? 0) > 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600" />
                  <span>
                    Champs à compléter :{" "}
                    <strong>{generatedPost.marqueurs_a_completer?.join(", ")}</strong>
                  </span>
                </div>
              )}

              {/* LinkedIn Native Style Mock Preview */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4a7aa8] font-bold text-white text-sm">
                    {(companyContext.nom || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {companyContext.nom || "Votre entreprise"}
                    </h4>
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
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-sm text-slate-400">
              Remplissez le brief et cliquez sur "Générer les variantes"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}