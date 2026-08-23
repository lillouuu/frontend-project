// Confirmed against the real backend/schemas/executiveschema.py — only
// company_id, full_name, job_title, and linkedin_url are stored
// server-side. Bio and skills from your onboarding form are still real
// and used for linkedin_data, they just don't get saved as part of the
// "executive" resource.
export interface ExecutiveCreateRequest {
  company_id: string;
  full_name: string;
  job_title?: string | null;
  linkedin_url?: string | null;
}

export interface Executive extends ExecutiveCreateRequest {
  id: string;
}