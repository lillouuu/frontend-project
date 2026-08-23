import { apiFetch } from "@/lib/apiClient";
import type { Executive, ExecutiveCreateRequest } from "@/types/executive";

export function createExecutive(payload: ExecutiveCreateRequest): Promise<Executive> {
  return apiFetch<Executive>("/api/executives/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}