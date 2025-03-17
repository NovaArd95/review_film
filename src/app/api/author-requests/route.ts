import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { executeQuery } from 'lib/db';

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    // Debugging: Cetak token untuk memastikan isinya
    console.log('Token in POST API:', token);

    // Periksa apakah token valid dan memiliki userId
    if (!token || !token.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing or invalid token' },
        { status: 401 }
      );
    }

    // Ambil userId dari token, bukan dari body request
    const userId = token.id;

    // Cek apakah user sudah memiliki permintaan yang pending
    const checkQuery = `
      SELECT * FROM author_requests
      WHERE user_id = ? AND status = 'pending'
    `;
    const existingRequest = await executeQuery<any[]>({
      query: checkQuery,
      values: [userId],
    });

    if (existingRequest.length > 0) {
      return NextResponse.json(
        { error: 'You already have a pending request' },
        { status: 400 }
      );
    }

    // Buat permintaan baru
    const insertQuery = `
      INSERT INTO author_requests (user_id, status)
      VALUES (?, 'pending')
    `;
    await executeQuery({
      query: insertQuery,
      values: [userId],
    });

    return NextResponse.json(
      { message: 'Author request submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting author request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    // Debugging: Cetak token untuk memastikan isinya
    console.log('Token in GET API:', token);

    // Periksa apakah token valid dan memiliki role admin
    if (!token || (!token.role && token.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized: Only admins can access this resource' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    let query = `
      SELECT ar.*, u.username, u.email
      FROM author_requests ar
      JOIN users u ON ar.user_id = u.id
      WHERE ar.status = 'pending'
    `;

    if (userId) {
      query += ` AND ar.user_id = ${userId}`;
    }

    const requests = await executeQuery<any[]>({ query });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching author requests:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}