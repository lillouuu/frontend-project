"use client";

import { FileText, Download, Eye, Plus, ArrowUpRight } from "lucide-react";

const reports = [
  {
    id: 1,
    title: "LinkedIn Audit Report — July 2026",
    date: "Jul 22, 2026",
    score: 63,
    type: "Full audit",
    scoreColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
];

const stats = [
  { label: "Total reports", value: "1" },
  { label: "Current score", value: "63" },
  { label: "Last report", value: "Jul 22, 2026" },
];

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-white px-8 py-6 font-sans">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-400">Workspace / Reports</p>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="mt-1 text-sm text-slate-500">Track your LinkedIn score evolution over time.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-[#0f1c33] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2f50]">
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

      {/* Score evolution placeholder */}
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Score evolution</h2>
            <p className="text-xs text-slate-400">Track your LinkedIn score over time</p>
          </div>
          <div className="flex gap-1 overflow-hidden rounded-xl border border-slate-200">
            {["1m", "3m", "6m", "All"].map((t) => (
              <button key={t} className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 border-r border-slate-200 last:border-0 first:bg-slate-50 first:text-slate-900">
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex h-40 items-end gap-3 border-b border-l border-slate-100 px-4 pb-2">
          {[
            { month: "May", score: 0 },
            { month: "Jun", score: 0 },
            { month: "Jul", score: 63 },
          ].map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-bold text-slate-700">{d.score > 0 ? d.score : ""}</span>
              <div
                className="w-full rounded-t-lg bg-[#4a7aa8] transition-all"
                style={{ height: `${(d.score / 100) * 120}px`, minHeight: d.score > 0 ? "4px" : "0" }}
              />
              <span className="text-[10px] text-slate-400">{d.month}</span>
            </div>
          ))}
          {Array(9).fill(null).map((_, i) => (
            <div key={i + 3} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-bold text-slate-700"></span>
              <div className="w-full rounded-t-lg bg-slate-100" style={{ height: "0px" }} />
              <span className="text-[10px] text-slate-400"></span>
            </div>
          ))}
        </div>
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
                  <button className="rounded-xl border border-slate-200 p-2 hover:bg-slate-100">
                    <Eye className="h-4 w-4 text-slate-500" />
                  </button>
                  <button className="rounded-xl border border-slate-200 p-2 hover:bg-slate-100">
                    <Download className="h-4 w-4 text-slate-500" />
                  </button>
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
            <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#4a7aa8] px-4 py-2 text-xs font-bold text-white hover:bg-[#3f6a94]">
              <ArrowUpRight className="h-3.5 w-3.5" /> Go to Audit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}