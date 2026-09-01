import { useState, useEffect, useCallback } from "react";
import {
  getReportHistory,
  getReportPdfByUrl,
  createReportShare,
  revokeReportShare,
  openPdfBlob,
  downloadPdfBlob,
} from "@/lib/api/reports";
import type { HistoryEntry, ReportShareUrl } from "@/types/reports";

function entryKey(entry: HistoryEntry): string {
  return `${entry.type}-${entry.id ?? entry.month}`;
}

export function useReports() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // NOTE: there's no "list my share links" endpoint on the backend — only
  // create/revoke/fetch-by-token. So `shares` only ever holds links created
  // THIS session; refreshing the page loses track of previously created
  // (still-valid) links, even though they still work if you have the URL.
  // Real limitation, not a bug — flag to the team if a list endpoint would
  // help.
  const [shares, setShares] = useState<ReportShareUrl[]>([]);
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const companyId = typeof window !== "undefined" ? localStorage.getItem("company_id") : null;
    if (!companyId) {
      setError("No company found — complete onboarding first.");
      setLoading(false);
      return;
    }
    try {
      const result = await getReportHistory(companyId);
      setHistory(result.reports);
    } catch (err) {
      console.warn("Failed to load report history:", err);
      setError(err instanceof Error ? err.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const viewEntry = useCallback(async (entry: HistoryEntry) => {
    const key = `view-${entryKey(entry)}`;
    setPdfError(null);
    setBusyKey(key);
    try {
      const blob = await getReportPdfByUrl(entry.url);
      openPdfBlob(blob);
    } catch (err) {
      console.warn("Failed to open report:", err);
      setPdfError(err instanceof Error ? err.message : "Failed to open report");
    } finally {
      setBusyKey(null);
    }
  }, []);

  const downloadEntry = useCallback(async (entry: HistoryEntry) => {
    const key = `download-${entryKey(entry)}`;
    setPdfError(null);
    setBusyKey(key);
    try {
      const blob = await getReportPdfByUrl(entry.url);
      const safeTitle = entry.titre.replace(/[^\w-]+/g, "_");
      downloadPdfBlob(blob, `${safeTitle}.pdf`);
    } catch (err) {
      console.warn("Failed to download report:", err);
      setPdfError(err instanceof Error ? err.message : "Failed to download report");
    } finally {
      setBusyKey(null);
    }
  }, []);

  const createShare = useCallback(async () => {
    const companyId = typeof window !== "undefined" ? localStorage.getItem("company_id") : null;
    if (!companyId) {
      setShareError("No company found.");
      return;
    }
    setSharing(true);
    setShareError(null);
    try {
      const result = await createReportShare({ company_id: companyId });
      setShares((prev) => [result, ...prev]);
    } catch (err) {
      console.warn("Failed to create share link:", err);
      setShareError(err instanceof Error ? err.message : "Failed to create share link");
    } finally {
      setSharing(false);
    }
  }, []);

  const revokeShare = useCallback(async (token: string) => {
    setShareError(null);
    try {
      await revokeReportShare(token);
      setShares((prev) => prev.filter((s) => s.token !== token));
    } catch (err) {
      console.warn("Failed to revoke share link:", err);
      setShareError(err instanceof Error ? err.message : "Failed to revoke link");
    }
  }, []);

  return {
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
  };
}