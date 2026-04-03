import { NextResponse } from 'next/server';

// Exam data is now managed via the admin panel (/admin/upload).
// This endpoint is kept for backward compatibility with the exam routine UI.
export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Exam data is managed via the admin panel. Data is always current.',
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}
