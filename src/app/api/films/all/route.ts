import { NextResponse } from 'next/server';
import { executeQuery } from 'lib/db';

export async function GET() {
  try {
    // Query untuk mengambil semua film tanpa filter created_by
    let query = `
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