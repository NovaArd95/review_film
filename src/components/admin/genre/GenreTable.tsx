"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Edit, Search } from "lucide-react";
import UpdateGenre from "./UpdateGenre";
import { Input } from "@headlessui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Genre {
  id_genre: number;
  nama_genre: string;
  created_at: string;
}
interface GenreTableProps {
  genres: Genre[];
}

export default function GenreTable() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState<Genre | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await fetch("/api/genre");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      const sortedGenres = data.sort((a: Genre, b: Genre) => a.id_genre - b.id_genre);
      setGenres(sortedGenres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!genreToDelete) return;
  
    try {
      const response = await fetch(`/api/genre?id=${genreToDelete.id_genre}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        toast.success("Genre berhasil dihapus!"); // Tampilkan notifikasi sukses
        window.location.reload(); // Auto-reload setelah berhasil
      } else {
        const result = await response.json();
        toast.error(result.error || "Terjadi kesalahan saat menghapus genre."); // Tampilkan notifikasi error
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus genre."); // Tampilkan notifikasi error
    } finally {
      closeDeleteModal(); // Tutup modal setelah selesai
    }
  };
  
  const handleEdit = (genre: Genre) => {
    setSelectedGenre(genre);
  };

  const openDeleteModal = (genre: Genre) => {
    setGenreToDelete(genre);
    setDeleteModalOpen(true);
    document.body.classList.add("overflow-hidden");
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setGenreToDelete(null);
    document.body.classList.remove("overflow-hidden");
  };

  const filteredGenres = genres.filter((genre) =>
    genre.nama_genre.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGenres = filteredGenres.slice(indexOfFirstItem, indexOfLastItem);
  return (
<div className="bg-white rounded-lg shadow p-4 flex flex-col min-h-[400px]">
        <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search genre..."
            className="pl-8 pr-4 py-2 border rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      ) : (
        <>
        
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Genre</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentGenres.map((genre) => (
                  <tr key={genre.id_genre} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{genre.id_genre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{genre.nama_genre}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="p-2 text-gray-500 hover:text-blue-600"
                          onClick={() => handleEdit(genre)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-2 text-gray-500 hover:text-red-600"
                          onClick={() => openDeleteModal(genre)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

    {/* Pagination selalu tetap di bawah */}
    <div className="flex justify-center pt-4 mt-auto">
        {filteredGenres.length > itemsPerPage && (
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              «
            </button>
            <button className="join-item btn">Page {currentPage}</button>
            <button
              className="join-item btn"
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < Math.ceil(filteredGenres.length / itemsPerPage) ? prev + 1 : prev
                )
              }
              disabled={currentPage >= Math.ceil(filteredGenres.length / itemsPerPage)}
            >
              »
            </button>
          </div>
        )}
      </div>
          </>
        )}
    

      {selectedGenre && (
        <UpdateGenre
          id_genre={selectedGenre.id_genre}
          nama_genre={selectedGenre.nama_genre}
          onSuccess={() => fetchGenres()}
          onClose={() => setSelectedGenre(null)}
        />
      )}

      {/* Modal Konfirmasi Hapus (Fix agar tidak naik) */}
      {isDeleteModalOpen && genreToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center w-[350px]">
            <Trash2 className="mx-auto text-red-500" size={50} />
            <h3 className="font-bold text-lg mt-2">Are you sure?</h3>
            <p className="text-gray-500 mt-2">
              Do you really want to delete <strong>{genreToDelete.nama_genre}</strong>?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="btn bg-gray-600 text-white rounded-md hover:bg-gray-800"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
     {showNotification && (
  <div 
    role="alert" 
    className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-500 ease-in-out animate-slide-down"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span>Data berhasil dihapus!</span>
  </div>
)}

    </div>
  );
}

