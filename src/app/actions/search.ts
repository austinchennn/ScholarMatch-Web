"use server";

import { redirect } from "next/navigation";
import { searchScholars, type PublicScholarProfile } from "@/lib/api";
import { getSessionToken } from "@/lib/session";

export async function searchScholarsAction(query: string): Promise<PublicScholarProfile[]> {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }
  if (!query.trim()) {
    return [];
  }
  return searchScholars(token, query);
}
