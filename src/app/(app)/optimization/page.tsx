"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wand2,
  Sparkles,
  Check,
  Copy,
  ArrowRight,
  RefreshCw,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Layers,
  SlidersHorizontal,
} from "lucide-react";

export default function OptimizationPage() {
  const [loading, setLoading] = useState(false);
  const [selectedField, setSelectedField] = useState("company_slogan");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [appliedId, setAppliedId] = useState<number | null>(null);

  // Form State
  const [fieldInput, setFieldInput] = useState({
    currentText: "We provide IT services and custom software for businesses.",
    targetAudience: "B2B SaaS Founders & CTOs",
    tone: "Professional & Authoritative",
  });

  const [variations, setVariations] = useState<any[]>([]);

  const handleGenerateVariations = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setVariations([
        {
          id: 1,
          angle: "Authority & Market Leadership",
          badgeStyle: "bg-sky-50 text-sky-700 border-sky-200",
          text: "Engineering High-Performance B2B Software Solutions That Scale Tech Infrastructure 3x Faster.",
          characterCount: 97,
          impactScore: "+38% engagement predicted",
          reasoning: "Uses action-driven verbs and quantifies business speed to instantly establish credibility.",
        },
        {
          id: 2,
          angle: "Result & Conversion-Oriented",
          badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200",
          text: "We Build Enterprise-Grade Cloud & Custom Software So Tech Leaders Can Focus On Growth.",
          characterCount: 92,
          impactScore: "+45% click-through predicted",
          reasoning: "Directly addresses the primary target audience pain point and outcome.",
        },
        {
          id: 3,
          angle: "Modern & Minimalist",
          badgeStyle: "bg-purple-50 text-purple-700 border-purple-200",
          text: "Architecting Next-Generation IT Infrastructure for Ambitious Digital Enterprises.",
          characterCount: 84,
          impactScore: "+25% clarity predicted",
          reasoning: "Sleek, high-concept positioning tailored for modern tech decision-makers.",
        },
      ]);
      setLoading(false);
    }, 1100);
  };

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white p-10 font-sans text-slate-800">
      {/* Breadcrumb & Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <nav className="mb-2 text-xs font-medium text-slate-400">
            Workspace / <span className="text-slate-600 font-semibold">Optimization Engine</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            AI Profile & Page Optimization
          </h1>
        </div>
        <Link
          href="/generation"
          className="inline-flex items-center gap-2 rounded-xl bg-[#4a7aa8] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#3f6a94]"
        >
          Next: Content Generator <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* KPI Stat Cards Row */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <SlidersHorizontal className="absolute right-6 top-6 h-5 w-5 text-slate-300" />
          <span className="text-xs font-medium text-slate-400">Target Field</span>
          <div className="mt-2 text-xl font-black text-slate-900 capitalize truncate">
            {selectedField.replace("_", " ")}
          </div>
          <span className="mt-1 block text-xs font-medium text-slate-500">Active target selection</span>
        </div>

        <div className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <Layers className="absolute right-6 top-6 h-5 w-5 text-slate-300" />
          <span className="text-xs font-medium text-slate-400">Strategic Angles</span>
          <div className="mt-2 text-3xl font-black text-slate-900">
            {variations.length > 0 ? `${variations.length} Options` : "3 Ready"}
          </div>
          <span className="mt-1 block text-xs font-medium text-slate-500">AI rewrite variations</span>
        </div>

        <div className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <TrendingUp className="absolute right-6 top-6 h-5 w-5 text-slate-300" />
          <span className="text-xs font-medium text-slate-400">Avg Predicted Lift</span>
          <div className="mt-2 text-3xl font-black text-slate-900">+36%</div>
          <span className="mt-1 block text-xs font-medium text-slate-500">Based on AI strategy</span>
        </div>

        <div className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <CheckCircle2 className="absolute right-6 top-6 h-5 w-5 text-slate-300" />
          <span className="text-xs font-medium text-slate-400">Optimization Status</span>
          <div className="mt-2 text-3xl font-black text-slate-900">
            {appliedId ? "Option Applied" : variations.length > 0 ? "Variants Ready" : "Pending"}
          </div>
          <span className="mt-1 block text-xs font-medium text-slate-500">Current workflow phase</span>
        </div>
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Selector & Settings */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] lg:col-span-5">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="h-4 w-4 text-[#4a7aa8]" />
            <h2 className="text-base font-bold text-slate-900">Target Field Settings</h2>
          </div>

          <form onSubmit={handleGenerateVariations} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Select Field to Optimize
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  { id: "company_slogan", label: "Company Slogan" },
                  { id: "company_about", label: "Company Description" },
                  { id: "executive_headline", label: "Executive Headline" },
                  { id: "executive_bio", label: "Executive Bio / About" },
                ].map((field) => (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => setSelectedField(field.id)}
                    className={`rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                      selectedField === field.id
                        ? "border-[#4a7aa8] bg-[#4a7aa8]/5 text-[#4a7aa8]"
                        : "border-slate-100 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {field.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Current Draft / Original Text
              </label>
              <textarea
                rows={3}
                value={fieldInput.currentText}
                onChange={(e) => setFieldInput({ ...fieldInput, currentText: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs outline-none transition-all focus:border-[#4a7aa8]"
                placeholder="Paste your current text here..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Target Audience
              </label>
              <input
                type="text"
                value={fieldInput.targetAudience}
                onChange={(e) => setFieldInput({ ...fieldInput, targetAudience: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition-all focus:border-[#4a7aa8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Brand Tone
              </label>
              <select
                value={fieldInput.tone}
                onChange={(e) => setFieldInput({ ...fieldInput, tone: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium outline-none transition-all focus:border-[#4a7aa8]"
              >
                <option>Professional & Authoritative</option>
                <option>Bold & Action-Oriented</option>
                <option>Relatable & Conversational</option>
                <option>Innovative & Visionary</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating Options...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Generate 3 Optimized Variants
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Preview & Results */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {/* Active Comparison Preview Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Live Before & After Preview
            </h3>
            <div className="mt-3 rounded-xl border border-rose-100 bg-rose-50/40 p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                <AlertCircle className="h-4 w-4" /> Original Version
              </div>
              <p className="mt-1 text-xs font-medium text-slate-700">"{fieldInput.currentText}"</p>
            </div>
          </div>

          {/* AI Output Cards Feed or Empty State */}
          {variations.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Recommended AI Strategic Angles
              </h3>
              {variations.map((variant) => (
                <div
                  key={variant.id}
                  className={`relative rounded-2xl border bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all ${
                    appliedId === variant.id ? "border-emerald-500 ring-1 ring-emerald-500" : "border-slate-100"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <span className={`rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${variant.badgeStyle}`}>
                      {variant.angle}
                    </span>
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                      {variant.impactScore}
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-bold text-slate-900 leading-relaxed">
                    "{variant.text}"
                  </p>

                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    <strong className="text-slate-700">AI Logic:</strong> {variant.reasoning}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
                    <span>{variant.characterCount} Characters</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleCopy(variant.id, variant.text)}
                        className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-900"
                      >
                        {copiedId === variant.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedId === variant.id ? "Copied" : "Copy"}
                      </button>

                      <button
                        onClick={() => setAppliedId(variant.id)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                          appliedId === variant.id
                            ? "bg-emerald-600 text-white"
                            : "bg-[#4a7aa8] text-white hover:bg-[#3f6a94]"
                        }`}
                      >
                        {appliedId === variant.id ? <CheckCircle2 className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                        {appliedId === variant.id ? "Selected" : "Apply Option"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Standardized Empty State */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">No Variations Generated</h3>
              <p className="mt-1 max-w-sm text-xs text-slate-400">
                Choose a target field on the left and click "Generate 3 Optimized Variants" to compare strategic options.
              </p>
              <button
                onClick={handleGenerateVariations}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#4a7aa8] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#3f6a94]"
              >
                <Wand2 className="h-4 w-4" /> Run Rewrite Engine
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}