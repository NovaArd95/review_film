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
      JOIN favorites ON films.id_film = favorites.film_id
      WHERE favorites.user_id = ?
    `;

    const favorites = await executeQuery<any[]>({
      query,
      values: [token.id],
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
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
        INSERT INTO favorites (user_id, film_id)
        VALUES (?, ?)
      `;
  
      await executeQuery({
        query,
        values: [token.id, film_id],
      });
  
      return NextResponse.json({ message: 'Film added to favorites' });
    } catch (error) {
      console.error('Error adding to favorites:', error);
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
      DELETE FROM favorites
      WHERE user_id = ? AND film_id = ?
    `;

    await executeQuery({
      query,
      values: [token.id, film_id],
    });

    return NextResponse.json({ message: 'Film removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}