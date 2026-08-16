import { request } from "./client";

export interface Subscription {
  status: string;
  currentPeriodEnd: string | null;
}

export function getSubscription(token: string) {
  return request<Subscription>("/api/billing/subscription", { token });
}

export function createCheckoutSession(token: string, successUrl: string, cancelUrl: string) {
  return request<{ url: string }>("/api/billing/checkout", {
    method: "POST",
    token,
    body: JSON.stringify({ successUrl, cancelUrl }),
  });
}
