import { fetchApiClient, type ApiClient } from "./client";

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

export function listAdminScholars(token: string, client: ApiClient = fetchApiClient) {
  return client.request<AdminScholar[]>("/api/admin/scholars", { token });
}

export function disableScholar(
  token: string,
  scholarId: string,
  client: ApiClient = fetchApiClient
) {
  return client.request<AdminScholar>(`/api/admin/scholars/${scholarId}/disable`, {
    method: "POST",
    token,
  });
}

export function enableScholar(
  token: string,
  scholarId: string,
  client: ApiClient = fetchApiClient
) {
  return client.request<AdminScholar>(`/api/admin/scholars/${scholarId}/enable`, {
    method: "POST",
    token,
  });
}
