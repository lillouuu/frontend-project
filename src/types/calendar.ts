// Matches backend/schemas/calendarschema.py exactly.
//
// IMPORTANT — this does NOT mean what the old static UI implied:
// frequence (30/60/90) controls SPACING BETWEEN POSTS, not a view range.
// The actual horizon is always a fixed 90 days (HORIZON_JOURS in
// calendar.py, hardcoded, never varies) regardless of which frequence is
// chosen. A "30" calendar and a "90" calendar both cover the same 90-day
// window — 30 just packs more posts into it.

export type CalendarFrequence = 30 | 60 | 90;

export interface CalendarCreate {
  company_id: string;
  frequence: CalendarFrequence;
}

export interface CalendarUpdate {
  frequence: CalendarFrequence;
}

// type_contenu is assigned by a fixed round-robin rotation server-side
// (_type_au_index in calendar.py) — not user-chosen per slot. There is no
// endpoint to manually create a single arbitrary slot.
export type CalendarSlotStatus = "planifie" | "genere" | "publie";

export interface CalendarSlotResponse {
  id: string;
  date: string; // ISO date, e.g. "2026-09-15"
  type_contenu: string;
  // NOTE: despite the name, `sujet` holds the actual generated post content
  // (truncated to 500 chars server-side) once status is "genere" — not a
  // short title. Render it as content preview text, not a heading.
  sujet: string | null;
  objectif: string | null; // the AI's chosen "angle" for this post
  cta: string | null;
  status: CalendarSlotStatus;
  generation_id: string | null;
}

export interface CalendarResponse {
  id: string;
  company_id: string;
  frequence: number;
  slots: CalendarSlotResponse[];
  created_at: string;
}