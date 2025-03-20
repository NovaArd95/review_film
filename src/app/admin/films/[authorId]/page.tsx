'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import FilmCard from '@/components/admin/films/FilmCard';

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
}

const AuthorFilmsPage = () => {
  const params = useParams();
  const authorId = params.authorId;
  const [films, setFilms] = useState<Film[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await fetch(`/api/admin/films?authorId=${authorId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          if (response.status === 404) {
            setError('Belum ada film yang ditambahkan oleh author ini.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          const data = await response.json();
          setFilms(data);
        }
      } catch (err) {
        console.error('Error fetching films:', err);
        setError('Terjadi kesalahan saat mengambil data film.');
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, [authorId]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/films?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        setError('Gagal menghapus film.');
        window.location.reload(); // Auto reload setelah menghapus
      } else {
        setFilms(films.filter((film) => film.id_film !== id));
      }
    } catch (err) {
      console.error('Error deleting film:', err);
      setError('Terjadi kesalahan saat menghapus film.');
    }
  };

  const handleUpdate = (updatedFilm: Film) => {
    setFilms((prevFilms) =>
      prevFilms.map((film) =>
        film.id_film === updatedFilm.id_film ? updatedFilm : film
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-24">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-grow ml-64 p-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Daftar Film</h1>
         {films.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh]">
                  <Image 
                    src="/nomovie.png"
                    alt="Tidak ada film"
                    width={300}
                    height={100}
                    className="mb-4"
                  />
                  <p className="text-gray-600">Belum ada film yang ditambahkan.</p>
                </div>
              ) : (
        <FilmCard
          films={films}
          onDelete={handleDelete}
          onUpdate={handleUpdate} // Teruskan fungsi handleUpdate sebagai prop
        />
      )}
    </div>
    </div>
  );
};

export default AuthorFilmsPage;