import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchApiClient, ApiError, ServiceUnavailableError } from "./client";

function mockFetchOnce(response: Partial<Response> & { json?: () => Promise<unknown> }) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    headers: new Headers(),
    json: async () => ({}),
    ...response,
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

// Queues one outcome per call: a thrown value (network failure) or a response-shaped object.
function mockFetchSequence(
  ...outcomes: Array<Error | (Partial<Response> & { json?: () => Promise<unknown> })>
) {
  const fetchMock = vi.fn();
  for (const outcome of outcomes) {
    if (outcome instanceof Error) {
      fetchMock.mockRejectedValueOnce(outcome);
    } else {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({}),
        ...outcome,
      });
    }
  }
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchApiClient.request", () => {
  it("sends Content-Type and Authorization headers when a token is given", async () => {
    const fetchMock = mockFetchOnce({ json: async () => ({ ok: true }) });
    await fetchApiClient.request("/api/thing", { token: "abc123" });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.headers["Authorization"]).toBe("Bearer abc123");
  });

  it("omits Authorization when no token is given", async () => {
    const fetchMock = mockFetchOnce({ json: async () => ({ ok: true }) });
    await fetchApiClient.request("/api/thing");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers["Authorization"]).toBeUndefined();
  });

  it("returns undefined for a 204 response instead of parsing a body", async () => {
    mockFetchOnce({ status: 204, json: async () => { throw new Error("should not be called"); } });
    const result = await fetchApiClient.request("/api/thing");
    expect(result).toBeUndefined();
  });

  it("throws ApiError with the backend's error message on a non-ok response", async () => {
    mockFetchOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({ error: "Missing or invalid authentication token." }),
    });

    await expect(fetchApiClient.request("/api/thing")).rejects.toMatchObject({
      status: 401,
      message: "Missing or invalid authentication token.",
    });
  });

  it("falls back to statusText when the error response has no JSON body", async () => {
    mockFetchOnce({
      ok: false,
      status: 422,
      statusText: "Unprocessable Entity",
      json: async () => {
        throw new Error("no body");
      },
    });

    await expect(fetchApiClient.request("/api/thing")).rejects.toMatchObject({
      status: 422,
      message: "Unprocessable Entity",
    });
  });

  it("ApiError is an instanceof Error and carries the HTTP status", () => {
    const err = new ApiError(403, "Forbidden");
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(403);
    expect(err.message).toBe("Forbidden");
  });

  describe("transient-failure retries", () => {
    it("retries an idempotent GET past an intermittent 500 and returns the eventual success", async () => {
      const fetchMock = mockFetchSequence(
        { ok: false, status: 500, statusText: "Internal Server Error", json: async () => ({}) },
        { ok: true, status: 200, json: async () => ({ ok: true }) },
      );

      const result = await fetchApiClient.request<{ ok: boolean }>("/api/thing");

      expect(result).toEqual({ ok: true });
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("retries after a thrown network error, then succeeds", async () => {
      const fetchMock = mockFetchSequence(
        new TypeError("fetch failed"),
        { ok: true, status: 200, json: async () => ({ ok: true }) },
      );

      const result = await fetchApiClient.request<{ ok: boolean }>("/api/thing");

      expect(result).toEqual({ ok: true });
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("gives up after 3 attempts and throws ServiceUnavailableError, not ApiError", async () => {
      const fetchMock = mockFetchSequence(
        { ok: false, status: 503, statusText: "Service Unavailable", json: async () => ({}) },
        { ok: false, status: 503, statusText: "Service Unavailable", json: async () => ({}) },
        { ok: false, status: 503, statusText: "Service Unavailable", json: async () => ({}) },
      );

      const err = (await fetchApiClient
        .request("/api/thing")
        .catch((e) => e)) as ServiceUnavailableError;

      expect(err).toBeInstanceOf(ServiceUnavailableError);
      expect(err).not.toBeInstanceOf(ApiError);
      expect(err.status).toBe(503);
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it("does not retry a POST — a 500 surfaces as ApiError on the first attempt", async () => {
      const fetchMock = mockFetchSequence({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ error: "boom" }),
      });

      const err = (await fetchApiClient
        .request("/api/thing", { method: "POST", body: "{}" })
        .catch((e) => e)) as ApiError;

      expect(err).toBeInstanceOf(ApiError);
      expect(err.status).toBe(500);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("ServiceUnavailableError keeps the underlying failure as its cause", async () => {
      const cause = new TypeError("fetch failed");
      mockFetchSequence(cause, cause, cause);

      const err = (await fetchApiClient
        .request("/api/thing")
        .catch((e) => e)) as ServiceUnavailableError;

      expect(err).toBeInstanceOf(ServiceUnavailableError);
      expect(err.cause).toBe(cause);
    });
  });
});
