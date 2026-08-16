import { request } from "./client";

export function requestEmailChangeCode(token: string, newEmail: string) {
  return request<void>("/api/account/email-change/request-code", {
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
  currentPassword: string
) {
  return request<ChangeEmailResult>("/api/account/email", {
    method: "PUT",
    token,
    body: JSON.stringify({ newEmail, verificationCode, currentPassword }),
  });
}

export function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
) {
  return request<void>("/api/account/password", {
    method: "PUT",
    token,
    body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
  });
}

export function deleteAccount(token: string) {
  return request<void>("/api/profile", { method: "DELETE", token });
}
