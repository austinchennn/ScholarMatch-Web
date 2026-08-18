"use server";

import { connect, dislike, getRecommendations, type ConnectResult, type ScholarProfile } from "@/lib/api";
import { requireSessionToken } from "@/lib/session";

export async function fetchRecommendationsAction(): Promise<ScholarProfile[]> {
  const token = await requireSessionToken();
  return getRecommendations(token);
}

export async function connectAction(connectedScholarId: string): Promise<ConnectResult> {
  const token = await requireSessionToken();
  return connect(token, connectedScholarId);
}

export async function dislikeAction(dislikedScholarId: string): Promise<void> {
  const token = await requireSessionToken();
  await dislike(token, dislikedScholarId);
}
