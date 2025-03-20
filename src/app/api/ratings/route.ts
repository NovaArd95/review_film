import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { executeQuery } from 'lib/db';

// GET /api/ratings?film_id=:film_id
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const film_id = searchParams.get('film_id');

    if (!film_id) {
      return NextResponse.json({ error: 'Film ID is required' }, { status: 400 });
    }

    const query = `
      SELECT AVG(rating) as average_rating
      FROM ratings
      WHERE film_id = ?
    `;

    const result = await executeQuery<any[]>({ query, values: [film_id] });

    if (result.length === 0 || !result[0].average_rating) {
      return NextResponse.json({ average_rating: 0 }); // Default ke 0 jika tidak ada rating
    }

    return NextResponse.json({ average_rating: result[0].average_rating });
  } catch (error) {
    console.error('Error fetching average rating:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const { film_id, rating } = await request.json();

    // Jika rating null, hapus rating user
    if (rating === null) {
      const deleteQuery = `
        DELETE FROM ratings
        WHERE user_id = ? AND film_id = ?
      `;

      await executeQuery({ query: deleteQuery, values: [token.id, film_id] });
      return NextResponse.json({ message: 'Rating deleted successfully' });
    }

    // Jika rating ada, update atau insert rating
    const upsertQuery = `
      INSERT INTO ratings (user_id, film_id, rating)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE rating = ?
    `;

    await executeQuery({
      query: upsertQuery,
      values: [token.id, film_id, rating, rating],
    });

    return NextResponse.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}