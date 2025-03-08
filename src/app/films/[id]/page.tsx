"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ImageFilmDetails from "@/components/author/film/ImageFilmDetails";
import FilmTrailerModal from "@/components/dashboard/FilmTrailerModal";
import { FaHeart, FaList, FaPlay } from "react-icons/fa";

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

const FilmDetail = () => {
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const params = useParams();
  const filmId = params.id;

  useEffect(() => {
    if (!filmId) return;

    const fetchFilm = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/films/${filmId}`);
        const data: Film = await response.json();
        setFilm(data);
      } catch (error) {
        console.error("Error fetching film data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilm();
  }, [filmId]);
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };
  if (loading) return <p className="text-white">Loading...</p>;
  if (!film) return <p className="text-white">Film not found</p>;

  return (
    <div className="relative bg-[#0b1b34] min-h-screen text-white flex justify-start">
      <div className="absolute inset-0 z-0">
        <img src={film.bg_image} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black opacity-90 backdrop-blur-md" />
      </div>

      <div className="relative z-10 max-w-6xl w-full p-6 flex flex-col md:flex-row items-start gap-6">
        <div className="max-w-[300px] bg-[#152642] rounded-lg shadow-lg self-start md:mr-8">
          <img
            src={film.cover_image}
            alt={film.title}
            className="rounded-lg cursor-pointer transition-transform transform hover:scale-105 duration-300"
            onClick={() => setShowModal(true)}
          />
        </div>

        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">
            {film.title} <span className="text-gray-400">({film.tahun})</span>
          </h1>
          <p className="text-gray-400 text-sm mb-4">
            {new Date(film.tanggal_rilis).toLocaleDateString()} • {film.genre_names.join(", ")} • {formatDuration(film.durasi)}
          </p>

          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 bg-white text-black font-bold text-xl flex items-center justify-center rounded-full">
              {film.rating ? `${film.rating}%` : "N/A"}
            </div>
            <span className="text-lg">User Score</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-6 mb-6">
            {/* Favorite Button */}
            <div className="relative flex flex-col items-center">
              <button className="bg-gray-700 p-3 rounded-full flex items-center justify-center">
                <FaHeart className="text-white text-xl" />
              </button>
              <span className="mt-2 text-sm text-gray-400">Favorite</span>
            </div>

            {/* Watchlist Button */}
            <div className="relative flex flex-col items-center">
              <button className="bg-gray-700 p-3 rounded-full flex items-center justify-center">
                <FaList className="text-white text-xl" />
              </button>
              <span className="mt-2 text-sm text-gray-400">Watchlist</span>
            </div>

            {/* Play Trailer Button */}
            <button
              onClick={() => setShowTrailer(true)}
              className="flex items-center text-white space-x-2 mb-6"
            >
              <FaPlay className="text-xl" />
              <span className="text-lg">Play Trailer</span>
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-300 mb-6">{film.description}</p>
        </div>
      </div>

      {showModal && <ImageFilmDetails imageUrl={film.cover_image} title={film.title} onClose={() => setShowModal(false)} />}
      {showTrailer && <FilmTrailerModal trailerUrl={film.trailer_url} onClose={() => setShowTrailer(false)} />}
    </div>
  );
};

export default FilmDetail;
