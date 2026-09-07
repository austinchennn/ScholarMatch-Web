import { describe, expect, it } from "vitest";
import { ApiError, type ApiClient } from "./client";
import { getConversations } from "./conversations";
import { fakeClient } from "./test-utils";

describe("conversations", () => {
  it("getConversations sends the token to /api/conversations", async () => {
    const response = [{ scholarId: "1", relationship: "MATCH" as const }];
    const { client, calls } = fakeClient(response);
    const result = await getConversations("tok", client);

    expect(calls[0].path).toBe("/api/conversations");
    expect(calls[0].options.token).toBe("tok");
    expect(result).toEqual(response);
  });

  it("getConversations propagates API errors", async () => {
    const error = new ApiError(500, "Could not load conversations");
    const client: ApiClient = {
      request<T>(): Promise<T> {
        return Promise.reject(error);
      },
    };

    await expect(getConversations("tok", client)).rejects.toBe(error);
  });
});
