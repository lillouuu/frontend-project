// Confirmed against backend/schemas/userschema.py and subscriptionschema.py.
export interface CurrentUser {
  id: string;
  full_name: string;
  email: string;
  account_id: string;
}

export interface Subscription {
  id: string;
  account_id: string;
  plan_tier: string; // "DECOUVERTE" | "PRO" | "BUSINESS" per the CDC's 3 tiers
  status: string;
  current_period_end: string | null;
}