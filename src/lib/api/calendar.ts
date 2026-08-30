import { apiFetch } from "@/lib/apiClient";
import type {
  CalendarCreate,
  CalendarUpdate,
  CalendarResponse,
  CalendarSlotResponse,
} from "@/types/calendar";

// UNCONFIRMED PREFIX: every other router this session (/api/audits,
// /api/optimizations, /api/generations, /api/benchmarks) turned out to have
// no extra path segment beyond /api/<resource> — this follows that same
// pattern, but hasn't been checked against the live Swagger UI the way the
// others were. Verify /api/calendars is actually correct before trusting
// any of these calls; we've been burned by wrong-prefix guesses twice
// already this session (the /ai/ prefix mixup on optimizations/generations).

export function createCalendar(payload: CalendarCreate): Promise<CalendarResponse> {
  return apiFetch<CalendarResponse>("/api/calendars", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCompanyCalendar(companyId: string): Promise<CalendarResponse> {
  return apiFetch<CalendarResponse>(`/api/calendars/company/${companyId}`);
}

export function updateCalendarFrequence(
  companyId: string,
  payload: CalendarUpdate
): Promise<CalendarResponse> {
  return apiFetch<CalendarResponse>(`/api/calendars/company/${companyId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// Also generates/regenerates content for one slot — real retry path for a
// slot stuck at status "planifie" after its automatic generation failed.
export function generateSlotContent(slotId: string): Promise<CalendarSlotResponse> {
  return apiFetch<CalendarSlotResponse>(`/api/calendars/slots/${slotId}/generate`, {
    method: "POST",
  });
}

export function deleteSlot(slotId: string): Promise<void> {
  return apiFetch<void>(`/api/calendars/slots/${slotId}`, {
    method: "DELETE",
  });
}