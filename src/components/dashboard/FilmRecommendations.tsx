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
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{film.rating || "N/A"}</span>
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