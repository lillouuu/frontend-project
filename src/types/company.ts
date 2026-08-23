// Confirmed against the real backend/schemas/companyschema.py — the
// backend only stores `name` and `linkedin_url` for a company. Everything
// else in your onboarding form (slogan, description, services, contact
// info) is still real and useful — it builds the `linkedin_data` payload
// the audit needs — it just isn't part of what gets saved as the
// "company" resource server-side.
export interface CompanyCreateRequest {
  name: string;
  linkedin_url?: string | null;
}

export interface Company extends CompanyCreateRequest {
  id: string;
  account_id: string;
}