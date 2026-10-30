import { promises as fs } from "node:fs";
import path from "node:path";
import postgres from "postgres";
import type { DocKey } from "./schema";

/*
  What the admin (its own deployment) saved: Postgres (Railway) when DATABASE_URL is set (production,
  the same database the admin writes), otherwise the gitignored .cms-dev.json that a local admin
  writes next door. The site only reads. The table is created on first use, so a fresh database
  needs no migration step.
*/

/** Railway Postgres (its public DATABASE_PUBLIC_URL, since Vercel is outside Railway's network), or any Postgres URL. */
function connect() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  // One connection per function instance, closed when idle, so serverless never piles them up
  return postgres(url, { max: 1, idle_timeout: 20, ssl: local ? false : "require" });
}

const sql = connect();
const DEV_FILE = path.join(process.cwd(), ".cms-dev.json");

type DevStore = { content: Record<string, { data: unknown; updated_at: string; updated_by: string }> };

let ready: Promise<unknown> | null = null;
function ensureTables() {
  if (!sql) return Promise.resolve();
  ready ??= sql`create table if not exists content (key text primary key, data jsonb not null, updated_at timestamptz not null default now(), updated_by text)`;
  return ready;
}

async function readDev(): Promise<DevStore> {
  try {
    return JSON.parse(await fs.readFile(DEV_FILE, "utf8")) as DevStore;
  } catch {
    return { content: {} };
  }
}

export async function readDocs(): Promise<Partial<Record<DocKey, unknown>>> {
  if (!sql) return Object.fromEntries(Object.entries((await readDev()).content).map(([k, v]) => [k, v.data]));
  await ensureTables();
  const rows = (await sql`select key, data from content`) as unknown as { key: DocKey; data: unknown }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.data]));
}
