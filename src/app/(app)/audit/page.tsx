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
  Loader2,
  Building2,
} from "lucide-react";
import { useAudit } from "@/hooks/useAudit";

type FilterType = "ALL" | "CRITIQUE" | "IMPORTANTE" | "OPTIMISATION";

export default function AuditPage() {
  const [filter, setFilter] = useState<FilterType>("ALL");
  const { auditData, recommendations, loading, error, isFallback, needsProfile, runAudit, refresh } = useAudit();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center h-full bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm font-medium">Running audit...</span>
        </div>
      </div>
    );
  }

  if (needsProfile) {
    return (
      <div className="flex flex-1 items-center justify-center h-full bg-slate-50">
        <div className="flex max-w-sm flex-col items-center gap-3 text-center">
          <Building2 className="h-6 w-6 text-amber-500" />
          <span className="text-sm font-semibold text-slate-800">
            No company profile found yet
          </span>
          <p className="text-xs text-slate-500">
            You need company info before an audit can run. Complete onboarding, or fill in your
            details in Settings.
          </p>
          <Link
            href="/settings"
            className="rounded-lg bg-[#0077B5] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#005f93]"
          >
            Go to Settings
          </Link>
        </div>
      </div>
    );
  }

  if (!auditData) {
    return (
      <div className="flex flex-1 items-center justify-center h-full bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-center">
          <XCircle className="h-6 w-6 text-rose-500" />
          <span className="text-sm font-medium text-slate-700">
            Couldn't load audit data.
          </span>
          <button
            onClick={refresh}
            className="rounded-lg bg-[#0077B5] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#005f93]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const { score_global, score_entreprise, score_detail, analyse_ia } = auditData;
  // score_dirigeant is nullable on the backend (no manager profile submitted) —
  // fall back to 0 so the gauge/bar don't render "null%".
  const score_dirigeant = auditData.score_dirigeant ?? 0;

  // Filter recommendations based on tab selection — recommendations now
  // come from the hook (a separate real entity), not analyse_ia.
  const filteredRecs =
    filter === "ALL"
      ? recommendations
      : recommendations.filter((r) => r.priorite === filter);

  // Group Evaluations by category for standard displaying
  const companyEvals = analyse_ia.evaluations.filter(
    (e) => e.categorie === "page_entreprise"
  );
  const managerEvals = analyse_ia.evaluations.filter(
    (e) => e.categorie === "dirigeant" || e.categorie === "coherence"
  );

  // Category sub scores mapping
  const companySubScore = score_detail.sous_scores_categories.find(
    (s) => s.code === "page_entreprise"
  );
  const managerSubScore = score_detail.sous_scores_categories.find(
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
            <div key={dotIndex} className={`h-2 w-2 rounded-full ${dotColor}`} />
          );
        })}
      </div>
    );
  };

  // Helper to format string criterion keys nicely
  const formatCriterionName = (key: string) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
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
          {isFallback && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
              Showing sample data — backend unreachable
            </span>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/reports"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <History size={14} /> History
          </Link>
          <button
            onClick={runAudit}
            className="flex items-center gap-1.5 rounded-lg bg-[#0077B5] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#005f93] transition-colors"
          >
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
                  stroke={score_global >= 75 ? "#10b981" : "#f59e0b"}
                  strokeDasharray={`${score_global}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center leading-none">
                <span className="text-3xl font-extrabold text-slate-900">
                  {score_global}
                </span>
                <span className="text-xs text-slate-400 font-medium">/100</span>
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-800">Overall Score</span>
            <span className="text-xs font-semibold text-emerald-600">
              {score_global >= 80 ? "Advanced" : "Intermediate"}
            </span>
          </div>

          <div className="flex flex-col justify-center gap-3.5">
            <span className="w-fit rounded-full border border-slate-200 bg-slate-100 px-3.5 py-1 text-xs font-medium text-slate-600">
              Company Page 70% · Manager Profile 30%
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">Company Page</span>
                  <span className="font-bold text-emerald-600">
                    {score_entreprise}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${score_entreprise}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">Manager Profile</span>
                  <span className="font-bold text-emerald-600">
                    {score_dirigeant}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${score_dirigeant}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-scores Itemized Lists */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Company Page</h3>
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
                <div key={i} className="flex items-center justify-between py-2 text-xs">
                  <span className="font-medium text-slate-700">
                    {formatCriterionName(item.critere)}
                  </span>
                  {renderDots(item.niveau)}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Manager Profile</h3>
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
                <div key={i} className="flex items-center justify-between py-2 text-xs">
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
            <h3 className="text-sm font-bold text-slate-900">Recommendations</h3>
            <div className="flex gap-1.5">
              {(["ALL", "CRITIQUE", "IMPORTANTE", "OPTIMISATION"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    filter === f
                      ? "bg-[#0077B5] font-semibold text-white"
                      : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {filteredRecs.map((rec) => {
              // Real recommendation_id + critere_code now — Optimization
              // no longer needs to guess these from keyword-matching text.
              const queryParams = new URLSearchParams({
                recommendation_id: rec.id,
                critere_code: rec.critere_code,
                action: rec.action,
                raison: rec.raison,
              }).toString();

              return (
                <div
                  key={rec.id}
                  className="flex items-start gap-3.5 rounded-lg border border-slate-200 bg-slate-50/60 p-3.5"
                >
                  <span
                    className={`mt-0.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      rec.priorite === "CRITIQUE" || rec.priorite === "CRITICAL"
                        ? "border-rose-200 bg-rose-50 text-rose-600"
                        : rec.priorite === "IMPORTANTE"
                        ? "border-amber-200 bg-amber-50 text-amber-600"
                        : "border-emerald-200 bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {rec.priorite}
                  </span>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-900">{rec.action}</div>
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
          <p className="text-xs leading-relaxed text-slate-600">{analyse_ia.synthese}</p>
        </div>
      </div>
    </div>
  );
}