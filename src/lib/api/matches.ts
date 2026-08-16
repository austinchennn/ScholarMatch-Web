import { request } from "./client";
import type { ScholarProfile } from "./profile";

export function getMatches(token: string) {
  return request<ScholarProfile[]>("/api/matches", { token });
}
