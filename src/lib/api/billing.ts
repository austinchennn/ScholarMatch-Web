import { fetchApiClient, type ApiClient } from "./client";

export interface Subscription {
  status: string;
  currentPeriodEnd: string | null;
}

export function getSubscription(token: string, client: ApiClient = fetchApiClient) {
  return client.request<Subscription>("/api/billing/subscription", { token });
}

export function createCheckoutSession(
  token: string,
  successUrl: string,
  cancelUrl: string,
  client: ApiClient = fetchApiClient
) {
  return client.request<{ url: string }>("/api/billing/checkout", {
    method: "POST",
    token,
    body: JSON.stringify({ successUrl, cancelUrl }),
  });
}
