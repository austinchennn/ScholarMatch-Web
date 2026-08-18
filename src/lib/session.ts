import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api";

export const SESSION_COOKIE = "sm_token";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // matches the server's 7-day JWT expiry

export async function getSessionToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

export async function setSessionToken(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

export async function clearSessionToken() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

// Guard clause repeated verbatim across every server action and server component that needs
// a logged-in scholar: get the token, or bounce to /login if there isn't one. Centralized here
// so all ~20 call sites share one implementation instead of copy-pasting it.
export async function requireSessionToken(): Promise<string> {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }
  return token;
}

// Companion to requireSessionToken: a valid-looking token can still be expired or revoked
// server-side, which surfaces as a 401 from the API. Wrapping a data load in this turns that
// into the same "bounce to /login" behavior as a missing token, instead of an unhandled
// ApiError reaching the page.
export async function withAuthRedirect<T>(load: () => Promise<T>): Promise<T> {
  try {
    return await load();
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }
}
