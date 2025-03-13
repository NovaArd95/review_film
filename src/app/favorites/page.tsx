'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import FilmCardFavorite from '@/components/dashboard/FilmCardFavorite';

interface Film {
  id_film: number;
  title: string;
  cover_image: string;
  tahun: number;
  genre_names: string[];
  rating?: number;
}

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Film[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession() as { data: { user: { id: string } } | null, status: string };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const fetchFavorites = async () => {
        try {
          const response = await fetch(`/api/favorites?user_id=${session.user.id}`, {
            method: 'GET',
            credentials: 'include',
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            if (response.status === 401) {
              setError('Unauthorized: Silakan login kembali.');
            } else if (response.status === 404) {
              setError('Belum ada film di favorites.');
            } else {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          } else {
            const data = await response.json();
            setFavorites(data);
          }
        } catch (err) {
          console.error('Error fetching favorites:', err);
          setError('Terjadi kesalahan saat mengambil data favorites.');
        } finally {
          setLoading(false);
        }
      };

      fetchFavorites();
    } else if (status === 'unauthenticated') {
      setError('Anda harus login untuk mengakses halaman ini.');
      setLoading(false);
    }
  }, [status, session]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center mt-24">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }

  return (
    <div className="p-6 bg-black min-h-screen">
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[45vh]">
         
          <p className="text-white font-semibold">Belum ada film favorit yang ditambahkan.</p>
        </div>
      ) : (
        <FilmCardFavorite films={favorites} />
      )}
    </div>
  );
};

export default FavoritesPage;