import { request } from "./client";

export interface AuthResponse {
  token: string;
  scholarId: string;
  name: string;
  avatarUrl: string | null;
}

export function requestVerificationCode(email: string) {
  return request<void>("/api/auth/request-verification-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  code: string;
}

export function register(payload: RegisterPayload) {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(email: string, password: string) {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
