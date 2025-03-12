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
import FooterFilms from "@/components/dashboard/FooterFilms"; // Import FooterFilms

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
        setRecommendations(filteredRecommendations.slice(0, 10)); // Limit to 5 recommendations
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
<div className="absolute top-0 left-0 w-full h-[500px] md:h-[800px] overflow-hidden" style={{ clipPath: 'inset(0 0 20% 0)' }}>
  <img
    src={film.bg_image}
    alt="Background"
    className="w-full h-full object-cover object-bottom"
  />
  {/* Gradasi di sisi kiri */}
  <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black/90 to-transparent"></div>
  {/* Gradasi di sisi kanan */}
  <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black/90 to-transparent"></div>
  {/* Gradasi di bagian bawah */}
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
            <div className="w-14 h-14 bg-white text-black font-bold text-xl flex items-center justify-center rounded-full">
              {film.rating ? `${film.rating}%` : "N/A"}
            </div>
            <span className="text-lg">User Score</span>
          </div>

         {/* Action Buttons */}
            <div className="flex space-x-6 mb-6">
              <div className="relative group">
                <button className="bg-gray-700 p-3 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <FaHeart className="text-white text-xl" />
                </button>
                <span className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Favorites
                </span>
              </div>
              <div className="relative group">
                <button className="bg-gray-700 p-3 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                  <FaList className="text-white text-xl" />
                </button>
                <span className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   Watchlist
                </span>
              </div>
              <button onClick={() => setShowTrailer(true)} className="flex items-center text-white space-x-2 p-3 transition-colors duration-300">
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

            {/* **Comments and Recommendations Section** */}
        <div className="z-10 max-w-6xl w-full p-6 mt-20">
          {/* Kolom Kiri: Komentar */}
          <div className="">
            <h2 className="text-xl font-semibold mb-4 text-black">Comments</h2>
            <Comments filmId={film.id_film} />
          </div>
          <div className=" mt-4 text-black mb-2">
            <FilmRecommendations recommendations={recommendations} />
          </div>
        </div>

      {/* **Modals** */}
      {showModal && <ImageFilmDetails imageUrl={film.cover_image} title={film.title} onClose={() => setShowModal(false)} />}
      {showTrailer && <FilmTrailerModal trailerUrl={film.trailer_url} onClose={() => setShowTrailer(false)} />}
      {showOverviewModal && <OverviewModal overview={film.description} onClose={() => setShowOverviewModal(false)} />}
      
      {/* Add FooterFilms */}
      <div className="w-full">
        <FooterFilms />
      </div>
    </div>
  );
};

export default FilmDetail;