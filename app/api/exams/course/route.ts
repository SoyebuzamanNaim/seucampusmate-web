import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { examSchedules } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { ExamResult, ExamApiResponse } from '@/lib/exam-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (!title) {
    return NextResponse.json(
      { error: 'Course title is required' },
      { status: 400 }
    );
  }

  try {
    const rows = await db
      .select()
      .from(examSchedules)
      .where(sql`lower(${examSchedules.courseTitle}) LIKE ${'%' + title.toLowerCase() + '%'}`);

    const results: ExamResult[] = rows.map(row => ({
      program: row.program,
      slot: row.slot,
      date: row.date,
      startTime: row.startTime,
      endTime: row.endTime,
      courseCode: row.courseCode,
      courseTitle: row.courseTitle,
      faculty: row.faculty,
    }));

    const apiResponse: ExamApiResponse = {
      query: title.toLowerCase(),
      count: results.length,
      results,
    };

    return NextResponse.json(apiResponse);
  } catch (error) {
    console.error('Error querying exam data by title:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam data' },
      { status: 502 }
    );
  }
}
