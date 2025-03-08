import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaInfoCircle, FaEdit, FaTrash } from 'react-icons/fa';
import FilmDetails from './FilmDetails';
import ImageFilmDetails from './ImageFilmDetails';
import UpdateFilm from './UpdateFilm';

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
}

const FilmCard: React.FC<FilmCardProps> = ({ films }) => {
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filmToUpdate, setFilmToUpdate] = useState<Film | null>(null);

  const handleDelete = async (id_film: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus film ini?')) {
      try {
        const response = await fetch(`/api/films?id=${id_film}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          window.location.reload();
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error('Error deleting film:', error);
        alert('Terjadi kesalahan saat menghapus film.');
      }
    }
  };

  const handleUpdate = (updatedFilm: Film) => {
    // Update data film di state atau refresh halaman
    window.location.reload();
  };

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
            onClick={() => setSelectedImage(film.cover_image)}
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
              <button onClick={() => setSelectedFilm(film)} className="hover:text-green-500">
                <FaInfoCircle size={18} />
              </button>
              <button onClick={() => setFilmToUpdate(film)} className="hover:text-blue-500">
                <FaEdit size={18} />
              </button>
              <button onClick={() => handleDelete(film.id_film)} className="hover:text-red-500">
                <FaTrash size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Modal Detail Film */}
      {selectedFilm && <FilmDetails film={selectedFilm} onClose={() => setSelectedFilm(null)} />}

      {/* Modal Update Film */}
      {filmToUpdate && (
        <UpdateFilm
          film={filmToUpdate}
          onClose={() => setFilmToUpdate(null)}
          onUpdate={handleUpdate}
        />
      )}

      {/* Modal Image */}
      {selectedImage && <ImageFilmDetails imageUrl={selectedImage} onClose={() => setSelectedImage(null)} title={''} />}
    </div>
  );
};

export default FilmCard;