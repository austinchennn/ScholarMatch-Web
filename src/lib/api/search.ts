import { request } from "./client";
import type { PublicScholarProfile } from "./profile";

export function searchScholars(token: string, query: string) {
  return request<PublicScholarProfile[]>(`/api/search?q=${encodeURIComponent(query)}`, {
    token,
  });
}
