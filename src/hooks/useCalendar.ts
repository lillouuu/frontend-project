import { useState, useEffect, useCallback } from "react";
import {
  createCalendar,
  getCompanyCalendar,
  updateCalendarFrequence,
  generateSlotContent,
  deleteSlot as deleteSlotApi,
} from "@/lib/api/calendar";
import { ApiError } from "@/lib/apiClient";
import type { CalendarResponse, CalendarFrequence } from "@/types/calendar";

export function useCalendar() {
  const [calendar, setCalendar] = useState<CalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsProfile, setNeedsProfile] = useState(false);
  // True once we've confirmed via a 404 that no calendar exists yet for
  // this company — distinct from a real fetch failure, so the UI can show
  // "create your first calendar" instead of an error state.
  const [hasNoCalendarYet, setHasNoCalendarYet] = useState(false);

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [slotActionError, setSlotActionError] = useState<string | null>(null);
  const [slotActionLoadingId, setSlotActionLoadingId] = useState<string | null>(null);

  const getCompanyId = () =>
    typeof window !== "undefined" ? localStorage.getItem("company_id") : null;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNeedsProfile(false);
    setHasNoCalendarYet(false);

    const companyId = getCompanyId();
    if (!companyId) {
      setNeedsProfile(true);
      setLoading(false);
      return;
    }

    try {
      const result = await getCompanyCalendar(companyId);
      setCalendar(result);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setHasNoCalendarYet(true);
        setCalendar(null);
      } else {
        console.warn("Loading calendar failed:", err);
        setError(err instanceof Error ? err.message : "Failed to load calendar");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(async (frequence: CalendarFrequence) => {
    const companyId = getCompanyId();
    if (!companyId) {
      setNeedsProfile(true);
      return;
    }

    setCreating(true);
    setCreateError(null);
    try {
      // NOTE: this fires real, parallel Mistral calls for every generated
      // slot server-side before returning — not instant, and not free.
      const result = await createCalendar({ company_id: companyId, frequence });
      setCalendar(result);
      setHasNoCalendarYet(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create calendar");
    } finally {
      setCreating(false);
    }
  }, []);

  const changeFrequence = useCallback(async (frequence: CalendarFrequence) => {
    const companyId = getCompanyId();
    if (!companyId) return;

    setCreating(true);
    setCreateError(null);
    try {
      const result = await updateCalendarFrequence(companyId, { frequence });
      setCalendar(result);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to update frequency");
    } finally {
      setCreating(false);
    }
  }, []);

  // Retries generation for a slot stuck at "planifie" — the real recovery
  // path for the silent per-slot failures create_calendar can leave behind.
  const retrySlot = useCallback(async (slotId: string) => {
    setSlotActionError(null);
    setSlotActionLoadingId(slotId);
    try {
      const updatedSlot = await generateSlotContent(slotId);
      setCalendar((prev) =>
        prev
          ? { ...prev, slots: prev.slots.map((s) => (s.id === slotId ? updatedSlot : s)) }
          : prev
      );
    } catch (err) {
      setSlotActionError(err instanceof Error ? err.message : "Failed to generate content");
    } finally {
      setSlotActionLoadingId(null);
    }
  }, []);

  const removeSlot = useCallback(async (slotId: string) => {
    setSlotActionError(null);
    setSlotActionLoadingId(slotId);
    try {
      await deleteSlotApi(slotId);
      setCalendar((prev) =>
        prev ? { ...prev, slots: prev.slots.filter((s) => s.id !== slotId) } : prev
      );
    } catch (err) {
      setSlotActionError(err instanceof Error ? err.message : "Failed to delete slot");
    } finally {
      setSlotActionLoadingId(null);
    }
  }, []);

  return {
    calendar,
    loading,
    error,
    needsProfile,
    hasNoCalendarYet,
    creating,
    createError,
    slotActionError,
    slotActionLoadingId,
    create,
    changeFrequence,
    retrySlot,
    removeSlot,
    reload: load,
  };
}