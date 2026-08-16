import { fetchApiClient, type ApiClient } from "./client";

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

export function getProfile(token: string, client: ApiClient = fetchApiClient) {
  return client.request<ScholarProfile>("/api/profile", { token });
}

export function updateProfile(
  token: string,
  payload: UpdateProfilePayload,
  client: ApiClient = fetchApiClient
) {
  return client.request<ScholarProfile>("/api/profile", {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export interface PublicScholarProfile {
  scholarId: string;
  displayName: string;
  institution?: string | null;
  academicLevel?: string | null;
  researchField?: string | null;
  lookingFor?: string | null;
  collaborationDescription?: string | null;
  researchDescription?: string | null;
  weeklyAvailabilityHours?: number | null;
  fundingStatus?: string | null;
  avatarUrl?: string | null;
  hIndex?: number | null;
  totalCitations?: number | null;
  researchInterests?: string[];
  papers?: Paper[];
  educations?: EducationEntry[];
  academicEmailVerified?: boolean;
}

export function getPublicProfile(
  scholarId: string,
  token?: string,
  client: ApiClient = fetchApiClient
) {
  return client.request<PublicScholarProfile>(`/api/scholars/${scholarId}/public-profile`, {
    token,
  });
}
