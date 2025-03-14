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

    // Cek role pengguna (hanya user dan author yang diizinkan)
    if (token.role !== 'user' && token.role !== 'author') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const film_id = searchParams.get('film_id');

    if (!film_id) {
      return NextResponse.json({ error: 'Film ID is required' }, { status: 400 });
    }

    const query = `
      SELECT rating
      FROM ratings
      WHERE user_id = ? AND film_id = ?
    `;

    const result = await executeQuery<any[]>({ query, values: [token.id, film_id] });

    if (result.length === 0) {
      return NextResponse.json({ rating: null }); // User belum memberikan rating
    }

    return NextResponse.json({ rating: result[0].rating });
  } catch (error) {
    console.error('Error fetching user rating:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}