import { apiFetch } from "@/lib/apiClient";
import type { AuditRequest, AuditResponse, AuditListResponse } from "@/types/audit";
import type { Recommendation } from "@/types/recommendation";

// Confirmed directly against the live Swagger UI (/docs, "ai" tag) — the
// real routes have NO /ai/ prefix. A previous pass "fixed" this by adding
// /ai/, which was actually a regression; this reverts it back to what the
// backend really serves.
export function createAudit(payload: AuditRequest): Promise<AuditResponse> {
  return apiFetch<AuditResponse>("/api/audits", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAuditsForCompany(companyId: string): Promise<AuditListResponse[]> {
  return apiFetch<AuditListResponse[]>(`/api/audits/company/${companyId}`);
}

export function getAudit(auditId: string): Promise<AuditResponse> {
  return apiFetch<AuditResponse>(`/api/audits/${auditId}`);
}

export function getAuditRecommendations(auditId: string): Promise<Recommendation[]> {
  return apiFetch<Recommendation[]>(`/api/audits/${auditId}/recommendations`);
}

// Also live on the backend (Swagger shows it) but not called from anywhere
// in the app yet: GET /api/audits/{audit_id}/optimizations — returns the
// optimizations already generated for a given audit. Might be useful later
// for showing "past optimizations" on the audit or reports page.