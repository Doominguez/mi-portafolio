import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_STORED_KEYS = 5000;

const attempts = new Map<string, { count: number; resetAt: number }>();

function getIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function pruneExpired(): void {
  if (attempts.size < MAX_STORED_KEYS) return;
  const now = Date.now();
  for (const [key, entry] of attempts) {
    if (now > entry.resetAt) attempts.delete(key);
  }
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const now = Date.now();
  const entry = attempts.get(ip);

  if (entry && now <= entry.resetAt && entry.count >= MAX_ATTEMPTS) {
    const retryIn = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { success: false, error: "Demasiados intentos. Intentá más tarde." },
      { status: 429, headers: { "Retry-After": String(retryIn) } }
    );
  }

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 0, resetAt: now + WINDOW_MS });
  }
  pruneExpired();

  let email = "";
  let password = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "");
    password = String(body?.password ?? "");
  } catch {
    // cuerpo inválido: se trata como intento fallido
  }

  const result = await signIn(email, password);

  if (!result.success) {
    const current = attempts.get(ip);
    if (current) current.count += 1;
    return NextResponse.json({ success: false }, { status: 401 });
  }

  attempts.delete(ip);
  return NextResponse.json({ success: true });
}
