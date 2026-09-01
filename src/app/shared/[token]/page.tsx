"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FileText, BarChart3, CalendarDays, Eye, Download, Loader2, Sparkles } from "lucide-react";
import { getSharedReportHistory, getReportPdfByUrl, openPdfBlob, downloadPdfBlob } from "@/lib/api/reports";
import type { HistoryEntry } from "@/types/reports";

// Public page — genuinely no login required, matches GET /api/reports/shared/{token}
// exactly. NOT inside the (app) route group (no sidebar, no useRequireAuth
// guard) since this needs to work for someone with zero account at all.

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

function entryKey(entry: HistoryEntry): string {
  return `${entry.type}-${entry.id ?? entry.month}`;
}

export default function SharedReportPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token;

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    getSharedReportHistory(token)
      .then((result) => setHistory(result.reports))
      .catch((err) => {
        console.warn("Failed to load shared report history:", err);
        // 404/410/403 all land here — invalid, revoked, or expired link.
        // The backend distinguishes these server-side but doesn't need to
        // for the visitor: any of them just means "this link doesn't work".
        setError("This share link is invalid, has expired, or has been revoked.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleView = async (entry: HistoryEntry) => {
    setPdfError(null);
    setBusyKey(`view-${entryKey(entry)}`);
    try {
      const blob = await getReportPdfByUrl(entry.url);
      openPdfBlob(blob);
    } catch (err) {
      console.warn("Failed to open report:", err);
      setPdfError("Couldn't open this report.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleDownload = async (entry: HistoryEntry) => {
    setPdfError(null);
    setBusyKey(`download-${entryKey(entry)}`);
    try {
      const blob = await getReportPdfByUrl(entry.url);
      const safeTitle = entry.titre.replace(/[^\w-]+/g, "_");
      downloadPdfBlob(blob, `${safeTitle}.pdf`);
    } catch (err) {
      console.warn("Failed to download report:", err);
      setPdfError("Couldn't download this report.");
    } finally {
      setBusyKey(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-800">{error}</p>
          <p className="mt-1 text-xs text-slate-400">Ask whoever sent you this link for a new one.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 font-sans">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4a7aa8]">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="text-sm font-bold text-slate-900">LinkedIn AI Advisor</div>
        </div>

        <h1 className="text-xl font-bold text-slate-900">Shared Reports</h1>
        <p className="mt-1 text-sm text-slate-500">Read-only — no login required.</p>

        {pdfError && (
          <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            {pdfError}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {history.length > 0 ? (
            history.map((entry) => {
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
                      onClick={() => handleView(entry)}
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
                      onClick={() => handleDownload(entry)}
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
            })
          ) : (
            <p className="text-sm text-slate-400">No reports available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}