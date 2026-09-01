import { apiFetch, apiFetchBlob } from "@/lib/apiClient";
import type {
  ReportHistory,
  ReportShareCreateRequest,
  ReportShareUrl,
  ReportShareResponse,
} from "@/types/reports";

export function getReportHistory(companyId: string): Promise<ReportHistory> {
  return apiFetch<ReportHistory>(`/api/reports/history?company_id=${companyId}`);
}

// Fetches any report PDF by the relative URL a HistoryEntry already
// provides — works uniformly for audit/benchmark/monthly, and for the
// share-token variant too (the backend appends ?share=<token> itself when
// building history for a shared link, so this needs no special-casing).
export function getReportPdfByUrl(relativeUrl: string): Promise<Blob> {
  return apiFetchBlob(relativeUrl);
}

export function createReportShare(payload: ReportShareCreateRequest): Promise<ReportShareUrl> {
  return apiFetch<ReportShareUrl>("/api/reports/share", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function revokeReportShare(token: string): Promise<ReportShareResponse> {
  return apiFetch<ReportShareResponse>(`/api/reports/share/${token}`, {
    method: "DELETE",
  });
}

// Public — no auth required. Used by the /shared/[token] page. apiFetch
// simply omits the Authorization header when there's no token in
// localStorage, which is exactly right for an anonymous visitor here.
export function getSharedReportHistory(token: string): Promise<ReportHistory> {
  return apiFetch<ReportHistory>(`/api/reports/shared/${token}`);
}

export function openPdfBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export function downloadPdfBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function currentMonthString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}