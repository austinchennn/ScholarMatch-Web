import { fetchApiClient, type ApiClient } from "./client";

export interface Posting {
  postingId: string;
  posterUserId: string;
  posterName: string;
  posterAcademicEmailVerified: boolean;
  title: string;
  description?: string | null;
  researchField?: string | null;
  collaborationType?: string | null;
  maxApplicants?: number | null;
  applicantCount: number;
  createdAt: string;
  active: boolean;
  full: boolean;
  closed: boolean;
  boosted: boolean;
  applications: PostingApplication[] | null;
}

export interface PostingApplication {
  applicationId: string;
  postingId: string;
  postingTitle?: string | null;
  applicantUserId: string;
  applicantName: string;
  message?: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
  posterUserId?: string | null;
  posterName?: string | null;
  posterAcademicEmailVerified?: boolean;
}

export interface CreatePostingPayload {
  title: string;
  description?: string;
  researchField?: string;
  collaborationType?: string;
  maxApplicants?: number;
}

export function createPosting(
  token: string,
  payload: CreatePostingPayload,
  client: ApiClient = fetchApiClient
) {
  return client.request<Posting>("/api/postings", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function listPostings(
  token: string,
  scope: "ALL_ACTIVE" | "MINE",
  client: ApiClient = fetchApiClient
) {
  return client.request<Posting[]>(`/api/postings?scope=${scope}`, { token });
}

export function applyToPosting(
  token: string,
  postingId: string,
  message?: string,
  client: ApiClient = fetchApiClient
) {
  return client.request<PostingApplication>(`/api/postings/${postingId}/apply`, {
    method: "POST",
    token,
    body: JSON.stringify(message ? { message } : {}),
  });
}

export function closePosting(token: string, postingId: string, client: ApiClient = fetchApiClient) {
  return client.request<Posting>(`/api/postings/${postingId}/close`, {
    method: "POST",
    token,
  });
}

export function boostPosting(token: string, postingId: string, client: ApiClient = fetchApiClient) {
  return client.request<Posting>(`/api/postings/${postingId}/boost`, {
    method: "POST",
    token,
  });
}

export function unboostPosting(token: string, postingId: string, client: ApiClient = fetchApiClient) {
  return client.request<Posting>(`/api/postings/${postingId}/unboost`, {
    method: "POST",
    token,
  });
}

export function acceptApplication(
  token: string,
  applicationId: string,
  client: ApiClient = fetchApiClient
) {
  return client.request<PostingApplication>(`/api/postings/applications/${applicationId}/accept`, {
    method: "POST",
    token,
  });
}

export function declineApplication(
  token: string,
  applicationId: string,
  client: ApiClient = fetchApiClient
) {
  return client.request<PostingApplication>(`/api/postings/applications/${applicationId}/decline`, {
    method: "POST",
    token,
  });
}

export function getMyApplications(token: string, client: ApiClient = fetchApiClient) {
  return client.request<PostingApplication[]>("/api/postings/applications/mine", { token });
}
