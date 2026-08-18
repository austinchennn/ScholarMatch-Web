import { describe, it, expect } from "vitest";
import { getProfile, updateProfile, getPublicProfile } from "./profile";
import { fakeClient, jsonBody } from "./test-utils";

describe("profile", () => {
  it("getProfile sends the token, no body", async () => {
    const { client, calls } = fakeClient({ scholarId: "1" });
    await getProfile("tok", client);

    expect(calls[0].path).toBe("/api/profile");
    expect(calls[0].options.token).toBe("tok");
    expect(calls[0].options.method).toBeUndefined();
  });

  it("updateProfile PUTs the payload", async () => {
    const { client, calls } = fakeClient({ scholarId: "1" });
    await updateProfile("tok", { institution: "MIT" }, client);

    expect(calls[0].path).toBe("/api/profile");
    expect(calls[0].options.method).toBe("PUT");
    expect(jsonBody(calls[0])).toEqual({ institution: "MIT" });
  });

  it("getPublicProfile hits the scholar-specific public-profile route", async () => {
    const { client, calls } = fakeClient({ scholarId: "42" });
    await getPublicProfile("42", "tok", client);

    expect(calls[0].path).toBe("/api/scholars/42/public-profile");
    expect(calls[0].options.token).toBe("tok");
  });

  it("getPublicProfile works without a token (public route)", async () => {
    const { client, calls } = fakeClient({ scholarId: "42" });
    await getPublicProfile("42", undefined, client);

    expect(calls[0].options.token).toBeUndefined();
  });
});
