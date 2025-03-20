'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import PageAuthor from '@/components/admin/films/PageAuthor';
import FilmCardAdmin from '@/components/admin/films/FilmCardAdmin';
import AddFilmAdmin from '@/components/admin/films/AddFilmAdmin';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Author {
  id: number;
  username: string;
  email: string;
  profile_picture: string;
  created_at: string; // Tambahkan created_at

}

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

const AdminFilmsPage = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [films, setFilms] = useState<Film[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchData = async () => {
        try {
          const [authorsResponse, filmsResponse] = await Promise.all([
            fetch('/api/admin/authors', {
              method: 'GET',
              credentials: 'include',
            }),
            fetch('/api/admin/films/admin', {
              method: 'GET',
              credentials: 'include',
            }),
          ]);

          if (!authorsResponse.ok || !filmsResponse.ok) {
            const errorData = await authorsResponse.json();
            console.error('Error response:', errorData);
            if (authorsResponse.status === 401 || filmsResponse.status === 401) {
              setError('Unauthorized: Silakan login kembali.');
            } else if (authorsResponse.status === 404 || filmsResponse.status === 404) {
              setError('Belum ada data yang terdaftar.');
            } else {
              throw new Error(`HTTP error! status: ${authorsResponse.status}`);
            }
          } else {
            const authorsData = await authorsResponse.json();
            const filmsData = await filmsResponse.json();
            setAuthors(authorsData);
            setFilms(filmsData);
          }
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Terjadi kesalahan saat mengambil data.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else if (status === 'unauthenticated') {
      setError('Anda tidak memiliki akses ke halaman ini.');
      setLoading(false);
    }
  }, [status]);

  const handleDeleteFilm = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/films/admin?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
  
      if (response.ok) {
        toast.success('Film berhasil dihapus.');
        setFilms(films.filter((film) => film.id_film !== id));
        window.location.reload(); // Auto reload setelah menghapus
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Terjadi kesalahan saat menghapus film.');
      }
    } catch (error) {
      console.error('Error deleting film:', error);
      toast.error('Terjadi kesalahan saat menghapus film.');
    }
  };

  const handleUpdateFilm = async (updatedFilm: Film) => {
    setFilms(films.map((film) => (film.id_film === updatedFilm.id_film ? updatedFilm : film)));
  };

  if (status === 'loading' || loading) {
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
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Manajemen Admin Films</h1>
        
        {/* Tambahkan AddFilmAdmin di bagian atas */}
        <AddFilmAdmin onFilmAdded={(newFilm) => setFilms([...films, newFilm])} />

        {/* Tambahkan FilmCardAdmin di bawah AddFilmAdmin */}
        <FilmCardAdmin
          films={films}
          onDelete={handleDeleteFilm}
          onUpdate={handleUpdateFilm}
        />

        {/* Tambahkan PageAuthor di bawah FilmCardAdmin */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 mt-8">Manajemen Author Films</h1>
        <PageAuthor authors={authors} />
      </div>
    </div>
  );
};

export default AdminFilmsPage;