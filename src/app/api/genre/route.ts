import { NextResponse } from 'next/server';
import { executeQuery } from 'lib/db';

interface Genre {
  id_genre?: number;
  nama_genre: string;
  created_at?: string;
  updated_at?: string;
}

// GET: Fetch all genres
export async function GET() {
  try {
    const genres = await executeQuery<Genre[]>({
      query: 'SELECT * FROM genre ORDER BY id_genre DESC',
    });
    return NextResponse.json(genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST: Add a new genre
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_genre } = body;

    if (!nama_genre) {
      return NextResponse.json(
        { error: 'Nama genre harus diisi.' },
        { status: 400 }
      );
    }

    const result = await executeQuery<{ affectedRows: number }>({
      query: 'INSERT INTO genre (nama_genre) VALUES (?)',
      values: [nama_genre],
    });

    return NextResponse.json(
      { message: 'Genre berhasil ditambahkan.', result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding genre:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menambahkan genre.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id_genre, nama_genre } = body;

    if (!id_genre || !nama_genre) {
      return NextResponse.json(
        { error: 'ID genre dan nama genre harus diisi.' },
        { status: 400 }
      );
    }

    const result = await executeQuery<{ affectedRows: number }>({
      query: 'UPDATE genre SET nama_genre = ? WHERE id_genre = ?',
      values: [nama_genre, id_genre],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Genre tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Genre berhasil diperbarui.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating genre:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui genre.' },
      { status: 500 }
    );
  }
}




// DELETE: Remove a genre
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID genre diperlukan.' },
        { status: 400 }
      );
    }

    const result = await executeQuery<{ affectedRows: number }>({
      query: 'DELETE FROM genre WHERE id_genre = ?',
      values: [parseInt(id)],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Genre tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Genre berhasil dihapus.', result }
    );
  } catch (error) {
    console.error('Error deleting genre:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus genre.' },
      { status: 500 }
    );
  }
}
