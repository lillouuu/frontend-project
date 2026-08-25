import { apiFetch } from "@/lib/apiClient";
import type { AuditRequest, AuditResponse, AuditListResponse } from "@/types/audit";
import type { Recommendation } from "@/types/recommendation";
import type { OptimisationResponse } from "@/types/optimization";

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

// Now used by useDashboard for the optimization-progress card — each
// item's `decision` field (null/"accept"/"modify"/"reject") drives the
// accepted/modified/rejected/pending counts.
export function getAuditOptimizations(auditId: string): Promise<OptimisationResponse[]> {
  return apiFetch<OptimisationResponse[]>(`/api/audits/${auditId}/optimizations`);
}