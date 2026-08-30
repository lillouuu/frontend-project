import { apiFetch } from "@/lib/apiClient";
import type { BenchmarkCreate, BenchmarkResponse } from "@/types/benchmark";

// Confirmed against the live route: no /ai/ prefix, matching the
// audit/optimization/generation pattern found earlier.
export function createBenchmark(payload: BenchmarkCreate): Promise<BenchmarkResponse> {
  return apiFetch<BenchmarkResponse>("/api/benchmarks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getBenchmark(benchmarkId: string): Promise<BenchmarkResponse> {
  return apiFetch<BenchmarkResponse>(`/api/benchmarks/${benchmarkId}`);
}

export function getCompanyBenchmarks(companyId: string): Promise<BenchmarkResponse[]> {
  return apiFetch<BenchmarkResponse[]>(`/api/benchmarks/company/${companyId}`);
}