import { cookies } from "next/headers";

const COOKIE_NAME = "admin-token";
const TOKEN_VALUE = "authenticated";

export async function auth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token === TOKEN_VALUE) {
    return { user: { role: "admin" } };
  }
  return null;
}

export async function signIn(email: string, password: string) {
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, TOKEN_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return { success: true };
  }
  return { success: false };
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
