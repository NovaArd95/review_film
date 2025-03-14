'use client';

import { useState } from 'react';
import Filters from '@/components/dashboard/CategoryFilters';
import FilmCard from '@/components/dashboard/CategoryCard';

interface Film {
  id_film: number;
  title: string;
  cover_image: string;
  tahun: number;
  genre_names?: string[] | string;
  rating?: number;
  description?: string;
  release_date?: string;
  negara: string;
  tanggal_rilis: string;
}

const CategoryPage = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [isEmptyResult, setIsEmptyResult] = useState(false); // State untuk mengecek hasil pencarian kosong

  const handleSearch = async () => {
    try {
      const response = await fetch('/api/films/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          genres: selectedGenres,
          year: selectedYear,
          country: selectedCountry,
        }),
      });

      const data = await response.json();

      if (data.length === 0) {
        setIsEmptyResult(true); // Set state isEmptyResult menjadi true jika hasil pencarian kosong
      } else {
        setIsEmptyResult(false); // Set state isEmptyResult menjadi false jika ada hasil pencarian
      }

      setFilms(data);
    } catch (error) {
      console.error('Error fetching films:', error);
      setIsEmptyResult(true); // Set state isEmptyResult menjadi true jika terjadi error
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Category Film</h1>
      
      {/* Filter Section */}
      <Filters
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        onSearch={handleSearch}
      />

      {/* Pesan Jika Hasil Pencarian Kosong */}
      {isEmptyResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center shadow-md">
          <p className="text-gray-600">Film tidak ditemukan.</p>
        </div>
      )}

      {/* Results Section */}
      <div className="mt-8 space-y-4">
        {films.map((film) => (
          <FilmCard key={film.id_film} film={film} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;