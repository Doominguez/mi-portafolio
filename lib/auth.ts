import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { COOKIE_NAME, createSessionToken, TTL_SECONDS, verifySessionToken } from "@/lib/session";

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  return aBuf.length === bBuf.length && timingSafeEqual(aBuf, bBuf);
}

function hasSecret(): boolean {
  return Boolean(process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET);
}

export async function auth() {
  if (!hasSecret()) return null;
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (verifySessionToken(token)) {
    return { user: { role: "admin" } };
  }
  return null;
}

export async function signIn(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword || !hasSecret()) {
    return { success: false };
  }

  if (safeEqual(email, adminEmail) && safeEqual(password, adminPassword)) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: TTL_SECONDS,
    });
    return { success: true };
  }
  return { success: false };
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
