import { createHmac, timingSafeEqual } from "crypto";

import { cookies } from "next/headers";
import { connection } from "next/server";

const COOKIE = "bs_admin";
const WEEK = 60 * 60 * 24 * 7;

function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) return null;
  return secret;
}

export function adminIsConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && sessionSecret());
}

export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const given = Buffer.from(input);
  const actual = Buffer.from(expected);
  if (given.length !== actual.length) return false;

  return timingSafeEqual(given, actual);
}

export function createSessionToken() {
  const secret = sessionSecret();
  if (!secret) return null;

  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + WEEK * 1000 }),
  ).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");

  return `${payload}.${signature}`;
}

export function sessionIsValid(token: string | undefined) {
  const secret = sessionSecret();
  if (!secret || !token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const given = Buffer.from(signature);
  const actual = Buffer.from(expected);
  if (given.length !== actual.length || !timingSafeEqual(given, actual)) return false;

  try {
    const body = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp?: number };
    return typeof body.exp === "number" && body.exp > Date.now();
  } catch {
    return false;
  }
}

export async function adminIsSignedIn() {
  await connection();
  const cookieStore = await cookies();
  return sessionIsValid(cookieStore.get(COOKIE)?.value);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: WEEK,
  };
}

export { COOKIE as ADMIN_COOKIE };
