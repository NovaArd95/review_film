import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { executeQuery } from 'lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    // Cek apakah pengguna sudah login
    if (!token || !token.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Cek role pengguna (hanya author yang diizinkan)
    if (token.role !== 'author') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const query = `
      SELECT 
        f.id_film AS film_id,
        f.title AS film_title,
        r.user_id,
        u.username,
        u.profile_picture AS avatar,
        r.rating,
        r.created_at
      FROM films f
      JOIN ratings r ON f.id_film = r.film_id
      JOIN users u ON r.user_id = u.id
      WHERE f.created_by = ? AND r.rating < 50
      ORDER BY r.created_at DESC
    `;

    const result = await executeQuery<any[]>({ query, values: [token.id] });

    return NextResponse.json({ notifications: result });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}