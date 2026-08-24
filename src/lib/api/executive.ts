import { apiFetch } from "@/lib/apiClient";
import type { Executive, ExecutiveCreateRequest } from "@/types/executive";

export function createExecutive(payload: ExecutiveCreateRequest): Promise<Executive> {
  return apiFetch<Executive>("/api/executives/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getExecutive(id: string): Promise<Executive> {
  return apiFetch<Executive>(`/api/executives/${id}`);
}

export function updateExecutive(
  id: string,
  payload: Partial<Omit<ExecutiveCreateRequest, "company_id">>
): Promise<Executive> {
  return apiFetch<Executive>(`/api/executives/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}