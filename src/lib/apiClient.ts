// One shared place for "how we talk to the backend".
// Every function in lib/api/*.ts calls apiFetch instead of writing its own fetch().
// If the auth mechanism changes (still unconfirmed), you fix it here once —
// not in every page.

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_AUTH_API_URL || // falls back to what your login page already uses
  "";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.detail || body.message || message;
    } catch {
      // response wasn't JSON, keep the default message
    }
    throw new ApiError(message, response.status);
  }

  // No content responses (e.g. 204) won't have a JSON body
  if (response.status === 204) return undefined as T;

  return response.json();
}

// For binary responses (PDFs) — same auth handling as apiFetch, but
// returns a Blob instead of trying to parse JSON. Needed because plain
// <a href> links can't send an Authorization header, so protected PDF
// endpoints (like /api/reports/audit/{id}) 403 if you just link to them
// directly — you have to fetch them properly and hand the browser the
// resulting blob yourself.
export async function apiFetchBlob(path: string, options: RequestInit = {}): Promise<Blob> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.detail || body.message || message;
    } catch {
      // response wasn't JSON (likely a real PDF error page) — keep default
    }
    throw new ApiError(message, response.status);
  }

  return response.blob();
}