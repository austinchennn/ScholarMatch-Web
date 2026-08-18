import { describe, it, expect } from "vitest";
import { getRecommendations, connect, dislike } from "./recommend";
import { fakeClient, jsonBody } from "./test-utils";

describe("recommend", () => {
  it("getRecommendations sends the token to /api/recommend", async () => {
    const { client, calls } = fakeClient([]);
    await getRecommendations("tok", client);
    expect(calls[0].path).toBe("/api/recommend");
  });

  it("connect posts connectedScholarId", async () => {
    const { client, calls } = fakeClient({ matched: true, matchedScholar: null });
    await connect("tok", "other-id", client);

    expect(calls[0].path).toBe("/api/connect");
    expect(calls[0].options.method).toBe("POST");
    expect(jsonBody(calls[0])).toEqual({ connectedScholarId: "other-id" });
  });

  it("dislike posts dislikedScholarId", async () => {
    const { client, calls } = fakeClient(undefined);
    await dislike("tok", "other-id", client);

    expect(calls[0].path).toBe("/api/dislike");
    expect(calls[0].options.method).toBe("POST");
    expect(jsonBody(calls[0])).toEqual({ dislikedScholarId: "other-id" });
  });
});
