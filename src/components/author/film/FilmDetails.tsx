import React from 'react';
import Image from 'next/image';

interface Film {
  id_film: number;
  title: string;
  description: string;
  min_age: number;
  trailer_url: string;
  cover_image: string;
  genre_names: string[];
  tahun: number;
  nama_negara: string;
  created_at: string;
  bg_image: string;
  tanggal_rilis: string;
  durasi: number;
}

interface FilmDetailsProps {
  film: Film;
  onClose: () => void;
}

const getEmbedUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      const videoId = urlObj.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } else if (urlObj.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${urlObj.pathname}`;
    }
    return url;
  } catch (error) {
    console.error("Invalid URL:", url);
    return url;
  }
};

const FilmDetails: React.FC<FilmDetailsProps> = ({ film, onClose }) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50"
    >
      <div className="bg-white rounded-lg p-4 w-full max-w-5xl max-h-[95vh] overflow-y-auto ">
        <h2 className="text-xl font-bold mb-4">{film.title}</h2>

        <div className="flex gap-6">
          {/* Left Column - Trailer and Background */}
          <div className="w-2/5 space-y-4">
            {/* Trailer */}
            <div>
              <label className="block text-sm font-medium mb-2">Trailer</label>
              <iframe
                src={getEmbedUrl(film.trailer_url)}
                className="w-full h-56 rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Background Image</label>
              <div className="relative h-40 rounded-lg overflow-hidden">
                <img
                  src={film.bg_image}
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="w-3/5">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-base mb-3">Detail Film</h3>
              <div className="space-y-3 text-sm">
                <p><span className="font-semibold">Deskripsi:</span> {film.description}</p>
                <p><span className="font-semibold">Genre:</span> {film.genre_names.join(', ')}</p>
                <p><span className="font-semibold">Tahun:</span> {film.tahun}</p>
                <p><span className="font-semibold">Negara:</span> {film.nama_negara}</p>
                <p><span className="font-semibold">Minimal Usia:</span> {film.min_age}+</p>
                <p><span className="font-semibold">Durasi:</span> {formatDuration(film.durasi)}</p>
                <p><span className="font-semibold">Tanggal Rilis:</span> {new Date(film.tanggal_rilis).toLocaleDateString()}</p>
                <p><span className="font-semibold">Dibuat Pada:</span> {new Date(film.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Tutup */}
        <div className="mt-5 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilmDetails;