import { apiFetch } from "@/lib/apiClient";
import type { AuditResponse, AuditRequest, AuditListResponse } from "@/types/audit";
import type { Recommendation } from "@/types/recommendation";

// Triggers a new audit.
export function createAudit(payload: AuditRequest): Promise<AuditResponse> {
  return apiFetch<AuditResponse>("/api/ai/audits", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// List past audits for a company (summary shape, not full detail) — real
// data for the Reports page's history.
export function getAuditsForCompany(companyId: string): Promise<AuditListResponse[]> {
  return apiFetch<AuditListResponse[]>(`/api/ai/audits/company/${companyId}`);
}

// Get one audit's full detail.
export function getAudit(auditId: string): Promise<AuditResponse> {
  return apiFetch<AuditResponse>(`/api/ai/audits/${auditId}`);
}

// Recommendations are a separate real entity, not part of the audit
// response itself — see types/recommendation.ts for why this matters.
export function getAuditRecommendations(auditId: string): Promise<Recommendation[]> {
  return apiFetch<Recommendation[]>(`/api/ai/audits/${auditId}/recommendations`);
}