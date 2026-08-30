import { useState, useEffect, useCallback } from "react";
import {
  createWatch,
  updateWatch,
  createSnapshot,
  markAlertRead,
  getVeilleOverview,
} from "@/lib/api/watch";
import { getAuditsForCompany } from "@/lib/api/audit";
import { getCompanyData, setCompanyData } from "@/lib/companyStorage";
import { ApiError } from "@/lib/apiClient";
import type { VeilleOverview, WatchStatus } from "@/types/watch";

// There is no "get watch by company_id" endpoint — only single-watch-by-id
// operations. So the frontend has to remember its own watch_id after
// creating one; this stores it the same namespaced way as everything else
// (companyStorage.ts) so it survives logout/login for the same company.
export function useWatch() {
  const [overview, setOverview] = useState<VeilleOverview | null>(null);
  const [watchStatus, setWatchStatus] = useState<WatchStatus>("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [hasNoWatchYet, setHasNoWatchYet] = useState(false);

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [snapshotting, setSnapshotting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const getCompanyId = () =>
    typeof window !== "undefined" ? localStorage.getItem("company_id") : null;

  const getWatchId = (companyId: string) => getCompanyData("watch_id", companyId);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNeedsProfile(false);
    setHasNoWatchYet(false);

    const companyId = getCompanyId();
    if (!companyId) {
      setNeedsProfile(true);
      setLoading(false);
      return;
    }

    const watchId = getWatchId(companyId);
    if (!watchId) {
      setHasNoWatchYet(true);
      setLoading(false);
      return;
    }

    try {
      const result = await getVeilleOverview(watchId);
      setOverview(result);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        // Stored watch_id points at a watch that no longer exists (deleted,
        // or from stale data) — reset to setup state instead of erroring.
        setCompanyData("watch_id", companyId, "");
        setHasNoWatchYet(true);
      } else {
        console.warn("Loading veille overview failed:", err);
        setError(err instanceof Error ? err.message : "Failed to load monitoring data");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startWatching = useCallback(
    async (competitorIds: string[]) => {
      const companyId = getCompanyId();
      if (!companyId) {
        setNeedsProfile(true);
        return;
      }

      setCreating(true);
      setCreateError(null);
      try {
        const watch = await createWatch({ company_id: companyId, competitor_ids: competitorIds });
        setCompanyData("watch_id", companyId, watch.id);
        setHasNoWatchYet(false);
        await load();
      } catch (err) {
        setCreateError(err instanceof Error ? err.message : "Failed to start monitoring");
      } finally {
        setCreating(false);
      }
    },
    [load]
  );

  // Snapshots your own MOST RECENT existing audit — there's no way to
  // snapshot arbitrary data, only an audit you've already run.
  const takeSnapshot = useCallback(async () => {
    const companyId = getCompanyId();
    if (!companyId || !overview) return;

    setSnapshotting(true);
    setActionError(null);
    try {
      const audits = await getAuditsForCompany(companyId);
      const sorted = [...audits].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const latest = sorted[0];
      if (!latest) {
        setActionError("Run an audit first — there's nothing to snapshot yet.");
        return;
      }
      await createSnapshot(overview.watch_id, latest.id);
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to create snapshot");
    } finally {
      setSnapshotting(false);
    }
  }, [overview, load]);

  const toggleStatus = useCallback(async () => {
    if (!overview) return;
    const next: WatchStatus = watchStatus === "active" ? "paused" : "active";
    setActionError(null);
    try {
      await updateWatch(overview.watch_id, { status: next });
      setWatchStatus(next);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update status");
    }
  }, [overview, watchStatus]);

  const markRead = useCallback(
    async (alertId: string) => {
      if (!overview) return;
      try {
        await markAlertRead(overview.watch_id, alertId);
        setOverview((prev) =>
          prev
            ? {
                ...prev,
                recent_alerts: prev.recent_alerts.map((a) =>
                  a.id === alertId ? { ...a, read: true } : a
                ),
              }
            : prev
        );
      } catch (err) {
        setActionError(err instanceof Error ? err.message : "Failed to mark alert as read");
      }
    },
    [overview]
  );

  return {
    overview,
    watchStatus,
    loading,
    error,
    needsProfile,
    hasNoWatchYet,
    creating,
    createError,
    snapshotting,
    actionError,
    startWatching,
    takeSnapshot,
    toggleStatus,
    markRead,
    reload: load,
  };
}