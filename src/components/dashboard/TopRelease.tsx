'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Play, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

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

interface ExtendedSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const TopRelease = () => {
  const [movies, setMovies] = useState<Film[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const { data: session, status } = useSession() as { data: ExtendedSession | null, status: string };

  const getRatingColor = (rating: number | undefined) => {
    if (!rating) return '#ffffff'; // Putih untuk rating 0
    if (rating < 50) return '#ff0000'; // Merah untuk rating rendah
    if (rating < 75) return '#ffff00'; // Kuning untuk rating sedang
    return '#00ff00'; // Hijau untuk rating tinggi
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Ambil data film
        const response = await fetch('/api/films/all');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Film[] = await response.json();

        // Ambil rating untuk setiap film
        const moviesWithRatings = await Promise.all(
          data.map(async (movie) => {
            const ratingResponse = await fetch(`/api/ratings?film_id=${movie.id_film}`);
            if (!ratingResponse.ok) {
              throw new Error('Failed to fetch rating');
            }
            const ratingData = await ratingResponse.json();
            return {
              ...movie,
              rating: ratingData.average_rating || 0, // Default ke 0 jika tidak ada rating
            };
          })
        );

        setMovies(moviesWithRatings);
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

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      // Fetch watchlist dan favorites user
      const fetchUserData = async () => {
        try {
          const watchlistResponse = await fetch(`/api/watchlist?user_id=${session.user.id}`);
          const favoritesResponse = await fetch(`/api/favorites?user_id=${session.user.id}`);

          if (watchlistResponse.ok && favoritesResponse.ok) {
            const watchlistData = await watchlistResponse.json();
            const favoritesData = await favoritesResponse.json();

            setWatchlist(watchlistData.map((film: Film) => film.id_film));
            setFavorites(favoritesData.map((film: Film) => film.id_film));
          }
        } catch (err) {
          console.error('Gagal mengambil data user:', err);
        }
      };

      fetchUserData();
    }
  }, [status, session]);

  const handleAddToWatchlist = async (filmId: number) => {
    try {
      if (watchlist.includes(filmId)) {
        // Jika film sudah ada di watchlist, hapus film tersebut
        const response = await fetch('/api/watchlist', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: session?.user?.id, film_id: filmId }),
        });

        if (response.ok) {
          setWatchlist((prev) => prev.filter((id) => id !== filmId));
          toast.success('Film dihapus dari watchlist!');
        } else {
          throw new Error('Gagal menghapus dari watchlist');
        }
      } else {
        // Jika film belum ada di watchlist, tambahkan film tersebut
        const response = await fetch('/api/watchlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: session?.user?.id, film_id: filmId }),
        });

        if (response.ok) {
          setWatchlist((prev) => [...prev, filmId]);
          toast.success('Film ditambahkan ke watchlist!');
        } else {
          throw new Error('Gagal menambahkan ke watchlist');
        }
      }
    } catch (err) {
      toast.error('Terjadi kesalahan');
    }
  };

  const handleAddToFavorite = async (filmId: number) => {
    try {
      if (favorites.includes(filmId)) {
        // Jika film sudah ada di favorite, hapus film tersebut
        const response = await fetch('/api/favorites', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: session?.user?.id, film_id: filmId }),
        });

        if (response.ok) {
          setFavorites((prev) => prev.filter((id) => id !== filmId));
          toast.success('Film dihapus dari favorite!');
        } else {
          throw new Error('Gagal menghapus dari favorite');
        }
      } else {
        // Jika film belum ada di favorite, tambahkan film tersebut
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: session?.user?.id, film_id: filmId }),
        });

        if (response.ok) {
          setFavorites((prev) => [...prev, filmId]);
          toast.success('Film ditambahkan ke favorite!');
        } else {
          throw new Error('Gagal menambahkan ke favorite');
        }
      }
    } catch (err) {
      toast.error('Terjadi kesalahan');
    }
  };

  if (error) {
    return <p>{error.message}</p>;
  }

  // Ambil 7 film terbaru berdasarkan created_at
  const newMovies = movies
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 7);

  return (
    <div id="top-release" className="bg-black p-6"> {/* Added ID for smooth scrolling */}
      <div className="max-w-7xl mx-auto">
      <h1 className="text-white text-2xl font-bold flex items-center gap-2 mb-12 mt-12">
            <span className="w-1 h-8 bg-yellow-500"></span>
            New Release Movies
          </h1>
        <div className="relative" id="top-release-swiper"> {/* Unique ID for Swiper container */}
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={5} // Tampilkan 5 card per slide
            navigation={{
              nextEl: '#top-release-next', // Scoped navigation button
              prevEl: '#top-release-prev', // Scoped navigation button
            }}
            pagination={{
              clickable: true,
              type: 'bullets',
              el: '.top-release-pagination', // Custom pagination element
              bulletClass: 'swiper-pagination-bullet', // Default bullet class
              bulletActiveClass: 'swiper-pagination-bullet-active', // Active bullet class
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 40,
              },
            }}
          >
            {newMovies.map((movie) => (
              <SwiperSlide key={movie.id_film}>
                <div className="relative group">
                  {/* Tombol tambah ke watchlist dan favorite */}
                  <div className="absolute top-2 left-2 z-10 flex gap-2">
                    <button
                      onClick={() => handleAddToWatchlist(movie.id_film)}
                      className="bg-black/50 hover:bg-black/70 p-1 rounded-full"
                    >
                      <Plus
                        className={`w-5 h-5 ${
                          watchlist.includes(movie.id_film) ? 'text-green-500' : 'text-white'
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => handleAddToFavorite(movie.id_film)}
                      className="bg-black/50 hover:bg-black/70 p-1 rounded-full"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(movie.id_film) ? 'text-red-500 fill-red-500' : 'text-white'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Gambar film */}
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={movie.cover_image}
                      alt={movie.title}
                      className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Rating dan judul film */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <div className="flex items-center gap-2 text-white mb-1">
                        <div
                          className="rating-circle-sm"
                          style={{
                            '--rating-percent': movie.rating || 0,
                            '--rating-color': getRatingColor(movie.rating),
                          } as React.CSSProperties}
                        >
                          <div className="rating-text-sm">
                            {movie.rating ? `${Math.round(movie.rating)}%` : 'N/A'}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-white font-bold">{movie.title}</p>
                    </div>
                  </div>

                  {/* Tombol Trailer */}
                  <div className="mt-4 space-y-2">
                    <Link href={`/films/${movie.id_film}`}>
                      <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-md flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        Trailer
                      </button>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div id="top-release-next" className="!text-white !p-3 !absolute !top-1/2 !right-[-70px] !z-10 !transform !-translate-y-1/2 flex items-center justify-center hover:!text-blue-500">
            <ChevronRight className="w-20 h-20" />
          </div>
          <div id="top-release-prev" className="!text-white !p-3 !absolute !top-1/2 !left-[-70px] !z-10 !transform !-translate-y-1/2 flex items-center justify-center hover:!text-blue-500">
            <ChevronLeft className="w-20 h-20" />
          </div>

          {/* Custom Pagination */}
          <div className="top-release-pagination !mt-6 flex justify-center"></div>
        </div>
      </div>
    </div>
  );

  // Add global styles for pagination bullets
  <style global jsx>{`
    .swiper-pagination-bullet {
      background-color: white; /* Inactive dots are white */
      opacity: 0.6;
    }
    .swiper-pagination-bullet-active {
      background-color: blue; /* Active dot is blue */
      opacity: 1;
    }
  `}</style>
};

export default TopRelease;