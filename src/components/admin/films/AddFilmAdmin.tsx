'use client';
import React, { useState, useEffect } from 'react';
import { HiFilm } from 'react-icons/hi';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CustomUser {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
}

interface AddFilmAdminProps {
  onFilmAdded: (newFilm: any) => void;
}

const AddFilmAdmin: React.FC<AddFilmAdminProps> = ({ onFilmAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    min_age: 0,
    trailer_url: '',
    cover_image: '',
    id_tahun: 0,
    id_negara: 0,
    genres: [] as number[],
    bg_image: '',
    tanggal_rilis: '',
    durasi: 0,
  });
  const [selectedGenres, setSelectedGenres] = useState<{ id: number; name: string }[]>([]);
  const [genres, setGenres] = useState<{ id_genre: number; nama_genre: string }[]>([]);
  const [years, setYears] = useState<{ id_tahun: number; tahun_rilis: number }[]>([]);
  const [countries, setCountries] = useState<{ id_negara: number; nama_negara: string }[]>([]);

  const { data: session } = useSession();
  const user = session?.user as CustomUser | undefined;
  const userId = user?.id;
  const role = user?.role;

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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenreSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    if (selectedId && !formData.genres.includes(selectedId)) {
      const selectedGenre = genres.find((genre) => genre.id_genre === selectedId);
      if (selectedGenre) {
        setFormData({ ...formData, genres: [...formData.genres, selectedId] });
        setSelectedGenres([...selectedGenres, { id: selectedGenre.id_genre, name: selectedGenre.nama_genre }]);
      }
    }
  };

  const handleRemoveGenre = (id: number) => {
    setFormData({
      ...formData,
      genres: formData.genres.filter((genreId) => genreId !== id),
    });
    setSelectedGenres(selectedGenres.filter((genre) => genre.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !role) {
      toast.error('Anda harus login untuk menambahkan film.');
      return;
    }

    if (role !== 'admin') {
      toast.error('Anda tidak memiliki izin untuk menambahkan film.');
      return;
    }

    if (formData.genres.length < 2 || formData.genres.length > 5) {
      toast.error('Pilih minimal 2 dan maksimal 5 genre.');
      return;
    }

    try {
      const response = await fetch('/api/admin/films/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          min_age: Number(formData.min_age),
          durasi: Number(formData.durasi),
          id_tahun: Number(formData.id_tahun),
          id_negara: Number(formData.id_negara),
          created_by: userId,
        }),
      });

      if (response.ok) {
        const newFilm = await response.json();
        toast.success('Film berhasil ditambahkan.');
        setIsModalOpen(false);
        onFilmAdded(newFilm); // Panggil prop `onFilmAdded` dengan film baru
        window.location.reload(); // Auto reload setelah menghapus
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Terjadi kesalahan saat menambahkan film.');
      }
    } catch (error) {
      console.error('Error adding film:', error);
      toast.error('Terjadi kesalahan saat menambahkan film.');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center bg-[#e9e9e9] text-black px-4 py-2 rounded-lg hover:bg-[#bdbebd] transition-colors duration-200"
      >
        <HiFilm className="w-5 h-5 mr-2" />
        Tambah Film
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-50 backdrop-opacity-75 flex items-center justify-center p-2 z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-3">Tambah Film Baru</h2>
            <form onSubmit={handleSubmit} className="text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
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
                  <div>
                    <label className="block text-xs font-medium mb-1">Background Image URL</label>
                    <input
                      type="text"
                      name="bg_image"
                      value={formData.bg_image}
                      onChange={handleInputChange}
                      className="input input-bordered input-sm w-full"
                      required
                      placeholder="URL gambar background"
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
                <div className="space-y-3">
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
                      placeholder="Durasi film dalam menit"
                    />
                  </div>
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
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedGenres.map((genre) => (
                    <div
                      key={genre.id}
                      className="badge badge-sm badge-primary gap-1"
                    >
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
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-sm btn-ghost"
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-sm btn-primary">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddFilmAdmin;