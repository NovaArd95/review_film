import { NextResponse } from 'next/server';
import { executeQuery } from 'lib/db';

interface Negara {
  id_negara?: number;
  nama_negara: string;
  created_at?: string;
  updated_at?: string;
}

// GET: Fetch all countries
export async function GET() {
  try {
    const countries = await executeQuery<Negara[]>({
      query: 'SELECT * FROM negara ORDER BY id_negara DESC',
    });
    return NextResponse.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST: Add a new country
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_negara } = body;

    if (!nama_negara) {
      return NextResponse.json(
        { error: 'Nama negara harus diisi.' },
        { status: 400 }
      );
    }

    const result = await executeQuery<{ affectedRows: number }>({
      query: 'INSERT INTO negara (nama_negara) VALUES (?)',
      values: [nama_negara],
    });

    return NextResponse.json(
      { message: 'Negara berhasil ditambahkan.', result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding country:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menambahkan negara.' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a country
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID negara diperlukan.' },
        { status: 400 }
      );
    }

    const result = await executeQuery<{ affectedRows: number }>({
      query: 'DELETE FROM negara WHERE id_negara = ?',
      values: [parseInt(id)],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Negara tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Negara berhasil dihapus.', result }
    );
  } catch (error) {
    console.error('Error deleting country:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus negara.' },
      { status: 500 }
    );
  }
}
