import { fetchApiClient, type ApiClient } from "./client";
import type { PublicScholarProfile } from "./profile";

export function searchScholars(token: string, query: string, client: ApiClient = fetchApiClient) {
  return client.request<PublicScholarProfile[]>(`/api/search?q=${encodeURIComponent(query)}`, {
    token,
  });
}
