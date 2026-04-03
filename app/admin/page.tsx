import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export default async function AdminPage() {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(adminUsers);
  const count = Number(result[0]?.count ?? 0);

  if (count === 0) {
    redirect('/admin/setup');
  }

  redirect('/admin/dashboard');
}
