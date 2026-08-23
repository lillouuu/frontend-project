import { apiFetch } from "@/lib/apiClient";
import type { GenerationRequest, GenerationResponse } from "@/types/generation";

export function createGeneration(
  payload: GenerationRequest
): Promise<GenerationResponse> {
  return apiFetch<GenerationResponse>("/api/generations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}