const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

// Per-attempt ceiling for a single backend call. A Railway instance that's just been redeployed
// (or is briefly overloaded) can take a few seconds to answer; past this we abandon the attempt
// and — for a safe, idempotent request — try again rather than hanging until the hosting
// platform kills the whole function.
const REQUEST_TIMEOUT_MS = 6000;

// Total attempts for an idempotent request whose failure looks transient: a refused/dropped
// connection, our own timeout firing, or a 5xx from the backend. In production these 5xx are
// mostly intermittent and clear on the very next try (a stale DB connection out of the pool, a
// blip during a redeploy), so a read is worth retrying. Non-idempotent requests
// (POST/PUT/PATCH/DELETE) are never retried — the first attempt may have reached the server and
// changed state.
const MAX_ATTEMPTS = 3;
const RETRY_BACKOFF_MS = [400, 1200];

// 5xx that we retry (for idempotent requests only). 500 is included because in practice the
// backend's intermittent unhandled-exception 500s succeed on retry; a genuinely deterministic
// 500 just costs an extra couple of attempts before it surfaces as ServiceUnavailableError.
const RETRYABLE_STATUS = new Set([500, 502, 503, 504]);
const IDEMPOTENT_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Every retry was spent and the backend still never gave us a usable response — it refused the
// connection, timed out, or only returned gateway errors. Deliberately NOT an ApiError subclass:
// `err instanceof ApiError` stays false, so the existing "show the backend's message" call sites
// fall back to their generic copy, and callers that want to tell "the server said no" (ApiError)
// apart from "the server never answered" (this) can branch on `instanceof ServiceUnavailableError`.
export class ServiceUnavailableError extends Error {
  readonly status = 503;

  constructor(options?: { cause?: unknown }) {
    super("The server is temporarily unavailable. Please try again in a moment.", options);
    this.name = "ServiceUnavailableError";
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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isIdempotent(method: string | undefined): boolean {
  return method === undefined || IDEMPOTENT_METHODS.has(method.toUpperCase());
}

class FetchApiClient implements ApiClient {
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { token, headers, signal: callerSignal, ...rest } = options;
    const retryable = isIdempotent(rest.method);
    const maxAttempts = retryable ? MAX_ATTEMPTS : 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
      const signal = callerSignal ? AbortSignal.any([callerSignal, timeout]) : timeout;

      let res: Response;
      try {
        res = await fetch(`${API_BASE_URL}${path}`, {
          ...rest,
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
          },
          cache: "no-store",
          signal,
        });
      } catch (err) {
        // The caller aborted on purpose — surface that untouched, never retry it.
        if (callerSignal?.aborted) throw err;
        // Otherwise it's a connection failure or our timeout: transient, so try again if we can.
        if (attempt < maxAttempts) {
          await sleep(RETRY_BACKOFF_MS[attempt - 1]);
          continue;
        }
        throw new ServiceUnavailableError({ cause: err });
      }

      if (retryable && RETRYABLE_STATUS.has(res.status) && attempt < maxAttempts) {
        await sleep(RETRY_BACKOFF_MS[attempt - 1]);
        continue;
      }

      if (!res.ok) {
        // An idempotent read that exhausted its retries on a 5xx: report it as "never answered"
        // rather than a specific ApiError, so callers degrade instead of surfacing a raw 500.
        // A write's 5xx falls through to the normal ApiError path untouched.
        if (retryable && RETRYABLE_STATUS.has(res.status)) {
          throw new ServiceUnavailableError({ cause: new ApiError(res.status, res.statusText) });
        }
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

    // Unreachable: the final attempt always returns or throws above. Present so the loop has a
    // definite exit for the type checker.
    throw new ServiceUnavailableError();
  }
}

// The composition root: the one place a concrete ApiClient gets constructed. Every domain
// function takes an optional `client: ApiClient` parameter defaulting to this instance, so
// production call sites don't change at all, but any caller (most importantly a test) can
// substitute a fake ApiClient without touching the domain module.
export const fetchApiClient: ApiClient = new FetchApiClient();
