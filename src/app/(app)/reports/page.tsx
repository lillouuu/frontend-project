"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Eye, Plus, ArrowUpRight, Loader2 } from "lucide-react";
import { useAudit } from "@/hooks/useAudit";
import { getAuditsForCompany } from "@/lib/api/audit";
import type { AuditListResponse } from "@/types/audit";

// ---------------------------------------------------------------------------
// UPDATE: a real history endpoint DOES exist now — confirmed via the real
// backend — GET /api/ai/audits/company/{id} returns past audits (summary
// shape), and there's also a dedicated GET /api/reports/history for a
// richer PDF-report history. This page currently uses the simpler audits
// list; worth upgrading to /api/reports/history later for a fuller picture
// (it also includes benchmarks and monthly rollups, not just audits).
// ---------------------------------------------------------------------------

export default function ReportsPage() {
  const { auditData, loading, isFallback, runAudit } = useAudit();
  const [pastAudits, setPastAudits] = useState<AuditListResponse[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    const companyId = typeof window !== "undefined" ? localStorage.getItem("company_id") : null;
    if (!companyId) {
      setHistoryLoading(false);
      return;
    }
    getAuditsForCompany(companyId)
      .then(setPastAudits)
      .catch((err) => {
        console.warn("Could not load audit history:", err);
        setPastAudits([]);
      })
      .finally(() => setHistoryLoading(false));
  }, [auditData]); // re-fetch history whenever a new audit completes

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

  // Flat shape now — score_global is top-level, no more nested "score".
  const currentScore = auditData?.score_global ?? 0;

  const scoreColorFor = (score: number) =>
    score >= 80
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : score >= 50
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-rose-50 text-rose-700 border-rose-200";

  // Real history from the backend when available; empty if the company
  // has no company_id yet or the call failed (falls back gracefully,
  // doesn't block the rest of the page).
  const reports = pastAudits.map((audit) => ({
    id: audit.id,
    title: `LinkedIn Audit Report — ${new Date(audit.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`,
    date: new Date(audit.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    score: audit.score_global,
    type: "Full audit",
    scoreColor: scoreColorFor(audit.score_global),
  }));

  const lastReportDate = reports[0]?.date ?? "—";

  const stats = [
    { label: "Total reports", value: String(reports.length) },
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
            Track your LinkedIn score evolution over time.
          </p>
          {isFallback && (
            <span className="mt-2 inline-block rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
              Showing sample data — backend unreachable
            </span>
          )}
        </div>
        <button
          onClick={runAudit}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0f1c33] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2f50]"
        >
          <Plus className="h-4 w-4" /> Generate report
        </button>
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="text-xs font-medium text-slate-400">{s.label}</div>
            <div className="mt-2 text-2xl font-black text-slate-900">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Score evolution — now real data (list of past scores), just needs a chart */}
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Score evolution</h2>
            <p className="text-xs text-slate-400">Track your LinkedIn score over time</p>
          </div>
        </div>
        {historyLoading ? (
          <div className="flex h-40 items-center justify-center text-xs text-slate-400">
            Loading history...
          </div>
        ) : reports.length > 0 ? (
          <div className="flex h-40 items-end gap-3 border-b border-l border-slate-100 px-4 pb-2">
            {[...reports].reverse().slice(0, 12).map((r, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-bold text-slate-700">{r.score}</span>
                <div
                  className="w-full rounded-t-lg bg-[#4a7aa8] transition-all"
                  style={{ height: `${(r.score / 100) * 120}px`, minHeight: "4px" }}
                />
                <span className="text-[10px] text-slate-400">{r.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-xl bg-slate-50 text-xs text-slate-400">
            No audit history yet — run your first audit to start tracking.
          </div>
        )}
      </div>

      {/* Reports list */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-slate-900">Reports history</h2>

        {reports.length > 0 ? (
          <div className="flex flex-col gap-3">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#eef4fa]">
                  <FileText className="h-5 w-5 text-[#4a7aa8]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900">{report.title}</div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                    <span>{report.date}</span>
                    <span className={`rounded-full border px-2.5 py-0.5 font-bold ${report.scoreColor}`}>
                      score {report.score}/100
                    </span>
                    <span>{report.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* IMPORTANT: these are plain links, but /api/reports/audit/{id}
                      requires a Bearer token per the real backend (get_current_user_optional
                      only skips auth if a ?share= token is present). A plain <a> tag
                      navigation does NOT send the Authorization header, so clicking
                      these will 403 for a logged-in user right now. Needs a real fix:
                      either fetch the PDF with apiFetch() and open it as a blob URL,
                      or generate a share link first via POST /api/reports/share and
                      link to that instead. Left as a known gap, not silently shipped
                      as if it works. */}
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL || ""}/api/reports/audit/${report.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-slate-200 p-2 hover:bg-slate-100"
                  >
                    <Eye className="h-4 w-4 text-slate-500" />
                  </a>
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL || ""}/api/reports/audit/${report.id}`}
                    download
                    className="rounded-xl border border-slate-200 p-2 hover:bg-slate-100"
                  >
                    <Download className="h-4 w-4 text-slate-500" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
              <FileText className="h-6 w-6 text-slate-300" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900">No reports yet</h3>
            <p className="mt-1 text-xs text-slate-400">Run your first audit to generate a report.</p>
            <button
              onClick={runAudit}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#4a7aa8] px-4 py-2 text-xs font-bold text-white hover:bg-[#3f6a94]"
            >
              <ArrowUpRight className="h-3.5 w-3.5" /> Go to Audit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}