'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import FilmCardWatchlist from '@/components/dashboard/FilmCardWatchlist';

interface Film {
  id_film: number;
  title: string;
  cover_image: string;
  tahun: number;
  genre_names: string[];
  rating?: number;
}

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState<Film[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession() as { data: { user: { id: string } } | null, status: string };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const fetchWatchlist = async () => {
        try {
          const response = await fetch(`/api/watchlist?user_id=${session.user.id}`, {
            method: 'GET',
            credentials: 'include',
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            if (response.status === 401) {
              setError('Unauthorized: Silakan login kembali.');
            } else if (response.status === 404) {
              setError('Belum ada film di watchlist.');
            } else {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          } else {
            const data = await response.json();
            setWatchlist(data);
          }
        } catch (err) {
          console.error('Error fetching watchlist:', err);
          setError('Terjadi kesalahan saat mengambil data watchlist.');
        } finally {
          setLoading(false);
        }
      };

      fetchWatchlist();
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
      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[45vh]">
          
          <p className="text-white font-semibold">Belum ada film yang ditambahkan ke watchlist.</p>
        </div>
      ) : (
        <FilmCardWatchlist films={watchlist} />
      )}
    </div>
  );
};

export default WatchlistPage;