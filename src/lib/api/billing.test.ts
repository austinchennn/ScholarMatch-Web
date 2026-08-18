import { describe, it, expect } from "vitest";
import { getSubscription, createCheckoutSession } from "./billing";
import { fakeClient, jsonBody } from "./test-utils";

describe("billing", () => {
  it("getSubscription sends the token", async () => {
    const { client, calls } = fakeClient({ status: "NONE", currentPeriodEnd: null });
    await getSubscription("tok", client);
    expect(calls[0].path).toBe("/api/billing/subscription");
  });

  it("createCheckoutSession posts successUrl and cancelUrl", async () => {
    const { client, calls } = fakeClient({ url: "https://checkout.stripe.com/x" });
    await createCheckoutSession("tok", "https://app/success", "https://app/cancel", client);

    expect(calls[0].path).toBe("/api/billing/checkout");
    expect(calls[0].options.method).toBe("POST");
    expect(jsonBody(calls[0])).toEqual({
      successUrl: "https://app/success",
      cancelUrl: "https://app/cancel",
    });
  });
});
