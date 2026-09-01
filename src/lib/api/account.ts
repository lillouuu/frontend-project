import { apiFetch } from "@/lib/apiClient";
import type { CurrentUser, Subscription } from "@/types/currentUser";

export function getCurrentUser(): Promise<CurrentUser> {
  return apiFetch<CurrentUser>("/api/users/me");
}

export function getMySubscription(): Promise<Subscription> {
  return apiFetch<Subscription>("/api/accounts/me/subscription");
}

export function updateCurrentUser(payload: {
  full_name?: string;
  email?: string;
}): Promise<CurrentUser> {
  return apiFetch<CurrentUser>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function changePassword(payload: {
  current_password: string;
  new_password: string;
}): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/api/users/me/password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function updateAccountName(name: string): Promise<{ id: string; name: string }> {
  return apiFetch<{ id: string; name: string }>("/api/accounts/me", {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

// Always returns the same generic message regardless of whether the email
// exists (backend does this deliberately to avoid leaking which emails are
// registered) — never show a different UI state based on the response here.
export function requestPasswordReset(email: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/api/users/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/api/users/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, new_password: newPassword }),
  });
}