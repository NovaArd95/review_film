import { NextResponse } from 'next/server';
import { executeQuery } from 'lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
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
      WHERE films.id_film = ?
      GROUP BY films.id_film
    `;

    const films = await executeQuery<any[]>({ query, values: [params.id] });
    if (films.length === 0) {
      return NextResponse.json({ error: 'Film not found' }, { status: 404 });
    }

    const film = films[0];
    const formattedFilm = {
      ...film,
      genre_names: film.genre_names ? film.genre_names.split(',') : [],
      genre_ids: film.genre_ids ? film.genre_ids.split(',').map(Number) : [],
    };

    return NextResponse.json(formattedFilm);
  } catch (error) {
    console.error('Error fetching film:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}