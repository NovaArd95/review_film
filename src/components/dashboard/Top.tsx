'use client';
import React, { useEffect, useState } from 'react';
import { Star, Plus, Play } from 'lucide-react';
import Link from 'next/link';
// Definisikan tipe data Film
interface Film {
  id_film: number;
  title: string;
  description: string;
  min_age: number;
  trailer_url: string;
  cover_image: string;
  genre_names: string[];
  id_tahun: number;
  id_negara: number;
  created_by: string;
  genres: string[];
  tahun: number;
  nama_negara: string;
  created_at: string;
  durasi: number;
  bg_image: string;
  tanggal_rilis: string;
  rating?: number; // Opsional, karena mungkin tidak ada di API
}

const TopMovies = () => {
  const [movies, setMovies] = useState<Film[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/films/all'); // Endpoint untuk semua film
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Film[] = await response.json();
        setMovies(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('An unknown error occurred'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

 
  return (
    <div id="top-movies" className="bg-black min-h-screen p-6">
      <div className="max-w-7xl mx-auto mt-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-2xl font-bold flex items-center gap-2">
            <span className="w-1 h-8 bg-yellow-500"></span>
            Top 10 Rating FilmReview
          </h1>
        </div>
        
        {/* Grid untuk menampilkan film */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {movies.map((movie, index) => (
            <div key={movie.id_film} className="relative group">
              {/* Tombol tambah ke watchlist */}
              <div className="absolute top-2 left-2 z-10">
                <button className="bg-black/50 hover:bg-black/70 p-1 rounded-full">
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>
              
              {/* Gambar film */}
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={movie.cover_image}
                  alt={movie.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Informasi film di bagian bawah gambar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="flex items-center gap-2 text-white mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{movie.rating || 'N/A'}</span>
                  </div>
                  <p className="text-sm text-white font-bold">{index + 1}. {movie.title}</p>
                </div>
              </div>
              
              {/* Tombol Watchlist dan Trailer */}
              <div className="mt-4 space-y-2">
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-md flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Watchlist
                </button>
                
              
<Link href={`/films/${movie.id_film}`}>
  <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-md flex items-center justify-center gap-2">
    <Play className="w-4 h-4" />
    Trailer
  </button>
</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopMovies;