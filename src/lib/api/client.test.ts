import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchApiClient, ApiError } from "./client";

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
      status: 500,
      statusText: "Internal Server Error",
      json: async () => {
        throw new Error("no body");
      },
    });

    await expect(fetchApiClient.request("/api/thing")).rejects.toMatchObject({
      status: 500,
      message: "Internal Server Error",
    });
  });

  it("ApiError is an instanceof Error and carries the HTTP status", () => {
    const err = new ApiError(403, "Forbidden");
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(403);
    expect(err.message).toBe("Forbidden");
  });
});
