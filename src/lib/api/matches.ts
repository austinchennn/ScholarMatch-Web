import { fetchApiClient, type ApiClient } from "./client";
import type { ScholarProfile } from "./profile";

export function getMatches(token: string, client: ApiClient = fetchApiClient) {
  return client.request<ScholarProfile[]>("/api/matches", { token });
}
