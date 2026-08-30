// Matches backend/schemas/watchschema.py, plus the real metrics shape
// produced by backend/services/veille.py's _extract_metrics() — that
// function's dict isn't typed by Pydantic (WatchSnapshotResponse.metrics
// is just `dict`), so this is read from the actual source, not guessed.

export type WatchStatus = "active" | "paused";

export type AlertType =
  | "score_drop"
  | "score_improve"
  | "competitor_growth"
  | "engagement_spike"
  | "engagement_drop"
  | "trend_detected"
  | "opportunity";

export type AlertSeverity = "info" | "warning" | "critical";

export interface WatchCreate {
  company_id: string;
  competitor_ids?: string[]; // optional — a watch with zero competitors is valid
}

export interface WatchUpdate {
  competitor_ids?: string[];
  status?: WatchStatus;
}

// Real shape from _extract_metrics() in veille.py — not in the Pydantic
// schema (typed there as a plain dict), read directly from the source.
export interface WatchMetrics {
  score_global: number;
  score_entreprise: number;
  score_dirigeant: number | null;
  publications_count: number;
  total_reactions: number;
  total_comments: number;
  total_shares: number;
  engagement_rate: number;
}

export interface WatchSnapshotResponse {
  id: string;
  audit_id: string | null;
  period: string; // ISO date
  metrics: WatchMetrics;
  created_at: string;
}

export interface WatchAlertResponse {
  id: string;
  alert_type: AlertType;
  title: string;
  detail: string | null;
  severity: AlertSeverity;
  read: boolean;
  created_at: string;
}

export interface WatchResponse {
  id: string;
  company_id: string;
  competitor_ids: string[] | null;
  frequency: string; // not settable via WatchCreate — server-assigned default
  status: string;
  latest_snapshot: WatchSnapshotResponse | null;
  created_at: string;
}

// Real shape from build_veille_overview() in veille.py.
export interface CompetitorSnapshot {
  name: string;
  metrics: WatchMetrics;
}

export interface VeilleOverview {
  watch_id: string;
  company_id: string;
  latest_snapshot: WatchSnapshotResponse | null;
  competitor_snapshots: CompetitorSnapshot[];
  recent_alerts: WatchAlertResponse[];
  // Reused from a hacky /api/optimisations call server-side that silently
  // swallows any failure — null here is normal and expected, not an error.
  ai_analysis: string | null;
}