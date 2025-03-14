import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Star, Plus, Play, ChevronLeft, ChevronRight } from "lucide-react";

interface Film {
  id_film: number;
  title: string;
  cover_image: string;
  tahun: number;
  genre_names: string[];
  rating?: number;
}

interface FilmRecommendationsProps {
  recommendations: Film[];
}

const FilmRecommendations: React.FC<FilmRecommendationsProps> = ({ recommendations }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledLeft, setIsScrolledLeft] = useState(true);
  const [isScrolledRight, setIsScrolledRight] = useState(false);
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});

  // Fungsi untuk mengambil rating dari API
  const fetchRatings = async (filmId: number) => {
    try {
      const response = await fetch(`/api/ratings?film_id=${filmId}`);
      const data = await response.json();
      return data.average_rating || 0;
    } catch (error) {
      console.error("Error fetching rating:", error);
      return 0;
    }
  };

  // Ambil rating untuk semua film saat komponen dimuat
  useEffect(() => {
    const fetchAllRatings = async () => {
      const ratingsData: { [key: number]: number } = {};
      for (const film of recommendations) {
        const rating = await fetchRatings(film.id_film);
        ratingsData[film.id_film] = rating;
      }
      setRatings(ratingsData);
    };

    fetchAllRatings();
  }, [recommendations]);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setIsScrolledLeft(scrollLeft === 0);
      setIsScrolledRight(scrollLeft + clientWidth >= scrollWidth);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", checkScrollPosition);
    }
    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Fungsi untuk menentukan warna rating
  const getRatingColor = (rating: number | undefined) => {
    if (!rating) return '#ffffff'; // Putih untuk rating 0
    if (rating < 50) return '#ff0000'; // Merah untuk rating rendah
    if (rating < 75) return '#ffff00'; // Kuning untuk rating sedang
    return '#00ff00'; // Hijau untuk rating tinggi
  };

  return (
    <div className="mt-8 relative">
      <h2 className="text-xl font-semibold mb-4">Recommendations</h2>

      {/* Tombol navigasi kiri */}
      <button
        onClick={scrollLeft}
        className={`absolute left-0 top-1/2 transform -translate-y-12 bg-black/50 hover:bg-black/70 p-2 rounded-full z-20 ${isScrolledLeft ? 'hidden' : ''}`}
        style={{ marginLeft: "-1.5rem" }} // Sesuaikan margin agar tidak menabrak film
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      {/* Gradient kiri */}
      {!isScrolledLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r to-transparent pointer-events-none"></div>
      )}

      {/* Container untuk scroll horizontal */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scroll-smooth space-x-4 pb-4"
        style={{ scrollbarWidth: "none" }} // Sembunyikan scrollbar
      >
        {recommendations.map((film) => (
          <Link key={film.id_film} href={`/films/${film.id_film}`}>
            <div className="relative group cursor-pointer flex-shrink-0 w-48">
              {/* Gambar film */}
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <img
                  src={film.cover_image}
                  alt={film.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Informasi film di bagian bawah gambar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="flex items-center gap-2 text-white mb-1">
                    {/* Container untuk lingkaran rating kecil */}
                    <div
                      className="rating-circle-sm"
                      style={{
                        '--rating-percent': ratings[film.id_film] || 0,
                        '--rating-color': getRatingColor(ratings[film.id_film]),
                      } as React.CSSProperties}
                    >
                      <div className="rating-text-sm">
                        {ratings[film.id_film] ? `${Math.round(ratings[film.id_film])}%` : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-white font-bold">{film.title}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Gradient kanan */}
      {!isScrolledRight && (
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      )}

      {/* Tombol navigasi kanan */}
      <button
        onClick={scrollRight}
        className={`absolute right-0 top-1/2 transform -translate-y-12 bg-black/50 hover:bg-black/70 p-2 rounded-full z-20 ${isScrolledRight ? 'hidden' : ''}`}
        style={{ marginRight: "-1.5rem" }} // Sesuaikan margin agar tidak menabrak film
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default FilmRecommendations;