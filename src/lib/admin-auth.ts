import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "yelken_admin";
/** Oturum süresi: 12 saat */
const MAX_AGE = 60 * 60 * 12;

function secret() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD tanımlı değil.");
  return password;
}

function sign(expiresAt: number) {
  return createHmac("sha256", secret()).update(String(expiresAt)).digest("hex");
}

function safeEqual(a: string, b: string) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}

export function checkPassword(input: string) {
  return safeEqual(input, secret());
}

export async function createSession() {
  const expiresAt = Date.now() + MAX_AGE * 1000;
  const store = await cookies();
  store.set(COOKIE_NAME, `${expiresAt}.${sign(expiresAt)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isLoggedIn() {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return false;

  const [expiresPart, signature] = value.split(".");
  const expiresAt = Number(expiresPart);
  if (!Number.isFinite(expiresAt) || !signature) return false;
  if (expiresAt < Date.now()) return false;

  try {
    return safeEqual(signature, sign(expiresAt));
  } catch {
    return false;
  }
}
