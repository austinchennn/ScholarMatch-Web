"use server";

import {
  getConversation,
  getMatches,
  getPublicProfile,
  sendMessage,
  type Message,
  type PublicScholarProfile,
  type ScholarProfile,
} from "@/lib/api";
import { requireSessionToken } from "@/lib/session";

export async function fetchMatchesAction(): Promise<ScholarProfile[]> {
  const token = await requireSessionToken();
  return getMatches(token);
}

export async function fetchConversationAction(otherScholarId: string): Promise<Message[]> {
  const token = await requireSessionToken();
  return getConversation(token, otherScholarId);
}

export async function fetchPublicProfileAction(scholarId: string): Promise<PublicScholarProfile> {
  const token = await requireSessionToken();
  return getPublicProfile(scholarId, token);
}

export async function sendMessageAction(receiverId: string, content: string): Promise<Message> {
  const token = await requireSessionToken();
  return sendMessage(token, receiverId, content);
}
