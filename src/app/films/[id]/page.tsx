'use client';
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import ImageFilmDetails from "@/components/author/film/ImageFilmDetails";
import FilmTrailerModal from "@/components/dashboard/FilmTrailerModal";
import { FaHeart, FaList, FaPlay } from "react-icons/fa";
import Comments from "@/components/dashboard/Comments";
import FilmRecommendations from "@/components/dashboard/FilmRecommendations";
import OverviewModal from "@/components/dashboard/OverviewModal"; // Import komponen modal

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
  const [showOverviewModal, setShowOverviewModal] = useState(false); // State untuk modal overview
  const [isOverviewLong, setIsOverviewLong] = useState(false); // State untuk cek panjang teks
  const [recommendations, setRecommendations] = useState<Film[]>([]);

  const params = useParams();
  const filmId = params.id;

  useEffect(() => {
    if (!filmId) return;

    const fetchFilm = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/films/${filmId}`);
        const data: Film = await response.json();
        setFilm(data);

        // Cek panjang teks overview
        if (data.description.length > 800) {
          setIsOverviewLong(true);
        }
      } catch (error) {
        console.error("Error fetching film data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/films/all`);
        const data: Film[] = await response.json();
        // Filter out the current film from recommendations
        const filteredRecommendations = data.filter((film) => film.id_film !== Number(filmId));
        setRecommendations(filteredRecommendations.slice(0, 5)); // Limit to 5 recommendations
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchFilm();
    fetchRecommendations();
  }, [filmId]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
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
      {/* Background Image (Hanya di bagian atas) */}
  
        <div className="absolute top-0 left-0 w-full h-[600px] md:h-[700px] overflow-hidden">
          <img
            src={film.bg_image}
            alt="Background"
             // Mengisi seluruh container
            className="object-cover object-top" // Menjaga aspek rasio dan posisi gambar
             // Kualitas gambar maksimal (100%)
             // Prioritas loading gambar
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-[#0b1b34]" />
</div>
      {/* Container Utama */}
      <div className="relative z-10 max-w-6xl w-full p-6 flex flex-col md:flex-row items-start gap-6">
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
            <div className="w-14 h-14 bg-white text-black font-bold text-xl flex items-center justify-center rounded-full">
              {film.rating ? `${film.rating}%` : "N/A"}
            </div>
            <span className="text-lg">User Score</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-6 mb-6">
            <button className="bg-gray-700 p-3 rounded-full flex items-center justify-center">
              <FaHeart className="text-white text-xl" />
            </button>
            <button className="bg-gray-700 p-3 rounded-full flex items-center justify-center">
              <FaList className="text-white text-xl" />
            </button>
            <button onClick={() => setShowTrailer(true)} className="flex items-center text-white space-x-2">
              <FaPlay className="text-xl" />
              <span className="text-lg">Play Trailer</span>
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

      {/* **Comments Section** (Pastikan Background Tetap Putih) */}
      <div className="relative z-10 max-w-6xl w-full p-6 mt-8 bg-white text-black rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <Comments filmId={film.id_film} />
      </div>

      {/* **Recommendations Section** */}
      <div className="relative z-10 max-w-6xl w-full p-6 mt-8 bg-white text-black rounded-lg shadow-lg">
        <FilmRecommendations recommendations={recommendations} />
      </div>

      {/* **Modals** */}
      {showModal && <ImageFilmDetails imageUrl={film.cover_image} title={film.title} onClose={() => setShowModal(false)} />}
      {showTrailer && <FilmTrailerModal trailerUrl={film.trailer_url} onClose={() => setShowTrailer(false)} />}
      {showOverviewModal && <OverviewModal overview={film.description} onClose={() => setShowOverviewModal(false)} />}
    </div>
  );
};

export default FilmDetail;