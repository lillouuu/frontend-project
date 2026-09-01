"use client";

import { useState, useEffect } from "react";
import { FileText, BarChart3, CalendarDays, Download, Eye, Loader2, Share2, Copy, Trash2, X } from "lucide-react";
import { useReports } from "@/hooks/useReports";
import { getAuditsForCompany } from "@/lib/api/audit";
import type { AuditListResponse } from "@/types/audit";
import type { HistoryEntry } from "@/types/reports";

const TYPE_ICON: Record<HistoryEntry["type"], typeof FileText> = {
  audit: FileText,
  benchmark: BarChart3,
  monthly: CalendarDays,
};

const TYPE_LABEL: Record<HistoryEntry["type"], string> = {
  audit: "Audit",
  benchmark: "Benchmark",
  monthly: "Monthly synthesis",
};

export default function ReportsPage() {
  const {
    history,
    loading,
    error,
    busyKey,
    pdfError,
    viewEntry,
    downloadEntry,
    shares,
    sharing,
    shareError,
    createShare,
    revokeShare,
  } = useReports();

  const [pastAudits, setPastAudits] = useState<AuditListResponse[]>([]);
  const [showSharePanel, setShowSharePanel] = useState(false);

  useEffect(() => {
    const companyId = typeof window !== "undefined" ? localStorage.getItem("company_id") : null;
    if (!companyId) return;
    getAuditsForCompany(companyId)
      .then((audits) => setPastAudits([...audits].sort((a, b) => a.created_at.localeCompare(b.created_at))))
      .catch(() => setPastAudits([]));
  }, []);

  const entryKey = (entry: HistoryEntry) => `${entry.type}-${entry.id ?? entry.month}`;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm font-medium">Loading reports...</span>
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

  const currentScore = pastAudits[pastAudits.length - 1]?.score_global ?? 0;
  const lastReportDate = history[0]?.created_at
    ? new Date(history[0].created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "—";

  const stats = [
    { label: "Total reports", value: String(history.length) },
    { label: "Current score", value: String(currentScore) },
    { label: "Last report", value: lastReportDate },
  ];

  return (
    <div className="min-h-screen bg-white px-8 py-6 font-sans">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-400">Workspace / Reports</p>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="mt-1 text-sm text-slate-500">
            Audits, benchmarks, and monthly syntheses — all in one place.
          </p>
          {pdfError && (
            <span className="mt-2 inline-block rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs text-rose-700">
              {pdfError}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowSharePanel(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0f1c33] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2f50]"
        >
          <Share2 className="h-4 w-4" /> Share reports
        </button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="text-xs font-medium text-slate-400">{s.label}</div>
            <div className="mt-2 text-2xl font-black text-slate-900">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-slate-900">Score evolution</h2>
        {pastAudits.length > 0 ? (
          <div className="flex h-40 items-end gap-3 border-b border-l border-slate-100 px-4 pb-2">
            {pastAudits.slice(-12).map((a, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-bold text-slate-700">{a.score_global}</span>
                <div
                  className="w-full rounded-t-lg bg-[#4a7aa8] transition-all"
                  style={{ height: `${(a.score_global / 100) * 120}px`, minHeight: "4px" }}
                />
                <span className="text-[10px] text-slate-400">
                  {new Date(a.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
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
        <h2 className="mb-4 text-base font-bold text-slate-900">Reports history</h2>

        {history.length > 0 ? (
          <div className="flex flex-col gap-3">
            {history.map((entry) => {
              const Icon = TYPE_ICON[entry.type];
              const key = entryKey(entry);
              return (
                <div key={key} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#eef4fa]">
                    <Icon className="h-5 w-5 text-[#4a7aa8]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">{entry.titre}</div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                      {entry.created_at && (
                        <span>{new Date(entry.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                      )}
                      <span className="rounded-full border border-slate-200 px-2.5 py-0.5 font-semibold">
                        {TYPE_LABEL[entry.type]}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => viewEntry(entry)}
                      disabled={busyKey === `view-${key}`}
                      className="rounded-xl border border-slate-200 p-2 hover:bg-slate-100 disabled:opacity-50"
                      aria-label="View report"
                    >
                      {busyKey === `view-${key}` ? (
                        <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-500" />
                      )}
                    </button>
                    <button
                      onClick={() => downloadEntry(entry)}
                      disabled={busyKey === `download-${key}`}
                      className="rounded-xl border border-slate-200 p-2 hover:bg-slate-100 disabled:opacity-50"
                      aria-label="Download report"
                    >
                      {busyKey === `download-${key}` ? (
                        <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                      ) : (
                        <Download className="h-4 w-4 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
              <FileText className="h-6 w-6 text-slate-300" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900">No reports yet</h3>
            <p className="mt-1 text-xs text-slate-400">Run an audit or benchmark to generate your first report.</p>
          </div>
        )}
      </div>

      {showSharePanel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setShowSharePanel(false)}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Share reports</h3>
              <button onClick={() => setShowSharePanel(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Anyone with the link can view this company's report history — no login required.
              Links expire after 7 days by default and can be revoked any time.
            </p>

            {shareError && <p className="mt-2 text-xs font-semibold text-rose-600">{shareError}</p>}

            <button
              onClick={() => createShare()}
              disabled={sharing}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#4a7aa8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3f6a94] disabled:opacity-50"
            >
              {sharing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {sharing ? "Creating..." : "Create new share link"}
            </button>

            {shares.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                {shares.map((s) => {
                  // FIX: s.url is a backend-relative API path
                  // (/api/reports/shared/{token}) — correct from the
                  // backend's own perspective, but wrong to glue onto the
                  // frontend's origin. The real shareable link is the
                  // frontend page we built at /shared/{token}.
                  const shareLink = `${window.location.origin}/shared/${s.token}`;
                  return (
                    <div key={s.token} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="flex-1 truncate text-xs text-slate-600">{shareLink}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(shareLink)}
                        className="rounded-lg border border-slate-200 p-1.5 hover:bg-white"
                        aria-label="Copy link"
                      >
                        <Copy className="h-3.5 w-3.5 text-slate-500" />
                      </button>
                      <button
                        onClick={() => revokeShare(s.token)}
                        className="rounded-lg border border-rose-200 p-1.5 hover:bg-rose-50"
                        aria-label="Revoke link"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}