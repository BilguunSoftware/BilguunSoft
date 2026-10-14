"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_COOKIE,
  adminIsConfigured,
  adminIsSignedIn,
  createSessionToken,
  passwordMatches,
  sessionCookieOptions,
} from "@/lib/admin-auth";
import { inquiriesCollection } from "@/lib/db";

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

export async function deleteInquiry(id: string) {
  if (!(await adminIsSignedIn())) {
    return { error: "Нэвтрээгүй байна." };
  }

  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return { error: "Хүсэлт олдсонгүй." };
  }

  const collection = await inquiriesCollection();
  if (!collection) {
    return { error: "Өгөгдлийн сан холбогдоогүй." };
  }

  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount !== 1) {
    return { error: "Хүсэлт олдсонгүй." };
  }

  revalidatePath("/admin");
  return { error: "" };
}
