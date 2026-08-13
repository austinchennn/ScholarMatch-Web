const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.error ?? message;
    } catch {
      // response had no JSON body
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export interface AuthResponse {
  token: string;
  scholarId: string;
  name: string;
  avatarUrl: string | null;
}

export interface ScholarProfile {
  scholarId: string;
  firstName: string;
  lastName: string;
  email: string;
  institution?: string | null;
  academicLevel?: string | null;
  researchField?: string | null;
  lookingFor?: string | null;
  researchDescription?: string | null;
  researchInterests?: string[];
  avatarUrl?: string | null;
  hIndex?: number | null;
  totalCitations?: number | null;
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

export function getProfile(token: string) {
  return request<ScholarProfile>("/api/profile", { token });
}
