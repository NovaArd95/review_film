import { NextResponse } from 'next/server';
import { executeQuery } from 'lib/db';

interface TahunRilis {
  id_tahun?: number;
  tahun_rilis: number;
  created_at?: string;
  updated_at?: string;
}

// GET: Fetch all tahun rilis
export async function GET() {
  try {
    const years = await executeQuery<TahunRilis[]>({
      query: 'SELECT * FROM tahun ORDER BY tahun_rilis DESC',
    });

    if (!years) {
      throw new Error('No data returned from database');
    }

    return NextResponse.json(years);
  } catch (error: any) {
    console.error('Error in GET /api/tahun:', error);
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan saat mengambil data.', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST: Add a new tahun rilis
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tahun_rilis } = body;

    if (!tahun_rilis) {
      return NextResponse.json(
        { error: 'Tahun rilis harus diisi.' },
        { status: 400 }
      );
    }

    // Validate year format
    if (!Number.isInteger(tahun_rilis) || tahun_rilis < 1900 || tahun_rilis > 2100) {
      return NextResponse.json(
        { error: 'Format tahun tidak valid.' },
        { status: 400 }
      );
    }

    const result = await executeQuery<{ affectedRows: number }>({
      query: 'INSERT INTO tahun (tahun_rilis) VALUES (?)',
      values: [tahun_rilis],
    });

    return NextResponse.json(
      { message: 'Tahun rilis berhasil ditambahkan.', result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding tahun rilis:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menambahkan tahun rilis.' },
      { status: 500 }
    );
  }
}

// PUT: Update a tahun rilis
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const body = await request.json();
    const { tahun_rilis } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID tahun rilis diperlukan.' },
        { status: 400 }
      );
    }

    if (!tahun_rilis) {
      return NextResponse.json(
        { error: 'Tahun rilis harus diisi.' },
        { status: 400 }
      );
    }

    // Validate year format
    if (!Number.isInteger(tahun_rilis) || tahun_rilis < 1900 || tahun_rilis > 2100) {
      return NextResponse.json(
        { error: 'Format tahun tidak valid.' },
        { status: 400 }
      );
    }

    const result = await executeQuery<{ affectedRows: number }>({
      query: 'UPDATE tahun SET tahun_rilis = ? WHERE id_tahun = ?',
      values: [tahun_rilis, parseInt(id)],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Tahun rilis tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Tahun rilis berhasil diperbarui.', result }
    );
  } catch (error) {
    console.error('Error updating tahun rilis:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui tahun rilis.' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a tahun rilis
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID tahun rilis diperlukan.' },
        { status: 400 }
      );
    }

    const result = await executeQuery<{ affectedRows: number }>({
      query: 'DELETE FROM tahun WHERE id_tahun = ?',
      values: [parseInt(id)],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Tahun rilis tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Tahun rilis berhasil dihapus.', result }
    );
  } catch (error) {
    console.error('Error deleting tahun rilis:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus tahun rilis.' },
      { status: 500 }
    );
  }
}