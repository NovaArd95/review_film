'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import FilmCard from '@/components/author/film/FilmCard';
import AddFilm from '@/components/author/film/AddFilm';

const AuthorFilmsPage = () => {
  const [films, setFilms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchFilms = async () => {
        try {
          const response = await fetch('/api/films', {
            method: 'GET',
            credentials: 'include',
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            if (response.status === 401) {
              setError('Unauthorized: Silakan login kembali.');
            } else if (response.status === 404) {
              setError('Belum ada film yang ditambahkan.');
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
    } else if (status === 'unauthenticated') {
      setError('Anda tidak memiliki akses ke halaman ini.');
      setLoading(false);
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center mt-24">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }
  

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-6 flex flex-col">
      {/* Bagian kiri: Judul & tombol */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Manajemen Film</h1>
        <AddFilm />
      </div>

      {/* Jika tidak ada film, tampilkan gambar di tengah */}
      {films.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[45vh]">
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
        <FilmCard films={films} />
      )}
    </div>
  );
};

export default AuthorFilmsPage;
