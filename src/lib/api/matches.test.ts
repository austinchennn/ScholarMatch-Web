import { describe, it, expect } from "vitest";
import { getMatches } from "./matches";
import { fakeClient } from "./test-utils";

describe("matches", () => {
  it("getMatches sends the token to /api/matches", async () => {
    const { client, calls } = fakeClient([{ scholarId: "1" }]);
    const result = await getMatches("tok", client);

    expect(calls[0].path).toBe("/api/matches");
    expect(calls[0].options.token).toBe("tok");
    expect(result).toEqual([{ scholarId: "1" }]);
  });
});
