import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { executeQuery } from 'lib/db';

export async function GET(request: NextRequest) {
    try {
      const token = await getToken({ req: request });
  
      if (!token || !token.id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
  
      const query = `
        SELECT films.*
        FROM films
        JOIN watchlist ON films.id_film = watchlist.film_id
        WHERE watchlist.user_id = ?
      `;
  
      const watchlist = await executeQuery<any[]>({
        query,
        values: [token.id],
      });
  
      return NextResponse.json(watchlist);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }


export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token || !token.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { film_id } = await request.json();

    const query = `
      INSERT INTO watchlist (user_id, film_id)
      VALUES (?, ?)
    `;

    await executeQuery({
      query,
      values: [token.id, film_id],
    });

    return NextResponse.json({ message: 'Film added to watchlist' });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
    try {
      const token = await getToken({ req: request });
  
      if (!token || !token.id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
  
      const { film_id } = await request.json();
  
      const query = `
        DELETE FROM watchlist
        WHERE user_id = ? AND film_id = ?
      `;
  
      await executeQuery({
        query,
        values: [token.id, film_id],
      });
  
      return NextResponse.json({ message: 'Film removed from watchlist' });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }
