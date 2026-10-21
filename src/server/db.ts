import "server-only";

import { Pool, type QueryResult, type QueryResultRow } from "pg";

let pool: Pool | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function connectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL belum diatur. Salin string koneksi dari Neon ke .env.local " +
        "(lihat .env.example).",
    );
  }
  return url;
}

function getPool(): Pool {
  if (!pool) {
    const connStr = connectionString();
    // Add uselibpqcompat for compatibility with pg-connection-string v3+
    const connectionStringWithCompat = connStr.includes("uselibpqcompat")
      ? connStr
      : connStr.includes("?")
        ? `${connStr}&uselibpqcompat=true`
        : `${connStr}?uselibpqcompat=true`;

    pool = new Pool({
      connectionString: connectionStringWithCompat,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, params);
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const result = await query<T>(text, params);
  return result.rows[0] ?? null;
}
