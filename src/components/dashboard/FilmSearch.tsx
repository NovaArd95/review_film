'use client'; // Pastikan ini ada jika komponen menggunakan hooks

import React from 'react';
import Link from 'next/link';

interface Film {
  id_film: number;
  title: string;
  cover_image: string;
  tahun: number;
  genre_names: string[];
  rating?: number;
  description?: string;
  tanggal_rilis: string;

}

interface FilmSearchProps {
  film: Film;
}

const FilmSearch: React.FC<FilmSearchProps> = ({ film }) => {
  // Fungsi untuk memotong teks overview
  const truncateOverview = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-4 w-full flex items-center h-32"> {/* Tinggi container diatur ke h-32 (8rem) */}
      {/* Bagian Gambar Film */}
      <Link href={`/films/${film.id_film}`} className="w-24 h-32 flex-shrink-0">
        <img
          src={film.cover_image}
          alt={film.title}
          className="w-full h-full object-cover cursor-pointer"
        />
      </Link>

      {/* Bagian Informasi Film */}
      <div className="p-4 flex-grow">
       <h1 className="text-lg font-bold ">
            {film.title} <span className="text-gray-400">({film.tahun}) </span>
          </h1>
          <p className="text-gray-400 text-sm ">
                {new Date(film.tanggal_rilis).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })}
                </p>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-semibold"></span> {film.genre_names.join(', ')}
        </p>
        <p className="text-sm text-black">
          {truncateOverview(film.description || 'No description available.', 300)} {/* Deskripsi dibatasi 100 karakter */}
        </p>
      </div>
    </div>
  );
};

export default FilmSearch;