import { fetchApiClient, type ApiClient } from "./client";

export interface AuthResponse {
  token: string;
  scholarId: string;
  name: string;
  avatarUrl: string | null;
}

export function requestVerificationCode(email: string, client: ApiClient = fetchApiClient) {
  return client.request<void>("/api/auth/request-verification-code", {
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

export function register(payload: RegisterPayload, client: ApiClient = fetchApiClient) {
  return client.request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(email: string, password: string, client: ApiClient = fetchApiClient) {
  return client.request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
