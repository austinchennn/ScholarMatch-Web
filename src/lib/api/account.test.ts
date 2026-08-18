import { describe, it, expect } from "vitest";
import { requestEmailChangeCode, changeEmail, changePassword, deleteAccount } from "./account";
import { fakeClient, jsonBody } from "./test-utils";

describe("account", () => {
  it("requestEmailChangeCode posts the new email", async () => {
    const { client, calls } = fakeClient();
    await requestEmailChangeCode("tok", "new@b.com", client);

    expect(calls[0].path).toBe("/api/account/email-change/request-code");
    expect(jsonBody(calls[0])).toEqual({ newEmail: "new@b.com" });
  });

  it("changeEmail PUTs newEmail, verificationCode, currentPassword", async () => {
    const { client, calls } = fakeClient({ scholarId: "1" });
    await changeEmail("tok", "new@b.com", "123456", "hunter2", client);

    expect(calls[0].path).toBe("/api/account/email");
    expect(calls[0].options.method).toBe("PUT");
    expect(jsonBody(calls[0])).toEqual({
      newEmail: "new@b.com",
      verificationCode: "123456",
      currentPassword: "hunter2",
    });
  });

  it("changePassword PUTs current/new/confirm", async () => {
    const { client, calls } = fakeClient();
    await changePassword("tok", "old", "new", "new", client);

    expect(calls[0].path).toBe("/api/account/password");
    expect(calls[0].options.method).toBe("PUT");
    expect(jsonBody(calls[0])).toEqual({
      currentPassword: "old",
      newPassword: "new",
      confirmNewPassword: "new",
    });
  });

  it("deleteAccount DELETEs /api/profile", async () => {
    const { client, calls } = fakeClient();
    await deleteAccount("tok", client);

    expect(calls[0].path).toBe("/api/profile");
    expect(calls[0].options.method).toBe("DELETE");
  });
});
