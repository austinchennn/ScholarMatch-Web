const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// The `err instanceof ApiError ? err.message : fallback` ternary was copy-pasted at 15 call
// sites across 8 files (mutation onError handlers, server action catch blocks) — the backend's
// error message is safe to show the user, anything else (a network failure, a thrown non-Error)
// isn't, so fall back to a generic message instead.
export function apiErrorMessage(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

export type RequestOptions = RequestInit & { token?: string };

// The abstraction every domain module (auth.ts, profile.ts, ...) depends on. They call
// through this interface, never through `FetchApiClient` or `fetch` directly — the ScholarMatch
// backend's HTTP transport is a swappable detail, not something business-facing code should
// be coupled to.
export interface ApiClient {
  request<T>(path: string, options?: RequestOptions): Promise<T>;
}

class FetchApiClient implements ApiClient {
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { token, headers, ...rest } = options;

    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      let message = res.statusText;
      try {
        const body = await res.json();
        message = body.error ?? message;
      } catch {
        // response had no JSON body
      }
      throw new ApiError(res.status, message);
    }

    if (res.status === 204 || res.headers.get("content-length") === "0") {
      return undefined as T;
    }

    return (await res.json()) as T;
  }
}

// The composition root: the one place a concrete ApiClient gets constructed. Every domain
// function takes an optional `client: ApiClient` parameter defaulting to this instance, so
// production call sites don't change at all, but any caller (most importantly a test) can
// substitute a fake ApiClient without touching the domain module.
export const fetchApiClient: ApiClient = new FetchApiClient();
