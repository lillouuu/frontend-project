"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Trash2, AlertCircle, Zap } from "lucide-react";
import { useCalendar } from "@/hooks/useCalendar";
import type { CalendarFrequence, CalendarSlotResponse } from "@/types/calendar";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TYPE_COLORS: Record<string, string> = {
  publication: "bg-purple-100 text-purple-700 border-purple-200",
  carrousel: "bg-emerald-100 text-emerald-700 border-emerald-200",
  idee_video: "bg-sky-100 text-sky-700 border-sky-200",
  temoignage_client: "bg-amber-100 text-amber-700 border-amber-200",
  etude_de_cas: "bg-sky-100 text-sky-700 border-sky-200",
  actualite: "bg-slate-100 text-slate-700 border-slate-200",
  publication_rh: "bg-pink-100 text-pink-700 border-pink-200",
  publication_dirigeant: "bg-indigo-100 text-indigo-700 border-indigo-200",
  annonce_recrutement: "bg-amber-100 text-amber-700 border-amber-200",
};

function slotColor(type: string) {
  return TYPE_COLORS[type] ?? "bg-slate-100 text-slate-700 border-slate-200";
}

export default function CalendarPage() {
  const {
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
  } = useCalendar();

  // FIX: the real 90-day horizon starts from whatever day the calendar was
  // created, not the 1st of a month — so real slots span parts of ~4
  // calendar months, not aligned to month boundaries at all. Deriving the
  // actual range from the real slots (not assuming created_at + 90, since
  // deletions/frequency changes can shift it) so navigation can be honestly
  // bounded instead of letting you wander into empty months with no
  // explanation why they're empty.
  const slotDateRange = useMemo(() => {
    if (!calendar || calendar.slots.length === 0) return null;
    const dates = calendar.slots.map((s) => new Date(s.date + "T00:00:00").getTime());
    return { min: new Date(Math.min(...dates)), max: new Date(Math.max(...dates)) };
  }, [calendar]);

  const today = new Date();
  const [viewYear, setViewYear] = useState(
    slotDateRange ? slotDateRange.min.getFullYear() : today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(
    slotDateRange ? slotDateRange.min.getMonth() : today.getMonth()
  );
  const [selectedFrequence, setSelectedFrequence] = useState<CalendarFrequence>(30);
  const [selectedSlot, setSelectedSlot] = useState<CalendarSlotResponse | null>(null);

  const monthKey = (y: number, m: number) => y * 12 + m;
  const canGoBack = !slotDateRange || monthKey(viewYear, viewMonth) > monthKey(slotDateRange.min.getFullYear(), slotDateRange.min.getMonth());
  const canGoForward = !slotDateRange || monthKey(viewYear, viewMonth) < monthKey(slotDateRange.max.getFullYear(), slotDateRange.max.getMonth());

  const slotsByDay = useMemo(() => {
    const map = new Map<number, CalendarSlotResponse[]>();
    if (!calendar) return map;
    for (const slot of calendar.slots) {
      const d = new Date(slot.date + "T00:00:00");
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        const day = d.getDate();
        map.set(day, [...(map.get(day) ?? []), slot]);
      }
    }
    return map;
  }, [calendar, viewYear, viewMonth]);

  const upcoming = useMemo(() => {
    if (!calendar) return [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return [...calendar.slots]
      .filter((s) => new Date(s.date + "T00:00:00") >= now)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [calendar]);

  const pendingSlots = useMemo(
    () => calendar?.slots.filter((s) => s.status === "planifie") ?? [],
    [calendar]
  );

  const goToMonth = (delta: number) => {
    if (delta < 0 && !canGoBack) return;
    if (delta > 0 && !canGoForward) return;
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">
        <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Loading your calendar...
      </div>
    );
  }

  if (needsProfile) {
    return (
      <div className="min-h-screen bg-white px-8 py-6 font-sans">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700">
          Complete onboarding for a company before setting up a calendar.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white px-8 py-6 font-sans">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {error}
        </div>
      </div>
    );
  }

  if (hasNoCalendarYet || !calendar) {
    return (
      <div className="min-h-screen bg-white px-8 py-6 font-sans">
        <div className="mb-8">
          <p className="mb-1 text-xs font-medium text-slate-400">Workspace / Calendar</p>
          <h1 className="text-2xl font-bold text-slate-900">Editorial Calendar</h1>
        </div>

        <div className="mx-auto max-w-lg rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Set up your editorial calendar</h3>
          <p className="mt-2 text-xs text-slate-500">
            Choose how often you want to post. This always plans out a fixed 90-day window —
            "30" just packs posts closer together than "90" does, it doesn't shorten how far
            ahead the calendar looks.
          </p>

          <div className="mt-5 flex justify-center gap-2">
            {([30, 60, 90] as CalendarFrequence[]).map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFrequence(f)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  selectedFrequence === f
                    ? "border-[#4a7aa8] bg-[#eef4fa] text-[#2a6ba0]"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Every {f} days
              </button>
            ))}
          </div>

          <p className="mt-3 text-[11px] text-amber-600">
            Heads up: this triggers real AI content generation for every planned post at once —
            it can take a moment and isn't free.
          </p>

          {createError && <p className="mt-3 text-xs font-medium text-rose-600">{createError}</p>}

          <button
            onClick={() => create(selectedFrequence)}
            disabled={creating}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0f1c33] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2f50] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating && <RefreshCw className="h-4 w-4 animate-spin" />}
            {creating ? "Generating your calendar..." : "Create Calendar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-8 py-6 font-sans">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-400">Workspace / Calendar</p>
          <h1 className="text-2xl font-bold text-slate-900">Editorial Calendar</h1>
          <p className="mt-1 text-sm text-slate-500">
            Posting every {calendar.frequence} days, across a 90-day window.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex overflow-hidden rounded-xl border border-slate-200">
            {([30, 60, 90] as CalendarFrequence[]).map((f) => (
              <button
                key={f}
                onClick={() => changeFrequence(f)}
                disabled={creating}
                className={`border-r border-slate-200 px-3 py-2 text-xs font-semibold last:border-0 disabled:cursor-not-allowed ${
                  calendar.frequence === f
                    ? "bg-[#0f1c33] text-white"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {f}d
              </button>
            ))}
          </div>
          {pendingSlots.length > 0 && (
            <button
              onClick={() => pendingSlots.forEach((s) => retrySlot(s.id))}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4a7aa8] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#3f6a94]"
            >
              <Zap className="h-4 w-4" /> Retry {pendingSlots.length} pending
            </button>
          )}
        </div>
      </div>

      {(createError || slotActionError) && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {createError || slotActionError}
        </div>
      )}

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => goToMonth(-1)}
                  disabled={!canGoBack}
                  className="rounded-lg p-1 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-400" />
                </button>
                <button
                  onClick={() => goToMonth(1)}
                  disabled={!canGoForward}
                  className="rounded-lg p-1 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} className="py-1 text-[10px] font-bold text-slate-300">
                  {d}
                </div>
              ))}
              {cells.map((day, i) => {
                const daySlots = day ? slotsByDay.get(day) ?? [] : [];
                return (
                  <div
                    key={i}
                    className={`mx-auto flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-medium ${
                      !day
                        ? ""
                        : daySlots.length > 0
                        ? "bg-[#4a7aa8] font-bold text-white"
                        : "cursor-pointer text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-slate-900">Upcoming posts</h3>
            {upcoming.length === 0 ? (
              <p className="text-xs text-slate-400">No upcoming posts.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {upcoming.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => setSelectedSlot(post)}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-left hover:bg-slate-100"
                  >
                    <div className="truncate text-xs font-semibold text-slate-800">
                      {post.sujet ? post.sujet.slice(0, 60) : "Not generated yet"}
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${slotColor(post.type_contenu)}`}>
                        {post.type_contenu}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(post.date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-1 flex items-center gap-3">
            <button
              onClick={() => goToMonth(-1)}
              disabled={!canGoBack}
              className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="h-4 w-4 text-slate-500" />
            </button>
            <h2 className="text-base font-bold text-slate-900">
              {MONTHS[viewMonth]} {viewYear}
            </h2>
            <button
              onClick={() => goToMonth(1)}
              disabled={!canGoForward}
              className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          {slotDateRange && (
            <p className="mb-4 text-xs text-slate-400">
              This calendar only covers{" "}
              <strong className="text-slate-500">
                {slotDateRange.min.toLocaleDateString(undefined, { month: "long", day: "numeric" })}
                {" – "}
                {slotDateRange.max.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
              </strong>{" "}
              — the fixed 90-day window from when it was created.
            </p>
          )}

          <div className="grid grid-cols-7 border-l border-t border-slate-100">
            {DAYS.map((d) => (
              <div key={d} className="border-b border-r border-slate-100 py-2 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400">
                {d}
              </div>
            ))}
            {cells.map((day, i) => {
              const daySlots = day ? slotsByDay.get(day) ?? [] : [];
              return (
                <div
                  key={i}
                  className={`min-h-[90px] border-b border-r border-slate-100 p-2 ${!day ? "bg-slate-50/40" : ""}`}
                >
                  {day && (
                    <>
                      <span className={`text-xs font-bold ${daySlots.length > 0 ? "text-[#4a7aa8]" : "text-slate-400"}`}>
                        {day}
                      </span>
                      <div className="mt-1 flex flex-col gap-1">
                        {daySlots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot)}
                            className={`w-full truncate rounded-md border px-1.5 py-0.5 text-left text-[10px] font-semibold ${slotColor(slot.type_contenu)} ${
                              slot.status === "planifie" ? "opacity-60" : ""
                            }`}
                          >
                            {slot.type_contenu}
                            {slot.status === "planifie" && " ⏳"}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedSlot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setSelectedSlot(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className={`rounded-md border px-2 py-1 text-[10px] font-bold ${slotColor(selectedSlot.type_contenu)}`}>
                {selectedSlot.type_contenu}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(selectedSlot.date + "T00:00:00").toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {selectedSlot.status === "planifie" ? (
              <div className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50/60 p-4 text-xs text-amber-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                Not generated yet — the automatic generation for this slot didn't complete.
              </div>
            ) : (
              <>
                <p className="text-sm leading-relaxed text-slate-800">{selectedSlot.sujet}</p>
                {selectedSlot.objectif && (
                  <p className="mt-2 text-xs text-slate-500">
                    <strong className="text-slate-700">Angle:</strong> {selectedSlot.objectif}
                  </p>
                )}
                {selectedSlot.cta && (
                  <p className="mt-1 text-xs text-slate-500">
                    <strong className="text-slate-700">CTA:</strong> {selectedSlot.cta}
                  </p>
                )}
              </>
            )}

            <div className="mt-5 flex justify-end gap-2">
              {selectedSlot.status === "planifie" && (
                <button
                  onClick={async () => {
                    await retrySlot(selectedSlot.id);
                    setSelectedSlot(null);
                  }}
                  disabled={slotActionLoadingId === selectedSlot.id}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#4a7aa8] px-3 py-2 text-xs font-semibold text-white hover:bg-[#3f6a94] disabled:opacity-50"
                >
                  {slotActionLoadingId === selectedSlot.id ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Zap className="h-3.5 w-3.5" />
                  )}
                  Generate now
                </button>
              )}
              <button
                onClick={async () => {
                  await removeSlot(selectedSlot.id);
                  setSelectedSlot(null);
                }}
                disabled={slotActionLoadingId === selectedSlot.id}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}