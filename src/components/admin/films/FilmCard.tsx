import React, { useState } from 'react';
import Image from 'next/image';
import { FaEdit, FaInfoCircle, FaComments } from 'react-icons/fa';
import { BiTrash } from 'react-icons/bi';
import UpdateFilm from './UpdateFilm';
import FilmDetails from './FilmDetails'; // Import komponen FilmDetails
import Comments from './Comments'; // Import komponen Comments

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
    durasi: number; // Add this property
    bg_image: string;
    tanggal_rilis: string;
  }

interface FilmCardProps {
  films: Film[];
  onDelete: (id: number) => void;
  onUpdate: (film: Film) => void; // Add this property
}

const FilmCard: React.FC<FilmCardProps> = ({ films, onDelete, onUpdate }) => {
    const [filmToUpdate, setFilmToUpdate] = useState<Film | null>(null);
    const [selectedFilm, setSelectedFilm] = useState<Film | null>(null); // State untuk film yang dipilih
    const [filmToComment, setFilmToComment] = useState<Film | null>(null);
    // Helper function to format duration
    const formatDuration = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    };
  
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
          {films.map((film) => (
            <div
              key={film.id_film}
              className="max-w-md bg-white rounded-lg shadow-xl flex hover:shadow-lg transition-shadow"
            >
              {/* Cover Image */}
              <Image
                src={film.cover_image}
                alt={film.title}
                className="w-32 h-48 object-cover rounded-lg cursor-pointer"
                width={128}
                height={192}
                priority
                unoptimized={true}
              />
    
              {/* Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-bold line-clamp-1">{film.title}</h2>
                  <p className="text-gray-600 text-sm line-clamp-2">{film.description}</p>
    
                  <div className="text-sm text-gray-500 mt-2">
                    <p><span className="font-semibold">Genre:</span> {film.genre_names.join(', ')}</p>
                    <p><span className="font-semibold">Tahun:</span> {film.tahun}</p>
                    <p><span className="font-semibold">Durasi:</span> {formatDuration(film.durasi)}</p>
                    <p><span className="font-semibold">Negara:</span> {film.nama_negara}</p>
                  </div>
                </div>
    
                {/* Action Icons */}
                <div className="flex items-center justify-end space-x-3 mt-3 text-gray-600">
                  <button
                    onClick={() => setFilmToComment(film)} // Buka modal komentar
                    className="hover:text-purple-500"
                  >
                    <FaComments size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedFilm(film)}
                    className="hover:text-green-500"
                  >
                    <FaInfoCircle size={18} />
                  </button>
                  <button
                    onClick={() => setFilmToUpdate(film)}
                    className="hover:text-blue-500"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(film.id_film)}
                    className="hover:text-red-500"
                  >
                    <BiTrash size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
    
          {/* Modal Update Film */}
          {filmToUpdate && (
            <UpdateFilm
              film={filmToUpdate}
              onClose={() => setFilmToUpdate(null)}
              onUpdate={onUpdate}
            />
          )}
    
          {/* Modal Film Details */}
          {selectedFilm && (
            <FilmDetails
              film={selectedFilm}
              onClose={() => setSelectedFilm(null)}
            />
          )}
    
          {/* Modal Comments */}
          {filmToComment && (
            <Comments
              filmId={filmToComment.id_film}
              onClose={() => setFilmToComment(null)}
            />
          )}
        </div>
      );
    };
    
    export default FilmCard;