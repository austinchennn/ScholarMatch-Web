import { describe, it, expect } from "vitest";
import { listAdminScholars, disableScholar, enableScholar } from "./admin";
import { fakeClient } from "./test-utils";

describe("admin", () => {
  it("listAdminScholars sends the token", async () => {
    const { client, calls } = fakeClient([]);
    await listAdminScholars("tok", client);
    expect(calls[0].path).toBe("/api/admin/scholars");
  });

  it("disableScholar posts to the scholar-specific disable route", async () => {
    const { client, calls } = fakeClient({ scholarId: "s1" });
    await disableScholar("tok", "s1", client);
    expect(calls[0].path).toBe("/api/admin/scholars/s1/disable");
    expect(calls[0].options.method).toBe("POST");
  });

  it("enableScholar posts to the scholar-specific enable route", async () => {
    const { client, calls } = fakeClient({ scholarId: "s1" });
    await enableScholar("tok", "s1", client);
    expect(calls[0].path).toBe("/api/admin/scholars/s1/enable");
  });
});
