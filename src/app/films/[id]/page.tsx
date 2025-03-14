'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import ImageFilmDetails from '@/components/author/film/ImageFilmDetails';
import FilmTrailerModal from '@/components/dashboard/FilmTrailerModal';
import { FaHeart, FaList, FaPlay } from 'react-icons/fa';
import Comments from '@/components/dashboard/Comments';
import FilmRecommendations from '@/components/dashboard/FilmRecommendations';
import OverviewModal from '@/components/dashboard/OverviewModal';
import FooterFilms from '@/components/dashboard/FooterFilms';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RatingModal from '@/components/dashboard/RatingModal';

interface Film {
  id_film: number;
  title: string;
  description: string;
  trailer_url: string;
  cover_image: string;
  bg_image: string;
  genre_names: string[];
  tahun: number;
  nama_negara: string;
  tanggal_rilis: string;
  durasi: number;
  rating?: number;
}

interface ExtendedSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const FilmDetail = () => {
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showOverviewModal, setShowOverviewModal] = useState(false);
  const [isOverviewLong, setIsOverviewLong] = useState(false);
  const [recommendations, setRecommendations] = useState<Film[]>([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isInFavorite, setIsInFavorite] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const getRatingColor = (rating: number | undefined) => {
    if (!rating) return '#ffffff'; // Putih untuk rating 0
    if (rating < 50) return '#ff0000'; // Merah untuk rating rendah
    if (rating < 75) return '#ffff00'; // Kuning untuk rating sedang
    return '#00ff00'; // Hijau untuk rating tinggi
  };



  const params = useParams();
  const filmId = params.id;
  const { data: session, status } = useSession() as { data: ExtendedSession | null, status: string };
  useEffect(() => {
    if (status === 'authenticated' && filmId) {
      fetchUserRating(); // Ambil rating pengguna saat komponen dimuat atau session berubah
    }
  }, [filmId, status, session]);
  const fetchUserRating = async () => {
    try {
      const response = await fetch(`/api/ratings/user?film_id=${filmId}`);
      const data = await response.json();
      setUserRating(data.rating || null); // Set ke null jika tidak ada rating
    } catch (error) {
      console.error('Error fetching user rating:', error);
      setUserRating(null); // Set ke null jika terjadi error
    }
  };

  const fetchAverageRating = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/ratings?film_id=${filmId}`);
      
      // Periksa status respons
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Periksa konten respons
      const data = await response.json();
      const rating = parseFloat(data.average_rating);
      setAverageRating(isNaN(rating) ? 0 : rating);
    } catch (error) {
      console.error('Error fetching average rating:', error);
      setAverageRating(0); // Set default ke 0 jika terjadi error
    }
  };

  useEffect(() => {
    if (!filmId) return;

    const fetchFilm = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/films/${filmId}`);
        const data: Film = await response.json();
        setFilm(data);

        if (data.description.length > 800) {
          setIsOverviewLong(true);
        }
      } catch (error) {
        console.error('Error fetching film data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/films/all`);
        const data: Film[] = await response.json();
        const filteredRecommendations = data.filter((film) => film.id_film !== Number(filmId));
        setRecommendations(filteredRecommendations.slice(0, 10));
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchFilm();
    fetchRecommendations();
    fetchAverageRating();
  }, [filmId]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id && film) {
      const checkUserData = async () => {
        try {
          const watchlistResponse = await fetch(`/api/watchlist?user_id=${session.user.id}`);
          const favoritesResponse = await fetch(`/api/favorites?user_id=${session.user.id}`);

          if (watchlistResponse.ok && favoritesResponse.ok) {
            const watchlistData = await watchlistResponse.json();
            const favoritesData = await favoritesResponse.json();

            setIsInWatchlist(watchlistData.some((item: Film) => item.id_film === film.id_film));
            setIsInFavorite(favoritesData.some((item: Film) => item.id_film === film.id_film));
          }
        } catch (err) {
          console.error('Error checking user data:', err);
        }
      };

      checkUserData();
    }
  }, [status, session, film]);

  const handleAddToWatchlist = async () => {
    try {
      if (isInWatchlist) {
        const response = await fetch('/api/watchlist', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: session?.user?.id, film_id: film?.id_film }),
        });

        if (response.ok) {
          setIsInWatchlist(false);
          toast.success('Film dihapus dari watchlist!');
        } else {
          throw new Error('Gagal menghapus dari watchlist');
        }
      } else {
        const response = await fetch('/api/watchlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: session?.user?.id, film_id: film?.id_film }),
        });

        if (response.ok) {
          setIsInWatchlist(true);
          toast.success('Film ditambahkan ke watchlist!');
        } else {
          throw new Error('Gagal menambahkan ke watchlist');
        }
      }
    } catch (err) {
      toast.error('Terjadi kesalahan');
    }
  };

  const handleAddToFavorite = async () => {
    try {
      if (isInFavorite) {
        const response = await fetch('/api/favorites', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: session?.user?.id, film_id: film?.id_film }),
        });

        if (response.ok) {
          setIsInFavorite(false);
          toast.success('Film dihapus dari favorite!');
        } else {
          throw new Error('Gagal menghapus dari favorite');
        }
      } else {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: session?.user?.id, film_id: film?.id_film }),
        });

        if (response.ok) {
          setIsInFavorite(true);
          toast.success('Film ditambahkan ke favorite!');
        } else {
          throw new Error('Gagal menambahkan ke favorite');
        }
      }
    } catch (err) {
      toast.error('Terjadi kesalahan');
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const handleRatingSubmit = async (rating: number | null) => {
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ film_id: filmId, rating }),
      });
  
      if (response.ok) {
        toast.success(rating === null ? 'Rating dihapus!' : 'Rating berhasil disimpan!');
        await fetchAverageRating(); // Perbarui averageRating
        await fetchUserRating(); // Perbarui userRating
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Gagal menyimpan rating');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    }
  };


  if (loading)
    return (
      <div className="flex items-center justify-center mt-24">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  if (!film) return <p className="text-black">Film not found</p>;


  return (
    <div className="relative bg-white min-h-screen text-white flex flex-col items-center">
      {/* Background Image */}
      <div className="absolute top-0 left-0 w-full h-[500px] md:h-[800px] overflow-hidden" style={{ clipPath: 'inset(0 0 20% 0)' }}>
        <img
          src={film.bg_image}
          alt="Background"
          className="w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black/90 to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black/90 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 to-[#0b1b34]" />
      </div>

      {/* Container Utama */}
      <div className="relative z-10 max-w-6xl w-full p-6 flex flex-col md:flex-row items-start gap-6 mt-8">
        {/* Cover Image */}
        <div className="max-w-[300px] bg-[#152642] rounded-lg shadow-lg self-start md:mr-8">
          <img
            src={film.cover_image}
            alt={film.title}
            className="rounded-lg cursor-pointer transition-transform transform hover:scale-105 duration-300"
            onClick={() => setShowModal(true)}
          />
        </div>

        {/* Film Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">
            {film.title} <span className="text-gray-400">({film.tahun})</span>
          </h1>
          <p className="text-gray-400 text-sm mb-4">
            {new Date(film.tanggal_rilis).toLocaleDateString()} • {film.genre_names.join(", ")} • {formatDuration(film.durasi)}
          </p>
                    <div className="flex items-center space-x-4 mb-6">
  {/* Container untuk lingkaran rating (User Score) */}
  <div
    className="rating-circle"
    style={{
      '--rating-percent': averageRating || 0,
      '--rating-color': getRatingColor(averageRating),
    } as React.CSSProperties}
  >
    <div className="rating-text">
      {typeof averageRating === 'number' ? `${Math.round(averageRating)}%` : "N/A"}
    </div>
  </div>
  <div className="flex flex-col">
    <span className="text-lg font-bold">User Score</span>
</div>

                    {/* Tombol Rating */}
                    {userRating === null ? (
                      <button
                        onClick={() => setShowRatingModal(true)}
                        className="bg-gray-800 text-white px-4 py-2 rounded-xl  bg-opacity-60 hover:bg-gray-700 transition-colors duration-300"
                      >
                        What's your rating?
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowRatingModal(true)}
                        className="bg-gray-800 text-white px-4 py-2 rounded-xl bg-opacity-60 hover:bg-slate-700 transition-colors duration-300"
                      >
                        Your Rating {Math.round(userRating)}%
                      </button>
                    )}
                  </div>
                  

          {/* Action Buttons */}
          <div className="flex space-x-6 mb-6">
            <div className="relative group">
              <button
                onClick={handleAddToFavorite}
                className={`p-3 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isInFavorite ? 'bg-red-600' : 'bg-gray-700 hover:bg-red-600'
                }`}
              >
                <FaHeart className="text-white text-xl" />
              </button>
              <span className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {isInFavorite ? 'Remove Favorites' : 'Favorites'}
              </span>
            </div>

            <div className="relative group">
              <button
                onClick={handleAddToWatchlist}
                className={`p-3 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isInWatchlist ? 'bg-blue-600' : 'bg-gray-700 hover:bg-blue-600'
                }`}
              >
                <FaList className="text-white text-xl" />
              </button>
              <span className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {isInWatchlist ? 'Remove Watchlist' : 'Watchlist'}
              </span>
            </div>

            <button
              onClick={() => setShowTrailer(true)}
              className="flex items-center text-white space-x-2 p-3 transition-colors duration-300"
            >
              <FaPlay className="text-xl hover:text-green-600 transition-colors duration-300" />
              <span className="text-lg hover:text-green-600 transition-colors duration-300">Play Trailer</span>
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-300 mb-6">
            {film.description.length > 800
              ? `${film.description.slice(0, 800)}...`
              : film.description}
            {isOverviewLong && (
              <button
                onClick={() => setShowOverviewModal(true)}
                className="text-blue-400 hover:text-blue-300 ml-2"
              >
                Read More
              </button>
            )}
          </p>
        </div>
      </div>

      {/* Comments and Recommendations Section */}
      <div className="z-10 max-w-6xl w-full p-6 mt-20">
        <div className="">
          <h2 className="text-xl font-semibold mb-4 text-black">Comments</h2>
          <Comments filmId={film.id_film} />
        </div>
        <div className="mt-4 text-black mb-2">
          <FilmRecommendations recommendations={recommendations} />
        </div>
      </div>

      {/* Modals */}
      {showModal && <ImageFilmDetails imageUrl={film.cover_image} title={film.title} onClose={() => setShowModal(false)} />}
      {showTrailer && <FilmTrailerModal trailerUrl={film.trailer_url} onClose={() => setShowTrailer(false)} />}
      {showOverviewModal && <OverviewModal overview={film.description} onClose={() => setShowOverviewModal(false)} />}
      {showRatingModal && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          filmId={film?.id_film || 0}
          userRating={userRating}
          onRatingSubmit={handleRatingSubmit}
        />
      )}
      
      
      {/* Add FooterFilms */}
      <div className="w-full">
        <FooterFilms />
      </div>
    </div>
  );
};

export default FilmDetail;