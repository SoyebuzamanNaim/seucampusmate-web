import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth-utils';
import { sql } from 'drizzle-orm';

// Check if any admin user already exists
export async function GET() {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(adminUsers);
  const count = Number(result[0]?.count ?? 0);
  return NextResponse.json({ setupRequired: count === 0 });
}

// Create the first admin user — only works if no admin exists yet
export async function POST(request: NextRequest) {
  // Double-check: refuse if an admin already exists
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(adminUsers);
  const count = Number(result[0]?.count ?? 0);

  if (count > 0) {
    return NextResponse.json(
      { error: 'Setup already completed. An admin account already exists.' },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { name, email, password } = body as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: 'Name, email, and password are required.' },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters.' },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);

  await db.insert(adminUsers).values({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
  });

  return NextResponse.json({ success: true });
}
