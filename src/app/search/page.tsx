'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import FilmSearch from '@/components/dashboard/FilmSearch';

interface Film {
  id_film: number;
  title: string;
  cover_image: string;
  tahun: number;
  genre_names: string[];
  rating?: number;
  description?: string;
  release_date?: string;
  trailer_url?: string;
  bg_image?: string;
  nama_negara?: string;
  tanggal_rilis: string;
  durasi?: string;
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [films, setFilms] = useState<Film[]>([]);

  useEffect(() => {
    if (query) {
      fetch(`/api/films/search?query=${query}`)
        .then((response) => response.json())
        .then((data) => setFilms(data))
        .catch((error) => console.error('Error fetching search results:', error));
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Search Results for "{query}"</h1>
      <div className="space-y-4">
        {films.map((film) => (
          <FilmSearch key={film.id_film} film={film} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;