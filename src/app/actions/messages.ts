"use server";

import { redirect } from "next/navigation";
import {
  getConversation,
  getMatches,
  getPublicProfile,
  sendMessage,
  type Message,
  type PublicScholarProfile,
  type ScholarProfile,
} from "@/lib/api";
import { getSessionToken } from "@/lib/session";

async function requireToken(): Promise<string> {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }
  return token;
}

export async function fetchMatchesAction(): Promise<ScholarProfile[]> {
  const token = await requireToken();
  return getMatches(token);
}

export async function fetchConversationAction(otherScholarId: string): Promise<Message[]> {
  const token = await requireToken();
  return getConversation(token, otherScholarId);
}

export async function fetchPublicProfileAction(scholarId: string): Promise<PublicScholarProfile> {
  const token = await requireToken();
  return getPublicProfile(scholarId, token);
}

export async function sendMessageAction(receiverId: string, content: string): Promise<Message> {
  const token = await requireToken();
  return sendMessage(token, receiverId, content);
}
