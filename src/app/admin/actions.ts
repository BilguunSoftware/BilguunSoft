"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_COOKIE,
  adminIsConfigured,
  createSessionToken,
  passwordMatches,
  sessionCookieOptions,
} from "@/lib/admin-auth";

export async function login(_previous: { error: string } | null, formData: FormData) {
  if (!adminIsConfigured()) {
    return { error: "Админ нэвтрэлт тохируулаагүй." };
  }

  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) {
    return { error: "Нууц үг буруу байна." };
  }

  const token = createSessionToken();
  if (!token) {
    return { error: "Админ нэвтрэлт тохируулаагүй." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, sessionCookieOptions());
  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin");
}
