"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createCheckoutSession, getSubscription, type Subscription } from "@/lib/api";
import { getSessionToken } from "@/lib/session";

async function requireToken(): Promise<string> {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }
  return token;
}

export async function fetchSubscriptionAction(): Promise<Subscription> {
  const token = await requireToken();
  return getSubscription(token);
}

export async function startCheckoutAction(): Promise<{ url: string }> {
  const token = await requireToken();
  const host = (await headers()).get("origin") ?? "";
  return createCheckoutSession(token, `${host}/billing?success=1`, `${host}/billing?canceled=1`);
}
