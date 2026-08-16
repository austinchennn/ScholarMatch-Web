import { fetchApiClient, type ApiClient } from "./client";
import type { ScholarProfile } from "./profile";

export function getRecommendations(token: string, client: ApiClient = fetchApiClient) {
  return client.request<ScholarProfile[]>("/api/recommend", { token });
}

export interface ConnectResult {
  matched: boolean;
  matchedScholar: ScholarProfile | null;
}

export function connect(
  token: string,
  connectedScholarId: string,
  client: ApiClient = fetchApiClient
) {
  return client.request<ConnectResult>("/api/connect", {
    method: "POST",
    token,
    body: JSON.stringify({ connectedScholarId }),
  });
}

export function dislike(
  token: string,
  dislikedScholarId: string,
  client: ApiClient = fetchApiClient
) {
  return client.request<void>("/api/dislike", {
    method: "POST",
    token,
    body: JSON.stringify({ dislikedScholarId }),
  });
}
