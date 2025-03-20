'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS untuk toast

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
  bg_image: string;
  tanggal_rilis: string;
  durasi: number;
}

interface UpdateFilmProps {
  film: Film;
  onClose: () => void;
  onUpdate: (updatedFilm: Film) => void;
}

interface CustomUser {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
}

const UpdateFilm: React.FC<UpdateFilmProps> = ({ film, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<Film>(film);
  const [selectedGenres, setSelectedGenres] = useState<{ id: number; name: string }[]>([]);
  const [genres, setGenres] = useState<{ id_genre: number; nama_genre: string }[]>([]);
  const [years, setYears] = useState<{ id_tahun: number; tahun_rilis: number }[]>([]);
  const [countries, setCountries] = useState<{ id_negara: number; nama_negara: string }[]>([]);

  const { data: session } = useSession();
  const user = session?.user as CustomUser | undefined;
  const userId = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresRes, yearsRes, countriesRes] = await Promise.all([
          fetch('/api/genre').then((res) => res.json()),
          fetch('/api/tahun').then((res) => res.json()),
          fetch('/api/negara').then((res) => res.json()),
        ]);

        setGenres(genresRes);
        setYears(yearsRes);
        setCountries(countriesRes);

        const filmGenres = Array.isArray(film.genres) ? film.genres.map(Number) : [];

        const selected = genresRes
          .filter((genre: { id_genre: number }) => filmGenres.includes(genre.id_genre))
          .map((genre: { id_genre: number; nama_genre: string }) => ({
            id: genre.id_genre,
            name: genre.nama_genre,
          }));
        setSelectedGenres(selected);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [film.genres]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenreSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const genresArray = Array.isArray(formData.genres) ? formData.genres : [];
    if (selectedId && !genresArray.includes(String(selectedId))) {
      const selectedGenre = genres.find((genre) => genre.id_genre === selectedId);
      if (selectedGenre) {
        setFormData({ ...formData, genres: [...genresArray, String(selectedId)] });
        setSelectedGenres([...selectedGenres, { id: selectedGenre.id_genre, name: selectedGenre.nama_genre }]);
      }
    }
  };

  const handleRemoveGenre = (id: number) => {
    setFormData({
      ...formData,
      genres: formData.genres.filter((genreId) => Number(genreId) !== id),
    });
    setSelectedGenres(selectedGenres.filter((genre) => genre.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error('Anda harus login untuk memperbarui film.'); // Tampilkan toast error
      return;
    }

    const genresArray = Array.isArray(formData.genres) ? formData.genres : [];

    if (genresArray.length < 2 || genresArray.length > 5) {
      toast.error('Pilih minimal 2 dan maksimal 5 genre.'); // Tampilkan toast error
      return;
    }

    try {
      const response = await fetch(`/api/admin/films/admin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...formData, genres: genresArray, updated_by: userId }),
      });

      if (response.ok) {
        toast.success('Film berhasil diperbarui.'); // Tampilkan toast success
        onUpdate(formData);
        onClose();
        window.location.reload(); // Refresh halaman setelah berhasil
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Terjadi kesalahan saat memperbarui film.'); // Tampilkan toast error
      }
    } catch (error) {
      console.error('Error updating film:', error);
      toast.error('Terjadi kesalahan saat memperbarui film.'); // Tampilkan toast error
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-3">Update Film</h2>
        <form onSubmit={handleSubmit} className="text-sm">
          <div className="grid grid-cols-2 gap-4">
            {/* Kolom Kiri */}
            <div className="space-y-3">
              {/* Title */}
              <div>
                <label className="block text-xs font-medium mb-1">Judul</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input input-bordered input-sm w-full"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered textarea-sm w-full h-20"
                  required
                />
              </div>

              {/* Min Age */}
              <div>
                <label className="block text-xs font-medium mb-1">Minimal Usia</label>
                <input
                  type="number"
                  name="min_age"
                  value={formData.min_age}
                  onChange={handleInputChange}
                  className="input input-bordered input-sm w-full"
                  required
                />
              </div>

              {/* New fields */}
              <div>
                <label className="block text-xs font-medium mb-1">Background Image URL</label>
                <input
                  type="text"
                  name="bg_image"
                  value={formData.bg_image}
                  onChange={handleInputChange}
                  className="input input-bordered input-sm w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Tanggal Rilis</label>
                <input
                  type="date"
                  name="tanggal_rilis"
                  value={formData.tanggal_rilis}
                  onChange={handleInputChange}
                  className="input input-bordered input-sm w-full"
                  required
                />
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-3">
              {/* Trailer URL */}
              <div>
                <label className="block text-xs font-medium mb-1">Trailer URL</label>
                <input
                  type="text"
                  name="trailer_url"
                  value={formData.trailer_url}
                  onChange={handleInputChange}
                  className="input input-bordered input-sm w-full"
                  required
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-medium mb-1">Cover Image URL</label>
                <input
                  type="text"
                  name="cover_image"
                  value={formData.cover_image}
                  onChange={handleInputChange}
                  className="input input-bordered input-sm w-full"
                  required
                />
              </div>

              {/* Durasi */}
              <div>
                <label className="block text-xs font-medium mb-1">Durasi (menit)</label>
                <input
                  type="number"
                  name="durasi"
                  value={formData.durasi}
                  onChange={handleInputChange}
                  className="input input-bordered input-sm w-full"
                  required
                  min="1"
                />
              </div>

              {/* Year Selection */}
              <div>
                <label className="block text-xs font-medium mb-1">Tahun</label>
                <select
                  name="id_tahun"
                  value={formData.id_tahun}
                  onChange={handleInputChange}
                  className="select select-bordered select-sm w-full"
                  required
                >
                  <option value="">Pilih Tahun</option>
                  {years.map((year) => (
                    <option key={year.id_tahun} value={year.id_tahun}>
                      {year.tahun_rilis}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Selection */}
              <div>
                <label className="block text-xs font-medium mb-1">Negara</label>
                <select
                  name="id_negara"
                  value={formData.id_negara}
                  onChange={handleInputChange}
                  className="select select-bordered select-sm w-full"
                  required
                >
                  <option value="">Pilih Negara</option>
                  {countries.map((country) => (
                    <option key={country.id_negara} value={country.id_negara}>
                      {country.nama_negara}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Genre Selection */}
          <div className="mt-3">
            <label className="block text-xs font-medium mb-1">Genre</label>
            <select
              name="genres"
              onChange={handleGenreSelect}
              className="select select-bordered select-sm w-full"
            >
              <option value="">Pilih Genre</option>
              {genres.map((genre) => (
                <option key={genre.id_genre} value={genre.id_genre}>
                  {genre.nama_genre}
                </option>
              ))}
            </select>
            
            {/* Selected Genres */}
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedGenres.map((genre) => (
                <div key={genre.id} className="badge badge-sm badge-primary gap-1">
                  {genre.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveGenre(genre.id)}
                    className="text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-ghost"
            >
              Batal
            </button>
            <button type="submit" className="btn btn-sm btn-primary">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateFilm;