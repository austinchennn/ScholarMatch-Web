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

export interface Paper {
  title: string;
  doi: string;
}

export interface EducationEntry {
  school: string;
  degree: string;
  field: string;
}

export interface ScholarProfile {
  scholarId: string;
  firstName: string;
  lastName: string;
  email: string;
  academicEmailVerified?: boolean;
  phoneNumber?: string | null;
  institution?: string | null;
  academicLevel?: string | null;
  researchField?: string | null;
  lookingFor?: string | null;
  collaborationDescription?: string | null;
  researchDescription?: string | null;
  weeklyAvailabilityHours?: number | null;
  fundingStatus?: string | null;
  researchInterests?: string[];
  papers?: Paper[];
  educations?: EducationEntry[];
  avatarUrl?: string | null;
  hIndex?: number | null;
  totalCitations?: number | null;
}

export interface UpdateProfilePayload {
  phoneNumber?: string;
  institution?: string;
  academicLevel?: string;
  researchField?: string;
  lookingFor?: string;
  collaborationDescription?: string;
  researchDescription?: string;
  weeklyAvailabilityHours?: number;
  fundingStatus?: string;
  hIndex?: number;
  totalCitations?: number;
  researchInterests?: string[];
  papers?: Paper[];
  educations?: EducationEntry[];
  avatarBase64?: string;
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

export function updateProfile(token: string, payload: UpdateProfilePayload) {
  return request<ScholarProfile>("/api/profile", {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}
