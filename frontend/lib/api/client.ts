import { API_BASE_URL, AUTH_TOKEN_STORAGE_KEY } from "./config";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

/** True when the request never reached a server at all (backend not running,
 *  wrong URL, offline) — as opposed to the server responding with an error. */
export function isNetworkError(err: unknown): boolean {
  return err instanceof TypeError; // fetch() throws a bare TypeError for network failures
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function storeToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  else window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip attaching the bearer token — for login/register/public GETs. */
  skipAuth?: boolean;
}

/**
 * Thin wrapper around fetch() for the Voyagr API.
 *
 * Throws ApiError for both HTTP error responses (4xx/5xx, with Laravel's
 * validation `errors` bag attached when present) and network failures — check
 * `isNetworkError(err)` to tell "backend down" apart from "backend said no".
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, skipAuth, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = getStoredToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch() throws TypeError on network failure (connection refused, DNS, CORS)
    throw new ApiError(
      "Couldn't reach the Voyagr API. Is the backend running and is NEXT_PUBLIC_API_URL set correctly?",
      0
    );
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? `Request failed with status ${response.status}`,
      response.status,
      payload?.errors
    );
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) => apiFetch<T>(path, { ...options, method: "DELETE" }),
};

/**
 * Multipart upload — bypasses apiFetch's JSON.stringify/Content-Type since a
 * FormData body needs the browser to set its own multipart boundary header.
 * No prior upload endpoint existed in this client before video uploads.
 */
export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = getStoredToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { method: "POST", headers, body: formData });
  } catch {
    throw new ApiError("Couldn't reach the Voyagr API. Is the backend running and is NEXT_PUBLIC_API_URL set correctly?", 0);
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiError(payload?.message ?? `Request failed with status ${response.status}`, response.status, payload?.errors);
  }

  return payload as T;
}
