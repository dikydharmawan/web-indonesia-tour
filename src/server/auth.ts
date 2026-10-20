import "server-only";

import { randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { query, queryOne } from "@/server/db";

const scryptAsync = promisify(scrypt);

export const SESSION_COOKIE = "admin_session";
const SESSION_TTL_DAYS = 7;

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
};

type AdminRow = AdminUser & { password_hash: string };

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [scheme, salt, hash] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(derived, expected);
}

export async function authenticate(
  email: string,
  password: string,
): Promise<AdminUser | null> {
  const row = await queryOne<AdminRow>(
    "select id, email, name, password_hash from public.admin_users where lower(email) = lower($1)",
    [email],
  );
  if (!row) return null;
  const ok = await verifyPassword(password, row.password_hash);
  if (!ok) return null;
  return { id: row.id, email: row.email, name: row.name };
}

export async function createSession(adminId: string): Promise<void> {
  const token = randomUUID() + randomUUID().replace(/-/g, "");
  const expiresAt = new Date(
    Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  );

  await query(
    "insert into public.admin_sessions (token, user_id, expires_at) values ($1, $2, $3)",
    [token, adminId, expiresAt.toISOString()],
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await query("delete from public.admin_sessions where token = $1", [token]);
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = await queryOne<AdminUser>(
    `select u.id, u.email, u.name
       from public.admin_sessions s
       join public.admin_users u on u.id = s.user_id
      where s.token = $1 and s.expires_at > now()`,
    [token],
  );
  return row;
}

export async function getAdminBySessionToken(
  token: string | undefined,
): Promise<AdminUser | null> {
  if (!token) return null;
  const row = await queryOne<AdminUser>(
    `select u.id, u.email, u.name
       from public.admin_sessions s
       join public.admin_users u on u.id = s.user_id
      where s.token = $1 and s.expires_at > now()`,
    [token],
  );
  return row;
}
