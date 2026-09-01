// Confirmed against backend/schemas/reportshareschema.py.

export interface HistoryEntry {
  id: string | null;
  type: "audit" | "benchmark" | "monthly";
  titre: string;
  created_at: string | null;
  month: string | null;
  // Relative URL the backend already built correctly for this specific
  // entry (includes ?share=<token> automatically when fetched via the
  // shared/[token] page) — fetch this directly rather than reconstructing
  // it from id/type.
  url: string;
}

export interface ReportHistory {
  reports: HistoryEntry[];
}

export interface ReportShareCreateRequest {
  company_id: string;
  expires_at?: string | null; // "YYYY-MM-DD", optional — defaults to +7 days server-side
}

export interface ReportShareUrl {
  token: string;
  url: string;
  expires_at: string | null;
}

export interface ReportShareResponse {
  id: string;
  token: string;
  scope: string;
  company_id: string;
  audit_id: string | null;
  benchmark_id: string | null;
  month: string | null;
  expires_at: string | null;
  revoked: boolean;
  created_at: string;
}