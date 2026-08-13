"use server";

import { redirect } from "next/navigation";
import { connect, dislike, getRecommendations, type ConnectResult, type ScholarProfile } from "@/lib/api";
import { getSessionToken } from "@/lib/session";

async function requireToken(): Promise<string> {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }
  return token;
}

export async function fetchRecommendationsAction(): Promise<ScholarProfile[]> {
  const token = await requireToken();
  return getRecommendations(token);
}

export async function connectAction(connectedScholarId: string): Promise<ConnectResult> {
  const token = await requireToken();
  return connect(token, connectedScholarId);
}

export async function dislikeAction(dislikedScholarId: string): Promise<void> {
  const token = await requireToken();
  await dislike(token, dislikedScholarId);
}
