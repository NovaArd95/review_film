import { NextResponse } from 'next/server';
import { executeQuery } from 'lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, username, email } = body;

    // Check if there's already a pending request
    const existingRequests: any[] = await executeQuery({
      query: 'SELECT * FROM author_requests WHERE user_id = ? AND status = "pending"',
      values: [userId],
    });

    if (existingRequests.length > 0) {
      return NextResponse.json(
        { error: 'You already have a pending request' },
        { status: 400 }
      );
    }

    // Create new request
    await executeQuery({
      query: `INSERT INTO author_requests (user_id, username, email, status, created_at)
              VALUES (?, ?, ?, 'pending', NOW())`,
      values: [userId, username, email],
    });

    return NextResponse.json(
      { message: 'Author request submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating author request:', error);
    return NextResponse.json(
      { error: 'Failed to submit author request' },
      { status: 500 }
    );
  }
}
