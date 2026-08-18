import { describe, it, expect } from "vitest";
import { searchScholars } from "./search";
import { fakeClient } from "./test-utils";

describe("search", () => {
  it("URL-encodes the query string", async () => {
    const { client, calls } = fakeClient([]);
    await searchScholars("tok", "graph neural networks", client);
    expect(calls[0].path).toBe("/api/search?q=graph%20neural%20networks");
  });
});
