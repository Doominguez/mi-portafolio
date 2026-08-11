import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const COOKIE_NAME = "admin-token";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const TTL_SECONDS = 7 * 24 * 60 * 60;

function secret(): string {
  return process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "";
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + TTL_MS, jti: randomUUID() })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !secret()) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;

  const provided = Buffer.from(signature);
  const expected = Buffer.from(sign(payload));
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return false;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export { TTL_SECONDS };
