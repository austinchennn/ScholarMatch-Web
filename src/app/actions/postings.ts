"use server";

import { redirect } from "next/navigation";
import {
  acceptApplication,
  applyToPosting,
  closePosting,
  createPosting,
  declineApplication,
  getMyApplications,
  listPostings,
  type CreatePostingPayload,
  type Posting,
  type PostingApplication,
} from "@/lib/api";
import { getSessionToken } from "@/lib/session";

async function requireToken(): Promise<string> {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }
  return token;
}

export async function fetchPostingsAction(scope: "ALL_ACTIVE" | "MINE"): Promise<Posting[]> {
  const token = await requireToken();
  return listPostings(token, scope);
}

export async function createPostingAction(payload: CreatePostingPayload): Promise<Posting> {
  const token = await requireToken();
  return createPosting(token, payload);
}

export async function applyToPostingAction(
  postingId: string,
  message?: string
): Promise<PostingApplication> {
  const token = await requireToken();
  return applyToPosting(token, postingId, message);
}

export async function closePostingAction(postingId: string): Promise<Posting> {
  const token = await requireToken();
  return closePosting(token, postingId);
}

export async function acceptApplicationAction(applicationId: string): Promise<PostingApplication> {
  const token = await requireToken();
  return acceptApplication(token, applicationId);
}

export async function declineApplicationAction(applicationId: string): Promise<PostingApplication> {
  const token = await requireToken();
  return declineApplication(token, applicationId);
}

export async function fetchMyApplicationsAction(): Promise<PostingApplication[]> {
  const token = await requireToken();
  return getMyApplications(token);
}
