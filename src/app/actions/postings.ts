"use server";

import {
  acceptApplication,
  applyToPosting,
  boostPosting,
  closePosting,
  createPosting,
  declineApplication,
  getMyApplications,
  listPostings,
  unboostPosting,
  type CreatePostingPayload,
  type Posting,
  type PostingApplication,
} from "@/lib/api";
import { requireSessionToken } from "@/lib/session";

export async function fetchPostingsAction(scope: "ALL_ACTIVE" | "MINE"): Promise<Posting[]> {
  const token = await requireSessionToken();
  return listPostings(token, scope);
}

export async function createPostingAction(payload: CreatePostingPayload): Promise<Posting> {
  const token = await requireSessionToken();
  return createPosting(token, payload);
}

export async function applyToPostingAction(
  postingId: string,
  message?: string
): Promise<PostingApplication> {
  const token = await requireSessionToken();
  return applyToPosting(token, postingId, message);
}

export async function closePostingAction(postingId: string): Promise<Posting> {
  const token = await requireSessionToken();
  return closePosting(token, postingId);
}

export async function boostPostingAction(postingId: string): Promise<Posting> {
  const token = await requireSessionToken();
  return boostPosting(token, postingId);
}

export async function unboostPostingAction(postingId: string): Promise<Posting> {
  const token = await requireSessionToken();
  return unboostPosting(token, postingId);
}

export async function acceptApplicationAction(applicationId: string): Promise<PostingApplication> {
  const token = await requireSessionToken();
  return acceptApplication(token, applicationId);
}

export async function declineApplicationAction(applicationId: string): Promise<PostingApplication> {
  const token = await requireSessionToken();
  return declineApplication(token, applicationId);
}

export async function fetchMyApplicationsAction(): Promise<PostingApplication[]> {
  const token = await requireSessionToken();
  return getMyApplications(token);
}
