import { describe, it, expect } from "vitest";
import { login, register, requestVerificationCode } from "./auth";
import { fakeClient, jsonBody } from "./test-utils";

describe("auth", () => {
  it("requestVerificationCode posts the email", async () => {
    const { client, calls } = fakeClient();
    await requestVerificationCode("a@b.com", client);

    expect(calls[0].path).toBe("/api/auth/request-verification-code");
    expect(calls[0].options.method).toBe("POST");
    expect(jsonBody(calls[0])).toEqual({ email: "a@b.com" });
  });

  it("register posts the full payload", async () => {
    const { client, calls } = fakeClient({ token: "t" });
    const payload = {
      firstName: "Ada",
      lastName: "Lovelace",
      email: "a@b.com",
      password: "hunter2",
      code: "123456",
    };
    await register(payload, client);

    expect(calls[0].path).toBe("/api/auth/register");
    expect(calls[0].options.method).toBe("POST");
    expect(jsonBody(calls[0])).toEqual(payload);
  });

  it("login posts email and password, and returns the client's response", async () => {
    const { client, calls } = fakeClient({ token: "t", scholarId: "1" });
    const result = await login("a@b.com", "hunter2", client);

    expect(calls[0].path).toBe("/api/auth/login");
    expect(calls[0].options.method).toBe("POST");
    expect(jsonBody(calls[0])).toEqual({ email: "a@b.com", password: "hunter2" });
    expect(result).toEqual({ token: "t", scholarId: "1" });
  });
});
