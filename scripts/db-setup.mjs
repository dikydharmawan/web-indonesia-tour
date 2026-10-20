import { readFile } from "node:fs/promises";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import path from "node:path";
import { Pool } from "pg";

const scryptAsync = promisify(scrypt);

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@admin.com";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin1207";
const DEFAULT_ADMIN_NAME = process.env.ADMIN_NAME ?? "Administrator";

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, 64);
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL belum diatur. Isi .env.local terlebih dahulu.");
    process.exit(1);
  }

  const schemaPath = path.join(process.cwd(), "schema.db");
  const sql = await readFile(schemaPath, "utf8");

  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("Menerapkan skema schema.db…");
    await pool.query(sql);
    console.log("Skema berhasil diterapkan (idempotent).");

    const existing = await pool.query("select count(*)::int as n from public.admin_users");
    if (existing.rows[0].n > 0) {
      console.log(`Akun admin sudah ada (${existing.rows[0].n}). Lewati pembuatan admin.`);
    } else {
      const passwordHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
      await pool.query(
        `insert into public.admin_users (email, name, password_hash)
         values (lower($1), $2, $3)
         on conflict (email) do nothing`,
        [DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_NAME, passwordHash],
      );
      console.log(`Akun admin dibuat: ${DEFAULT_ADMIN_EMAIL}`);
      console.log("Login di /login dan segera ganti kata sandi.");
    }
  } catch (error) {
    console.error("Gagal menyiapkan database:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
