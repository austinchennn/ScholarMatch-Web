"use server";

import { searchScholars, type PublicScholarProfile } from "@/lib/api";
import { requireSessionToken } from "@/lib/session";

export async function searchScholarsAction(query: string): Promise<PublicScholarProfile[]> {
  const token = await requireSessionToken();
  if (!query.trim()) {
    return [];
  }
  return searchScholars(token, query);
}
