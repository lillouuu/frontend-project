import { apiFetch } from "@/lib/apiClient";
import type { AuditRequest, AuditResponse, AuditListResponse } from "@/types/audit";
import type { Recommendation } from "@/types/recommendation";

// FIX: this was reverted to /api/audits (missing /ai/) — confirmed wrong
// against the real backend README + routers. Correct path is /api/ai/audits.
export function createAudit(payload: AuditRequest): Promise<AuditResponse> {
  return apiFetch<AuditResponse>("/api/ai/audits", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAuditsForCompany(companyId: string): Promise<AuditListResponse[]> {
  return apiFetch<AuditListResponse[]>(`/api/ai/audits/company/${companyId}`);
}

export function getAudit(auditId: string): Promise<AuditResponse> {
  return apiFetch<AuditResponse>(`/api/ai/audits/${auditId}`);
}

// FIX: same missing /ai/ prefix here too.
export function getAuditRecommendations(auditId: string): Promise<Recommendation[]> {
  return apiFetch<Recommendation[]>(`/api/ai/audits/${auditId}/recommendations`);
}