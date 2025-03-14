import React from 'react';
import Link from 'next/link';

interface Film {
  id_film: number;
  title: string;
  cover_image: string;
  tahun: number; // Pastikan tahun ada di sini
  genre_names?: string[] | string; // Bisa array atau string
  rating?: number;
  description?: string;
  release_date?: string;
  negara: string;
  tanggal_rilis: string;
}

interface FilmCardProps {
  film: Film;
}

const FilmCard: React.FC<FilmCardProps> = ({ film }) => {
  // Fungsi untuk memastikan genre_names adalah array
  const getGenres = () => {
    if (Array.isArray(film.genre_names)) {
      return film.genre_names;
    } else if (typeof film.genre_names === 'string') {
      return film.genre_names.split(','); // Konversi string ke array
    }
    return []; // Default: array kosong
  };

  // Fungsi untuk memotong teks deskripsi
  const truncateOverview = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const genres = getGenres();

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-4 w-full flex items-center h-32">
      {/* Gambar Film */}
      <Link href={`/films/${film.id_film}`} className="w-24 h-32 flex-shrink-0">
        <img
          src={film.cover_image}
          alt={film.title}
          className="w-full h-full object-cover cursor-pointer"
        />
      </Link>

      {/* Informasi Film */}
      <div className="p-4 flex-grow">
        <h1 className="text-lg font-bold">
          {film.title} <span className="text-gray-400">({film.tahun})</span>
        </h1>
        <p className="text-gray-400 text-sm">
          {new Date(film.tanggal_rilis).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
          <span className="mx-1">|</span> {/* Pemisah antara tanggal dan negara */}
          {film.negara}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-semibold"></span> {genres.join(', ')}
        </p>
        <p className="text-sm text-black">
          {truncateOverview(film.description || 'No description available.', 300)}
        </p>
      </div>
    </div>
  );
};

export default FilmCard;