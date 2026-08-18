import { describe, it, expect } from "vitest";
import { sendMessage, getConversation } from "./messages";
import { fakeClient, jsonBody } from "./test-utils";

describe("messages", () => {
  it("sendMessage posts receiverId and content", async () => {
    const { client, calls } = fakeClient({ messageId: "m1" });
    await sendMessage("tok", "other-id", "hi there", client);

    expect(calls[0].path).toBe("/api/messages");
    expect(calls[0].options.method).toBe("POST");
    expect(jsonBody(calls[0])).toEqual({ receiverId: "other-id", content: "hi there" });
  });

  it("getConversation hits the other-scholar-specific route", async () => {
    const { client, calls } = fakeClient([]);
    await getConversation("tok", "other-id", client);

    expect(calls[0].path).toBe("/api/messages/other-id");
    expect(calls[0].options.token).toBe("tok");
  });
});
