import { request } from "./client";
import type { ScholarProfile } from "./profile";

export function getRecommendations(token: string) {
  return request<ScholarProfile[]>("/api/recommend", { token });
}

export interface ConnectResult {
  matched: boolean;
  matchedScholar: ScholarProfile | null;
}

export function connect(token: string, connectedScholarId: string) {
  return request<ConnectResult>("/api/connect", {
    method: "POST",
    token,
    body: JSON.stringify({ connectedScholarId }),
  });
}

export function dislike(token: string, dislikedScholarId: string) {
  return request<void>("/api/dislike", {
    method: "POST",
    token,
    body: JSON.stringify({ dislikedScholarId }),
  });
}
