import { describe, it, expect } from "vitest";
import { getNotifications, markNotificationRead } from "./notifications";
import { fakeClient } from "./test-utils";

describe("notifications", () => {
  it("getNotifications sends the token", async () => {
    const { client, calls } = fakeClient([]);
    await getNotifications("tok", client);
    expect(calls[0].path).toBe("/api/notifications");
  });

  it("markNotificationRead posts to the notification-specific read route", async () => {
    const { client, calls } = fakeClient({ notificationId: "n1" });
    await markNotificationRead("tok", "n1", client);

    expect(calls[0].path).toBe("/api/notifications/n1/read");
    expect(calls[0].options.method).toBe("POST");
  });
});
