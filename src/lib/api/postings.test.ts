import { describe, it, expect } from "vitest";
import {
  createPosting,
  listPostings,
  applyToPosting,
  closePosting,
  boostPosting,
  unboostPosting,
  acceptApplication,
  declineApplication,
  getMyApplications,
} from "./postings";
import { fakeClient, jsonBody } from "./test-utils";

describe("postings", () => {
  it("createPosting posts the payload", async () => {
    const { client, calls } = fakeClient({ postingId: "p1" });
    const payload = { title: "Looking for a co-author" };
    await createPosting("tok", payload, client);

    expect(calls[0].path).toBe("/api/postings");
    expect(calls[0].options.method).toBe("POST");
    expect(jsonBody(calls[0])).toEqual(payload);
  });

  it("listPostings passes scope as a query param", async () => {
    const { client, calls } = fakeClient([]);
    await listPostings("tok", "MINE", client);
    expect(calls[0].path).toBe("/api/postings?scope=MINE");
  });

  it("applyToPosting sends a message when given one", async () => {
    const { client, calls } = fakeClient({ applicationId: "a1" });
    await applyToPosting("tok", "p1", "I'd love to help", client);

    expect(calls[0].path).toBe("/api/postings/p1/apply");
    expect(jsonBody(calls[0])).toEqual({ message: "I'd love to help" });
  });

  it("applyToPosting sends an empty body when no message is given", async () => {
    const { client, calls } = fakeClient({ applicationId: "a1" });
    await applyToPosting("tok", "p1", undefined, client);
    expect(jsonBody(calls[0])).toEqual({});
  });

  it("closePosting posts to the close route", async () => {
    const { client, calls } = fakeClient({ postingId: "p1" });
    await closePosting("tok", "p1", client);
    expect(calls[0].path).toBe("/api/postings/p1/close");
    expect(calls[0].options.method).toBe("POST");
  });

  it("boostPosting posts to the boost route", async () => {
    const { client, calls } = fakeClient({ postingId: "p1" });
    await boostPosting("tok", "p1", client);
    expect(calls[0].path).toBe("/api/postings/p1/boost");
  });

  it("unboostPosting posts to the unboost route", async () => {
    const { client, calls } = fakeClient({ postingId: "p1" });
    await unboostPosting("tok", "p1", client);
    expect(calls[0].path).toBe("/api/postings/p1/unboost");
  });

  it("acceptApplication posts to the application-specific accept route", async () => {
    const { client, calls } = fakeClient({ applicationId: "a1" });
    await acceptApplication("tok", "a1", client);
    expect(calls[0].path).toBe("/api/postings/applications/a1/accept");
  });

  it("declineApplication posts to the application-specific decline route", async () => {
    const { client, calls } = fakeClient({ applicationId: "a1" });
    await declineApplication("tok", "a1", client);
    expect(calls[0].path).toBe("/api/postings/applications/a1/decline");
  });

  it("getMyApplications sends the token to the mine route", async () => {
    const { client, calls } = fakeClient([]);
    await getMyApplications("tok", client);
    expect(calls[0].path).toBe("/api/postings/applications/mine");
  });
});
