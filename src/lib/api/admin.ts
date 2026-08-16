import { request } from "./client";

export interface AdminScholar {
  scholarId: string;
  firstName: string;
  lastName: string;
  email: string;
  institution?: string | null;
  academicEmailVerified: boolean;
  isAdmin: boolean;
  disabled: boolean;
}

export function listAdminScholars(token: string) {
  return request<AdminScholar[]>("/api/admin/scholars", { token });
}

export function disableScholar(token: string, scholarId: string) {
  return request<AdminScholar>(`/api/admin/scholars/${scholarId}/disable`, {
    method: "POST",
    token,
  });
}

export function enableScholar(token: string, scholarId: string) {
  return request<AdminScholar>(`/api/admin/scholars/${scholarId}/enable`, {
    method: "POST",
    token,
  });
}
