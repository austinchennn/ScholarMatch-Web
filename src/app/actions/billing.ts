"use server";

import { headers } from "next/headers";
import { createCheckoutSession, getSubscription, type Subscription } from "@/lib/api";
import { requireSessionToken } from "@/lib/session";

export async function fetchSubscriptionAction(): Promise<Subscription> {
  const token = await requireSessionToken();
  return getSubscription(token);
}

export async function startCheckoutAction(): Promise<{ url: string }> {
  const token = await requireSessionToken();
  const host = (await headers()).get("origin") ?? "";
  return createCheckoutSession(token, `${host}/billing?success=1`, `${host}/billing?canceled=1`);
}
