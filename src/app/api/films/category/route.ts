import { NextResponse } from 'next/server';
import { executeQuery } from 'lib/db';

export async function POST(request: Request) {
  const { genres, year, country } = await request.json();

  let query = `
    SELECT 
      films.*, 
      GROUP_CONCAT(genre.nama_genre) AS genre_names,
      tahun.tahun_rilis AS tahun, 
      negara.nama_negara AS negara
    FROM films
    LEFT JOIN film_genres ON films.id_film = film_genres.film_id
    LEFT JOIN genre ON film_genres.genre_id = genre.id_genre
    LEFT JOIN tahun ON films.id_tahun = tahun.id_tahun -- Join dengan tabel tahun
    LEFT JOIN negara ON films.id_negara = negara.id_negara
  `;

  const conditions = [];
  if (genres && genres.length > 0) {
    conditions.push(`genre.id_genre IN (${genres.join(', ')})`);
  }
  if (year) {
    conditions.push(`tahun.id_tahun = ${year}`);
  }
  if (country) {
    conditions.push(`negara.id_negara = ${country}`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ` GROUP BY films.id_film`;

  try {
    const films = await executeQuery<any[]>({ query });
    return NextResponse.json(films);
  } catch (error) {
    console.error('Error fetching films:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}