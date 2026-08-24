import { apiFetch } from "@/lib/apiClient";
import type { Company, CompanyCreateRequest } from "@/types/company";

export function createCompany(payload: CompanyCreateRequest): Promise<Company> {
  return apiFetch<Company>("/api/companies/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMyCompanies(): Promise<Company[]> {
  return apiFetch<Company[]>("/api/companies/me");
}

export function updateCompany(
  id: string,
  payload: Partial<CompanyCreateRequest>
): Promise<Company> {
  return apiFetch<Company>(`/api/companies/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}