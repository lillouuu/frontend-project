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