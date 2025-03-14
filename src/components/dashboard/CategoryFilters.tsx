'use client';

import React, { useEffect, useState } from 'react';

interface Genre {
  id_genre: number;
  nama_genre: string;
}

interface Year {
  id_tahun: number;
  tahun_rilis: string;
}

interface Country {
  id_negara: number;
  nama_negara: string;
}

interface FiltersProps {
  selectedGenres: number[];
  setSelectedGenres: (genres: number[]) => void;
  selectedYear: number | null;
  setSelectedYear: (year: number | null) => void;
  selectedCountry: number | null;
  setSelectedCountry: (country: number | null) => void;
  onSearch: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  selectedGenres,
  setSelectedGenres,
  selectedYear,
  setSelectedYear,
  selectedCountry,
  setSelectedCountry,
  onSearch,
}) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  // Ambil data genre, tahun, dan negara dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresRes, yearsRes, countriesRes] = await Promise.all([
          fetch('/api/genre').then((res) => res.json()),
          fetch('/api/tahun').then((res) => res.json()),
          fetch('/api/negara').then((res) => res.json()),
        ]);
        setGenres(genresRes);
        setYears(yearsRes);
        setCountries(countriesRes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Fungsi untuk menangani pemilihan genre
  const handleGenreSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genreId = parseInt(e.target.value);
    if (!selectedGenres.includes(genreId)) {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  // Fungsi untuk menghapus genre yang dipilih
  const handleRemoveGenre = (genreId: number) => {
    setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tahun Filter */}
        <div>
          <label className="block text-xs font-medium mb-1">Tahun</label>
          <select
            value={selectedYear || ''}
            onChange={(e) => setSelectedYear(parseInt(e.target.value) || null)}
            className="select select-bordered select-sm w-full"
          >
            <option value="">Pilih Tahun</option>
            {years.map((year) => (
              <option key={year.id_tahun} value={year.id_tahun}>
                {year.tahun_rilis}
              </option>
            ))}
          </select>
        </div>

        {/* Negara Filter */}
        <div>
          <label className="block text-xs font-medium mb-1">Negara</label>
          <select
            value={selectedCountry || ''}
            onChange={(e) => setSelectedCountry(parseInt(e.target.value) || null)}
            className="select select-bordered select-sm w-full"
          >
            <option value="">Pilih Negara</option>
            {countries.map((country) => (
              <option key={country.id_negara} value={country.id_negara}>
                {country.nama_negara}
              </option>
            ))}
          </select>
        </div>

        {/* Genre Filter */}
        <div>
          <label className="block text-xs font-medium mb-1">Genre</label>
          <select
            onChange={handleGenreSelect}
            className="select select-bordered select-sm w-full"
          >
            <option value="">Pilih Genre</option>
            {genres.map((genre) => (
              <option key={genre.id_genre} value={genre.id_genre}>
                {genre.nama_genre}
              </option>
            ))}
          </select>
          {/* Tampilkan genre yang dipilih */}
          <div className="mt-2 flex flex-wrap gap-1">
            {selectedGenres.map((genreId) => {
              const genre = genres.find((g) => g.id_genre === genreId);
              return (
                <div
                  key={genreId}
                  className="badge badge-sm badge-primary gap-1"
                >
                  {genre?.nama_genre}
                  <button
                    type="button"
                    onClick={() => handleRemoveGenre(genreId)}
                    className="text-xs"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tombol Search */}
      <button
        onClick={onSearch}
        className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
      >
        Search
      </button>
    </div>
  );
};

export default Filters;