import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { executeQuery } from 'lib/db';

export async function PUT(request:NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req: request });

    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const requestId = params.id;

    // Update status permintaan menjadi 'approved'
    const updateRequestQuery = `
      UPDATE author_requests
      SET status = 'approved'
      WHERE id = ?
    `;
    await executeQuery({
      query: updateRequestQuery,
      values: [requestId],
    });

    // Update role user menjadi 'author'
    const updateUserQuery = `
      UPDATE users
      SET role = 'author'
      WHERE id = (SELECT user_id FROM author_requests WHERE id = ?)
    `;
    await executeQuery({
      query: updateUserQuery,
      values: [requestId],
    });

    return NextResponse.json(
      { message: 'Author request approved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error approving author request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}