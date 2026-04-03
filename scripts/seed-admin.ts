import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import bcryptjs from 'bcryptjs';
import { config } from 'dotenv';
import { resolve } from 'path';
import * as schema from '../lib/db/schema';
import { sql } from 'drizzle-orm';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) { console.error(`ERROR: ${key} is not set`); process.exit(1); }
  return val;
}

const DATABASE_URL   = requireEnv('DATABASE_URL');
const ADMIN_EMAIL    = requireEnv('SEED_ADMIN_EMAIL');
const ADMIN_PASSWORD = requireEnv('SEED_ADMIN_PASSWORD');
const ADMIN_NAME     = process.env.SEED_ADMIN_NAME ?? 'Admin';

if (ADMIN_PASSWORD.length < 8) {
  console.error('ERROR: SEED_ADMIN_PASSWORD must be at least 8 characters');
  process.exit(1);
}

const connection = neon(DATABASE_URL);
const db = drizzle(connection, { schema });

async function main() {
  console.log('Running schema DDL...');

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id            SERIAL PRIMARY KEY,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name          TEXT,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS exam_schedules (
      id           SERIAL PRIMARY KEY,
      program      TEXT NOT NULL DEFAULT '',
      slot         TEXT NOT NULL DEFAULT '',
      date         TEXT NOT NULL DEFAULT '',
      start_time   TEXT NOT NULL DEFAULT '',
      end_time     TEXT NOT NULL DEFAULT '',
      course_code  TEXT NOT NULL DEFAULT '',
      course_title TEXT NOT NULL DEFAULT '',
      students     TEXT NOT NULL DEFAULT '',
      faculty      TEXT NOT NULL DEFAULT ''
    )
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS idx_exam_schedules_course_code
    ON exam_schedules (lower(replace(replace(course_code, '-', ''), ' ', '')))
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS upload_history (
      id            SERIAL PRIMARY KEY,
      filename      TEXT NOT NULL,
      uploaded_by   INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
      row_count     INTEGER NOT NULL DEFAULT 0,
      status        TEXT NOT NULL DEFAULT 'success',
      error_message TEXT,
      uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  console.log('Hashing password...');
  const passwordHash = await bcryptjs.hash(ADMIN_PASSWORD, 12);

  console.log(`Creating admin user: ${ADMIN_EMAIL}`);
  await db.execute(sql`
    INSERT INTO admin_users (email, password_hash, name)
    VALUES (${ADMIN_EMAIL.toLowerCase()}, ${passwordHash}, ${ADMIN_NAME})
    ON CONFLICT (email) DO UPDATE
      SET password_hash = EXCLUDED.password_hash,
          name          = EXCLUDED.name,
          updated_at    = NOW()
  `);

  console.log('Done. Admin user created/updated successfully.');
  process.exit(0);
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
