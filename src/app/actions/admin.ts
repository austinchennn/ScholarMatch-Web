"use server";

import { redirect } from "next/navigation";
import {
  disableScholar,
  enableScholar,
  listAdminScholars,
  type AdminScholar,
} from "@/lib/api";
import { getSessionToken } from "@/lib/session";

async function requireToken(): Promise<string> {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }
  return token;
}

export async function fetchAdminScholarsAction(): Promise<AdminScholar[]> {
  const token = await requireToken();
  return listAdminScholars(token);
}

export async function disableScholarAction(scholarId: string): Promise<AdminScholar> {
  const token = await requireToken();
  return disableScholar(token, scholarId);
}

export async function enableScholarAction(scholarId: string): Promise<AdminScholar> {
  const token = await requireToken();
  return enableScholar(token, scholarId);
}
