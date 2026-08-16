import { fetchApiClient, type ApiClient } from "./client";

export function requestEmailChangeCode(
  token: string,
  newEmail: string,
  client: ApiClient = fetchApiClient
) {
  return client.request<void>("/api/account/email-change/request-code", {
    method: "POST",
    token,
    body: JSON.stringify({ newEmail }),
  });
}

export interface ChangeEmailResult {
  scholarId: string;
  email: string;
  academicEmailVerified: boolean;
}

export function changeEmail(
  token: string,
  newEmail: string,
  verificationCode: string,
  currentPassword: string,
  client: ApiClient = fetchApiClient
) {
  return client.request<ChangeEmailResult>("/api/account/email", {
    method: "PUT",
    token,
    body: JSON.stringify({ newEmail, verificationCode, currentPassword }),
  });
}

export function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string,
  client: ApiClient = fetchApiClient
) {
  return client.request<void>("/api/account/password", {
    method: "PUT",
    token,
    body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
  });
}

export function deleteAccount(token: string, client: ApiClient = fetchApiClient) {
  return client.request<void>("/api/profile", { method: "DELETE", token });
}
