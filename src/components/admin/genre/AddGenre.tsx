"use client";

import React, { useState } from "react";
import { PlusCircle, FilePlus2, X, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

interface AddGenreFormProps {
  onSuccess: (data: any) => void;
  onCancel: () => void;
}

export default function AddGenreForm({ onSuccess, onCancel }: AddGenreFormProps) {
  const [namaGenre, setNamaGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/genre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_genre: namaGenre }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan.");

      toast.success("Genre berhasil ditambahkan!");
      setNamaGenre("");
      onSuccess(data);
      window.location.reload(); // Auto-reload setelah berhasil
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50 backdrop-opacity-75">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md relative">
          <div className="flex flex-col items-center">
            <PlusCircle className="w-8 h-8 text-gray-700" />
            <h2 className="text-xl font-bold text-black text-center mt-2">Adding Genre</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <input
              type="text"
              className="input input-bordered w-full text-lg p-3"
              value={namaGenre}
              onChange={(e) => setNamaGenre(e.target.value)}
              placeholder="Masukkan nama genre"
              required
            />

            {error && (
              <div className="alert alert-error shadow-lg text-sm text-center p-2">
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-center gap-4 mt-4">
              <button
                type="button"
                className="px-5 py-2 bg-black text-white rounded-md flex items-center gap-2"
                onClick={onCancel}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700"
                disabled={loading}
              >
                <FilePlus2 className="w-5 h-5" />
                {loading ? <span className="loading loading-infinity loading-md"></span> : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}