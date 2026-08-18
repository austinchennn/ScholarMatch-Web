"use server";

import {
  disableScholar,
  enableScholar,
  listAdminScholars,
  type AdminScholar,
} from "@/lib/api";
import { requireSessionToken } from "@/lib/session";

export async function fetchAdminScholarsAction(): Promise<AdminScholar[]> {
  const token = await requireSessionToken();
  return listAdminScholars(token);
}

export async function disableScholarAction(scholarId: string): Promise<AdminScholar> {
  const token = await requireSessionToken();
  return disableScholar(token, scholarId);
}

export async function enableScholarAction(scholarId: string): Promise<AdminScholar> {
  const token = await requireSessionToken();
  return enableScholar(token, scholarId);
}
