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

export function getRecommendations(token: string) {
  return request<ScholarProfile[]>("/api/recommend", { token });
}

export interface ConnectResult {
  matched: boolean;
  matchedScholar: ScholarProfile | null;
}

export function connect(token: string, connectedScholarId: string) {
  return request<ConnectResult>("/api/connect", {
    method: "POST",
    token,
    body: JSON.stringify({ connectedScholarId }),
  });
}

export function dislike(token: string, dislikedScholarId: string) {
  return request<void>("/api/dislike", {
    method: "POST",
    token,
    body: JSON.stringify({ dislikedScholarId }),
  });
}

export function getMatches(token: string) {
  return request<ScholarProfile[]>("/api/matches", { token });
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

export function getPublicProfile(scholarId: string, token?: string) {
  return request<PublicScholarProfile>(`/api/scholars/${scholarId}/public-profile`, { token });
}

export interface Message {
  messageId: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
}

export function sendMessage(token: string, receiverId: string, content: string) {
  return request<Message>("/api/messages", {
    method: "POST",
    token,
    body: JSON.stringify({ receiverId, content }),
  });
}

export function getConversation(token: string, otherScholarId: string) {
  return request<Message[]>(`/api/messages/${otherScholarId}`, { token });
}

export interface Posting {
  postingId: string;
  posterUserId: string;
  posterName: string;
  posterAcademicEmailVerified: boolean;
  title: string;
  description?: string | null;
  researchField?: string | null;
  collaborationType?: string | null;
  maxApplicants?: number | null;
  applicantCount: number;
  createdAt: string;
  active: boolean;
  full: boolean;
  closed: boolean;
  boosted: boolean;
  applications: PostingApplication[] | null;
}

export interface PostingApplication {
  applicationId: string;
  postingId: string;
  postingTitle?: string | null;
  applicantUserId: string;
  applicantName: string;
  message?: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
  posterUserId?: string | null;
  posterName?: string | null;
  posterAcademicEmailVerified?: boolean;
}

export interface CreatePostingPayload {
  title: string;
  description?: string;
  researchField?: string;
  collaborationType?: string;
  maxApplicants?: number;
}

export function createPosting(token: string, payload: CreatePostingPayload) {
  return request<Posting>("/api/postings", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function listPostings(token: string, scope: "ALL_ACTIVE" | "MINE") {
  return request<Posting[]>(`/api/postings?scope=${scope}`, { token });
}

export function applyToPosting(token: string, postingId: string, message?: string) {
  return request<PostingApplication>(`/api/postings/${postingId}/apply`, {
    method: "POST",
    token,
    body: JSON.stringify(message ? { message } : {}),
  });
}

export function closePosting(token: string, postingId: string) {
  return request<Posting>(`/api/postings/${postingId}/close`, {
    method: "POST",
    token,
  });
}

export function boostPosting(token: string, postingId: string) {
  return request<Posting>(`/api/postings/${postingId}/boost`, {
    method: "POST",
    token,
  });
}

export function unboostPosting(token: string, postingId: string) {
  return request<Posting>(`/api/postings/${postingId}/unboost`, {
    method: "POST",
    token,
  });
}

export function acceptApplication(token: string, applicationId: string) {
  return request<PostingApplication>(`/api/postings/applications/${applicationId}/accept`, {
    method: "POST",
    token,
  });
}

export function declineApplication(token: string, applicationId: string) {
  return request<PostingApplication>(`/api/postings/applications/${applicationId}/decline`, {
    method: "POST",
    token,
  });
}

export function getMyApplications(token: string) {
  return request<PostingApplication[]>("/api/postings/applications/mine", { token });
}

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

export function searchScholars(token: string, query: string) {
  return request<PublicScholarProfile[]>(`/api/search?q=${encodeURIComponent(query)}`, {
    token,
  });
}

export interface Notification {
  notificationId: string;
  type: string;
  message: string;
  relatedId?: string | null;
  read: boolean;
  createdAt: string;
}

export function getNotifications(token: string) {
  return request<Notification[]>("/api/notifications", { token });
}

export function markNotificationRead(token: string, notificationId: string) {
  return request<Notification>(`/api/notifications/${notificationId}/read`, {
    method: "POST",
    token,
  });
}

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

export interface Subscription {
  status: string;
  currentPeriodEnd: string | null;
}

export function getSubscription(token: string) {
  return request<Subscription>("/api/billing/subscription", { token });
}

export function createCheckoutSession(token: string, successUrl: string, cancelUrl: string) {
  return request<{ url: string }>("/api/billing/checkout", {
    method: "POST",
    token,
    body: JSON.stringify({ successUrl, cancelUrl }),
  });
}
