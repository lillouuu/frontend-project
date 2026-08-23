import { apiFetch } from "@/lib/apiClient";
import type {
  OptimisationRequest,
  OptimisationResponse,
  OptimizationDecisionRequest,
  OptimizationVerdictResult,
} from "@/types/optimization";

export function createOptimisation(
  payload: OptimisationRequest
): Promise<OptimisationResponse> {
  return apiFetch<OptimisationResponse>("/api/ai/optimizations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getOptimization(optimizationId: string): Promise<OptimisationResponse> {
  return apiFetch<OptimisationResponse>(`/api/ai/optimizations/${optimizationId}`);
}

// The real accept/modify/reject feature.
export function submitOptimizationDecisions(
  payload: OptimizationDecisionRequest
): Promise<OptimizationVerdictResult[]> {
  return apiFetch<OptimizationVerdictResult[]>("/api/ai/optimizations/decisions", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}