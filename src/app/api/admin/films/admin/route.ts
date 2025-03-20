// app/api/admin/films/admin/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { executeQuery } from 'lib/db';

interface Film {
  id_film?: number;
  title: string;
  description: string;
  min_age: number;
  trailer_url: string;
  cover_image: string;
  bg_image: string;
  id_tahun: number;
  id_negara: number;
  created_by: number;
  tanggal_rilis: string;
  durasi: number;
  created_at?: string;
  updated_at?: string;
  genres?: number[];
}

// GET: Ambil semua film yang dibuat oleh admin yang sedang login
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token || !token.id || !token.role) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { role, id } = token;

    if (role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Query untuk mengambil film yang dibuat oleh admin yang sedang login
    const query = `
      SELECT 
        films.*, 
        GROUP_CONCAT(genre.nama_genre) AS genre_names,
        GROUP_CONCAT(film_genres.genre_id) AS genre_ids,
        tahun.tahun_rilis AS tahun,
        negara.nama_negara AS nama_negara,
        DATE_FORMAT(films.tanggal_rilis, '%Y-%m-%d') AS formatted_tanggal_rilis
      FROM films
      LEFT JOIN film_genres ON films.id_film = film_genres.film_id
      LEFT JOIN genre ON film_genres.genre_id = genre.id_genre
      LEFT JOIN tahun ON films.id_tahun = tahun.id_tahun
      LEFT JOIN negara ON films.id_negara = negara.id_negara
      WHERE films.created_by = ${id} -- Hanya ambil film yang dibuat oleh admin yang sedang login
      GROUP BY films.id_film
      ORDER BY films.id_film DESC
    `;

    const films = await executeQuery<any[]>({ query });
    const formattedFilms = films.map((film) => ({
      ...film,
      genre_names: film.genre_names ? film.genre_names.split(',') : [],
      genre_ids: film.genre_ids ? film.genre_ids.split(',').map(Number) : [],
    }));

    return NextResponse.json(formattedFilms);
  } catch (error) {
    console.error('Error fetching films:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST: Tambah film baru oleh admin yang sedang login
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token || !token.id || !token.role) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { role, id } = token;

    if (role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      min_age,
      trailer_url,
      cover_image,
      bg_image,
      id_tahun,
      id_negara,
      tanggal_rilis,
      durasi,
      genres,
    } = body;

    if (
      !title ||
      !description ||
      !min_age ||
      !trailer_url ||
      !cover_image ||
      !bg_image ||
      !id_tahun ||
      !id_negara ||
      !tanggal_rilis ||
      !durasi ||
      !genres ||
      genres.length < 2 ||
      genres.length > 5
    ) {
      return NextResponse.json(
        { error: 'Semua field harus diisi, dan genre minimal 2 maksimal 5.' },
        { status: 400 }
      );
    }

    // Insert film baru
    const filmResult = await executeQuery<{ insertId: number }>({
      query: `
        INSERT INTO films 
          (title, description, min_age, trailer_url, cover_image, bg_image, 
           id_tahun, id_negara, created_by, tanggal_rilis, durasi) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        title,
        description,
        min_age,
        trailer_url,
        cover_image,
        bg_image,
        id_tahun,
        id_negara,
        id, // Gunakan ID admin yang sedang login sebagai created_by
        tanggal_rilis,
        durasi,
      ],
    });

    const filmId = filmResult.insertId;

    // Insert genre-genre film
    for (const genreId of genres) {
      await executeQuery({
        query: 'INSERT INTO film_genres (film_id, genre_id) VALUES (?, ?)',
        values: [filmId, genreId],
      });
    }

    return NextResponse.json(
      { message: 'Film berhasil ditambahkan.', filmId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding film:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menambahkan film.' },
      { status: 500 }
    );
  }
}

// PUT: Update film oleh admin yang sedang login
export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token || !token.id || !token.role) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { role, id } = token;

    if (role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      id_film,
      title,
      description,
      min_age,
      trailer_url,
      cover_image,
      bg_image,
      id_tahun,
      id_negara,
      tanggal_rilis,
      durasi,
      genres,
    } = body;

    if (
      !id_film ||
      !title ||
      !description ||
      !min_age ||
      !trailer_url ||
      !cover_image ||
      !bg_image ||
      !id_tahun ||
      !id_negara ||
      !tanggal_rilis ||
      !durasi ||
      !genres ||
      genres.length < 2 ||
      genres.length > 5
    ) {
      return NextResponse.json(
        { error: 'Semua field harus diisi, dan genre minimal 2 maksimal 5.' },
        { status: 400 }
      );
    }

    // Update film
    const filmResult = await executeQuery<{ affectedRows: number }>({
      query: `
        UPDATE films 
        SET 
          title = ?, 
          description = ?, 
          min_age = ?, 
          trailer_url = ?, 
          cover_image = ?,
          bg_image = ?, 
          id_tahun = ?, 
          id_negara = ?,
          tanggal_rilis = ?,
          durasi = ?
        WHERE id_film = ? AND created_by = ? -- Hanya update film yang dibuat oleh admin yang sedang login
      `,
      values: [
        title,
        description,
        min_age,
        trailer_url,
        cover_image,
        bg_image,
        id_tahun,
        id_negara,
        tanggal_rilis,
        durasi,
        id_film,
        id, // Pastikan hanya admin yang membuat film ini yang bisa mengupdate
      ],
    });

    if (filmResult.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Film tidak ditemukan atau Anda tidak memiliki izin.' },
        { status: 404 }
      );
    }

    // Hapus genre lama dan insert genre baru
    await executeQuery({
      query: 'DELETE FROM film_genres WHERE film_id = ?',
      values: [id_film],
    });

    for (const genreId of genres) {
      await executeQuery({
        query: 'INSERT INTO film_genres (film_id, genre_id) VALUES (?, ?)',
        values: [id_film, genreId],
      });
    }

    return NextResponse.json(
      { message: 'Film berhasil diperbarui.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating film:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui film.' },
      { status: 500 }
    );
  }
}

// DELETE: Hapus film oleh admin yang sedang login
export async function DELETE(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token || !token.id || !token.role) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { role, id } = token;

    if (role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const filmId = url.searchParams.get('id');

    if (!filmId) {
      return NextResponse.json(
        { error: 'ID film diperlukan.' },
        { status: 400 }
      );
    }

    // Hapus film hanya jika dibuat oleh admin yang sedang login
    const result = await executeQuery<{ affectedRows: number }>({
      query: 'DELETE FROM films WHERE id_film = ? AND created_by = ?',
      values: [parseInt(filmId), id],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Film tidak ditemukan atau Anda tidak memiliki izin.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Film berhasil dihapus.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting film:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus film.' },
      { status: 500 }
    );
  }
}