"use client";

import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Zap,
  ArrowUpRight,
  Activity,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Target,
  Building2,
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";

export default function Dashboard() {
  const { data, loading, isFallback, needsProfile, reload } = useDashboard();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (needsProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex max-w-sm flex-col items-center gap-3 text-center">
          <Building2 className="h-6 w-6 text-amber-500" />
          <span className="text-sm font-semibold text-slate-800">No company profile found yet</span>
          <p className="text-xs text-slate-500">Complete onboarding or fill in Settings to see your dashboard.</p>
          <Link href="/settings" className="rounded-lg bg-[#0f1c33] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1a2f50]">
            Go to Settings
          </Link>
        </div>
      </div>
    );
  }

  const scoreValue = data?.linkedin_score ?? 0;
  const scoreBadge = scoreValue >= 80 ? "Advanced" : scoreValue >= 50 ? "Intermediate" : "Needs work";
  const scoreBadgeStyle =
    scoreValue >= 80
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
      : scoreValue >= 50
      ? "bg-amber-50 text-amber-700 border border-amber-200"
      : "bg-rose-50 text-rose-700 border border-rose-200";

  const evolution = data?.score_evolution ?? [];
  const engagement = data?.engagement;
  const recPriority = data?.recommendations_priority;
  const optProgress = data?.optimization_progression;
  const objectives = data?.objectives_tracking;

  const totalRecs = (recPriority?.critique ?? 0) + (recPriority?.importante ?? 0) + (recPriority?.optimisation ?? 0);

  return (
    <div className="min-h-screen bg-white px-8 py-6 font-sans">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-400">Workspace / Dashboard</p>
          <h1 className="text-2xl font-bold text-slate-900">Good morning</h1>
          <p className="mt-1 text-sm text-slate-500">Here's your LinkedIn presence overview for today.</p>
          {isFallback && (
            <span className="mt-2 inline-block rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
              Showing sample data — backend unreachable
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={reload}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0f1c33] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a2f50]"
          >
            <Zap className="h-4 w-4" /> Run Audit
          </Link>
        </div>
      </div>

      {/* Top stat cards — Followers card removed entirely: no backend
          source exists for it anywhere in the confirmed schema. Replaced
          with real fields: publication_frequency and avg_engagement. */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-start justify-between">
            <span className="text-sm font-medium text-slate-500">LinkedIn Score</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
              <BarChart3 className="h-4 w-4 text-slate-400" />
            </div>
          </div>
          <div className="mb-1 flex items-end gap-1">
            <span className="text-3xl font-black text-slate-900">{scoreValue}</span>
            <span className="mb-1 text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${scoreBadgeStyle}`}>{scoreBadge}</span>
            <Link href="/audit" className="flex items-center gap-1 text-xs font-semibold text-[#4a7aa8] hover:underline">
              View audit <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-start justify-between">
            <span className="text-sm font-medium text-slate-500">Avg. Engagement</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </div>
          </div>
          <div className="mb-1 flex items-end gap-1">
            <span className="text-3xl font-black text-slate-900">{engagement?.avg_engagement ?? 0}%</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            {engagement?.total_reactions ?? 0} reactions · {engagement?.total_comments ?? 0} comments · {engagement?.total_shares ?? 0} shares
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-start justify-between">
            <span className="text-sm font-medium text-slate-500">Publication Frequency</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
              <Activity className="h-4 w-4 text-slate-400" />
            </div>
          </div>
          <div className="mb-1 flex items-end gap-1">
            <span className="text-3xl font-black text-slate-900">{data?.publication_frequency ?? 0}</span>
            <span className="mb-1 text-xs text-slate-400">posts</span>
          </div>
          <div className="mt-3">
            <Link href="/content" className="flex items-center gap-1 text-xs font-semibold text-[#4a7aa8] hover:underline">
              Generate content <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-6">
          {/* Score evolution — real historical trend, not a static category
              breakdown (that's the Audit page's job, using real per-criteria
              data this endpoint doesn't include). */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Score evolution</h2>
                <p className="text-xs text-slate-400">Your LinkedIn score over time</p>
              </div>
              <Link href="/audit" className="flex items-center gap-1 text-xs font-semibold text-[#4a7aa8] hover:underline">
                Full report <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            {evolution.length > 0 ? (
              <div className="flex h-40 items-end gap-3 border-b border-l border-slate-100 px-4 pb-2">
                {evolution.slice(-12).map((point, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-xs font-bold text-slate-700">{point.score_global}</span>
                    <div
                      className="w-full rounded-t-lg bg-[#4a7aa8] transition-all"
                      style={{ height: `${(point.score_global / 100) * 120}px`, minHeight: "4px" }}
                    />
                    <span className="text-[10px] text-slate-400">
                      {new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-xl bg-slate-50 text-xs text-slate-400">
                No audit history yet — run your first audit to start tracking.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Priority recommendations</h2>
                <p className="text-xs text-slate-400">Counts by priority — see the Audit page for full details</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                {totalRecs} total
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Critique", value: recPriority?.critique ?? 0, style: "text-rose-700 bg-rose-50 border-rose-200" },
                { label: "Importante", value: recPriority?.importante ?? 0, style: "text-amber-700 bg-amber-50 border-amber-200" },
                { label: "Optimisation", value: recPriority?.optimisation ?? 0, style: "text-emerald-700 bg-emerald-50 border-emerald-200" },
              ].map((item) => (
                <div key={item.label} className={`rounded-xl border p-4 text-center ${item.style}`}>
                  <div className="text-2xl font-black">{item.value}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide">{item.label}</div>
                </div>
              ))}
            </div>
            <Link href="/audit" className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              View all recommendations <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-slate-900">Quick actions</h2>
            <div className="flex flex-col gap-2">
              {[
                { href: "/optimization", icon: CheckCircle2, label: "Optimize my page" },
                { href: "/content", icon: Zap, label: "Generate content" },
                { href: "/benchmark", icon: BarChart3, label: "Compare competitors" },
                { href: "/audit", icon: RefreshCw, label: "Run new audit" },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={i}
                    href={action.href}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef4fa]">
                      <Icon className="h-4 w-4 text-[#4a7aa8]" />
                    </div>
                    {action.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* New — didn't exist before, real data from the dashboard endpoint */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-slate-900">Optimization progress</h2>
            {optProgress && optProgress.total > 0 ? (
              <div className="flex flex-col gap-3">
                {[
                  { label: "Accepted", value: optProgress.accepted, color: "bg-emerald-500" },
                  { label: "Modified", value: optProgress.modified, color: "bg-amber-500" },
                  { label: "Rejected", value: optProgress.rejected, color: "bg-rose-500" },
                  { label: "Pending", value: optProgress.pending, color: "bg-slate-300" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600">{item.label}</span>
                      <span className="font-bold text-slate-900">{item.value}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${optProgress.total ? (item.value / optProgress.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No optimizations run yet.</p>
            )}
          </div>

          {/* New — objectives tracking, also didn't exist before */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-[#4a7aa8]" />
              <h2 className="text-base font-bold text-slate-900">Objectives</h2>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Score improvement</span>
                <span className="font-bold text-slate-900">
                  {objectives?.score_improvement != null ? `+${objectives.score_improvement}` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Recommendations</span>
                <span className="font-bold text-slate-900">{objectives?.total_recommendations ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Optimizations run</span>
                <span className="font-bold text-slate-900">{objectives?.total_optimizations ?? 0}</span>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">Completion rate</span>
                  <span className="font-bold text-slate-900">{Math.round((objectives?.completion_rate ?? 0) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#4a7aa8]"
                    style={{ width: `${(objectives?.completion_rate ?? 0) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}