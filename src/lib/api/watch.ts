import { apiFetch } from "@/lib/apiClient";
import type {
  WatchCreate,
  WatchUpdate,
  WatchResponse,
  WatchSnapshotResponse,
  WatchAlertResponse,
  VeilleOverview,
} from "@/types/watch";

// UNCONFIRMED PREFIX: following the same /api/<resource> pattern every
// other router this session turned out to use (audits, optimizations,
// generations, benchmarks, calendars all had none, no extra segment).
// Verify /api/watches against the live Swagger UI before trusting this —
// same caution as calendar.ts, which turned out correct but wasn't a sure
// thing until checked.

export function createWatch(payload: WatchCreate): Promise<WatchResponse> {
  return apiFetch<WatchResponse>("/api/watches", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getWatch(watchId: string): Promise<WatchResponse> {
  return apiFetch<WatchResponse>(`/api/watches/${watchId}`);
}

export function updateWatch(watchId: string, payload: WatchUpdate): Promise<WatchResponse> {
  return apiFetch<WatchResponse>(`/api/watches/${watchId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteWatch(watchId: string): Promise<void> {
  return apiFetch<void>(`/api/watches/${watchId}`, { method: "DELETE" });
}

// NOTE: audit_id is a query parameter on the real route, not a JSON body —
// confirmed directly from the FastAPI function signature
// (create_snapshot(watch_id, audit_id: uuid.UUID, ...) with no Pydantic
// body model), easy to get wrong if you assume it's JSON like everything
// else in this app.
export function createSnapshot(watchId: string, auditId: string): Promise<WatchSnapshotResponse> {
  return apiFetch<WatchSnapshotResponse>(
    `/api/watches/${watchId}/snapshots?audit_id=${auditId}`,
    { method: "POST" }
  );
}

export function listSnapshots(watchId: string): Promise<WatchSnapshotResponse[]> {
  return apiFetch<WatchSnapshotResponse[]>(`/api/watches/${watchId}/snapshots`);
}

export function listAlerts(watchId: string): Promise<WatchAlertResponse[]> {
  return apiFetch<WatchAlertResponse[]>(`/api/watches/${watchId}/alerts`);
}

export function markAlertRead(watchId: string, alertId: string): Promise<WatchAlertResponse> {
  return apiFetch<WatchAlertResponse>(`/api/watches/${watchId}/alerts/${alertId}`, {
    method: "PATCH",
  });
}

export function getVeilleOverview(watchId: string): Promise<VeilleOverview> {
  return apiFetch<VeilleOverview>(`/api/watches/${watchId}/overview`);
}