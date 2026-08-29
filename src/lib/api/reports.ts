import { apiFetchBlob } from "@/lib/apiClient";

export function getAuditReportPdf(auditId: string): Promise<Blob> {
  return apiFetchBlob(`/api/reports/audit/${auditId}`);
}

// month format: "YYYY-MM" — e.g. "2026-08"
export function getMonthlyReportPdf(companyId: string, month: string): Promise<Blob> {
  return apiFetchBlob(`/api/reports/monthly?company_id=${companyId}&month=${month}`);
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

// Helper for "Generate report" — current month in the YYYY-MM format the
// backend expects.
export function currentMonthString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}