import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { executeQuery } from 'lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token || !token.id || !token.role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (token.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const query = `
      SELECT id, username, email, profile_picture, created_at
      FROM users
      WHERE role = 'author'
    `;

    const authors = await executeQuery<any[]>({ query });
    return NextResponse.json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
