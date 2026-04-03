import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { examSchedules } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { ExamResult, ExamApiResponse, normalizeCourseCode } from '@/lib/exam-utils';

export const dynamic = 'force-dynamic';

function rowToResult(row: typeof examSchedules.$inferSelect): ExamResult {
  return {
    program: row.program,
    slot: row.slot,
    date: row.date,
    startTime: row.startTime,
    endTime: row.endTime,
    courseCode: row.courseCode,
    courseTitle: row.courseTitle,
    faculty: row.faculty,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseCode = searchParams.get('code');
  const codes = searchParams.get('codes');

  if (!courseCode && !codes) {
    return NextResponse.json(
      { error: 'Course code is required' },
      { status: 400 }
    );
  }

  try {
    if (codes) {
      const codeList = codes.split(',').map(c => c.trim()).filter(Boolean);
      const results: { [key: string]: ExamApiResponse } = {};

      for (const code of codeList) {
        const normalized = normalizeCourseCode(code);
        const rows = await db
          .select()
          .from(examSchedules)
          .where(
            sql`lower(replace(replace(${examSchedules.courseCode}, '-', ''), ' ', '')) = ${normalized}`
          );

        const examResults = rows.map(rowToResult);
        results[code] = {
          query: code.toLowerCase(),
          count: examResults.length,
          results: examResults,
        };
      }

      return NextResponse.json(results);
    } else {
      const normalized = normalizeCourseCode(courseCode!);
      const rows = await db
        .select()
        .from(examSchedules)
        .where(
          sql`lower(replace(replace(${examSchedules.courseCode}, '-', ''), ' ', '')) = ${normalized}`
        );

      const examResults = rows.map(rowToResult);
      const apiResponse: ExamApiResponse = {
        query: courseCode!.toLowerCase(),
        count: examResults.length,
        results: examResults,
      };
      return NextResponse.json(apiResponse);
    }
  } catch (error) {
    console.error('Error querying exam data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam data' },
      { status: 502 }
    );
  }
}
