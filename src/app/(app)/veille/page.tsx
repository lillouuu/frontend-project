"use client";

import { useState, useEffect } from "react";
import {
  RefreshCw,
  Camera,
  Pause,
  Play,
  Bell,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  Sparkles,
} from "lucide-react";
import { useWatch } from "@/hooks/useWatch";
import { getMyCompanies } from "@/lib/api/company";
import type { AlertSeverity } from "@/types/watch";

const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  critical: "border-rose-200 bg-rose-50/60 text-rose-800",
  warning: "border-amber-200 bg-amber-50/60 text-amber-800",
  info: "border-sky-200 bg-sky-50/60 text-sky-800",
};

const SEVERITY_ICON: Record<AlertSeverity, typeof TrendingUp> = {
  critical: AlertTriangle,
  warning: TrendingDown,
  info: Info,
};

export default function VeillePage() {
  const {
    overview,
    watchStatus,
    loading,
    error,
    needsProfile,
    hasNoWatchYet,
    creating,
    createError,
    snapshotting,
    actionError,
    startWatching,
    takeSnapshot,
    toggleStatus,
    markRead,
  } = useWatch();

  const [candidates, setCandidates] = useState<{ id: string; name: string }[]>([]);
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([]);

  useEffect(() => {
    const currentCompanyId = typeof window !== "undefined" ? localStorage.getItem("company_id") : null;
    getMyCompanies()
      .then((companies) => setCandidates(companies.filter((c) => c.id !== currentCompanyId)))
      .catch(() => setCandidates([]));
  }, []);

  const toggleCompetitor = (id: string) => {
    setSelectedCompetitors((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">
        <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Loading monitoring data...
      </div>
    );
  }

  if (needsProfile) {
    return (
      <div className="min-h-screen bg-white px-8 py-6 font-sans">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700">
          Complete onboarding for a company before setting up monitoring.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white px-8 py-6 font-sans">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>
      </div>
    );
  }

  if (hasNoWatchYet) {
    return (
      <div className="min-h-screen bg-white px-8 py-6 font-sans">
        <div className="mb-8">
          <p className="mb-1 text-xs font-medium text-slate-400">Workspace / Veille</p>
          <h1 className="text-2xl font-bold text-slate-900">Continuous Monitoring</h1>
        </div>

        <div className="mx-auto max-w-lg rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Start monitoring your LinkedIn presence</h3>
          <p className="mt-2 text-xs text-slate-500">
            Take periodic snapshots of your audits to track score and engagement trends over
            time, with automatic alerts when something shifts significantly. Comparing against
            other companies is optional — you can start monitoring just your own account.
          </p>

          {candidates.length > 0 && (
            <>
              <label className="mt-5 block text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Compare against (optional)
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {candidates.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCompetitor(c.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      selectedCompetitors.includes(c.id)
                        ? "border-[#c9dcec] bg-[#eef4fa] text-[#2a6ba0]"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </>
          )}

          {createError && <p className="mt-3 text-xs font-medium text-rose-600">{createError}</p>}

          <button
            onClick={() => startWatching(selectedCompetitors)}
            disabled={creating}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0f1c33] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2f50] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating && <RefreshCw className="h-4 w-4 animate-spin" />}
            {creating ? "Starting..." : "Start Watching"}
          </button>
        </div>
      </div>
    );
  }

  if (!overview) return null;

  const metrics = overview.latest_snapshot?.metrics;
  const unreadCount = overview.recent_alerts.filter((a) => !a.read).length;

  return (
    <div className="min-h-screen bg-white px-8 py-6 font-sans">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-400">Workspace / Veille</p>
          <h1 className="text-2xl font-bold text-slate-900">Continuous Monitoring</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tracking your LinkedIn presence over time
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
                <Bell className="h-3 w-3" /> {unreadCount} new
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleStatus}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            {watchStatus === "active" ? (
              <>
                <Pause className="h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> Resume
              </>
            )}
          </button>
          <button
            onClick={takeSnapshot}
            disabled={snapshotting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#4a7aa8] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#3f6a94] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {snapshotting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            {snapshotting ? "Snapshotting..." : "Take Snapshot"}
          </button>
        </div>
      </div>

      {actionError && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {actionError}
        </div>
      )}

      {!metrics ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            No snapshots yet — click "Take Snapshot" to capture your latest audit's metrics and
            start tracking trends.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">LinkedIn Score</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{metrics.score_global}/100</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Engagement Rate</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{metrics.engagement_rate}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Publications</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{metrics.publications_count}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Engagement</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {metrics.total_reactions + metrics.total_comments + metrics.total_shares}
              </p>
            </div>
          </div>

          {overview.competitor_snapshots.length > 0 && (
            <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-slate-900">Competitor comparison</h3>
              <div className="flex flex-col gap-2">
                {overview.competitor_snapshots.map((c, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs">
                    <span className="font-semibold text-slate-700">{c.name}</span>
                    <span className="text-slate-500">
                      Score: <strong className="text-slate-900">{c.metrics.score_global}</strong>
                      {" · "}
                      Engagement: <strong className="text-slate-900">{c.metrics.engagement_rate}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
              <Sparkles className="h-4 w-4 text-[#4a7aa8]" /> AI Analysis
            </h3>
            {overview.ai_analysis ? (
              <p className="whitespace-pre-line text-xs leading-relaxed text-slate-600">{overview.ai_analysis}</p>
            ) : (
              <p className="text-xs text-slate-400">
                No AI analysis available for this snapshot — this can happen occasionally and
                isn't necessarily an error. Take another snapshot later to try again.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-slate-900">Recent alerts</h3>
            {overview.recent_alerts.length === 0 ? (
              <p className="text-xs text-slate-400">No alerts yet.</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {overview.recent_alerts.map((alert) => {
                  const Icon = SEVERITY_ICON[alert.severity];
                  return (
                    <div
                      key={alert.id}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-xs ${SEVERITY_STYLES[alert.severity]} ${
                        alert.read ? "opacity-50" : ""
                      }`}
                    >
                      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold">{alert.title}</p>
                        {alert.detail && <p className="mt-0.5 opacity-80">{alert.detail}</p>}
                      </div>
                      {!alert.read && (
                        <button
                          onClick={() => markRead(alert.id)}
                          className="flex-shrink-0 rounded-lg border border-current px-2 py-1 text-[10px] font-semibold hover:bg-white/50"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}