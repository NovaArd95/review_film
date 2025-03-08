"use client";

import React, { useState } from "react";
import { PlusCircle, FilePlus2, X } from "lucide-react";

interface AddNegaraFormProps {
  onSuccess: () => void;
  onCancel: () => void; // Tambahkan fungsi onCancel untuk menutup modal
}

export default function AddNegaraForm({ onSuccess, onCancel }: AddNegaraFormProps) {
  const [namaNegara, setNamaNegara] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addNegara = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/negara", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nama_negara: namaNegara }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Gagal menambahkan negara.");

      setNamaNegara("");
      onSuccess(); // Notifikasi sukses
      onCancel(); // Tutup modal setelah sukses
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50 backdrop-opacity-75">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md relative">
      

        {/* Header dengan ikon Add */}
        <div className="flex flex-col items-center">
          <PlusCircle className="w-8 h-8 text-gray-700" />
          <h2 className="text-xl font-bold text-black text-center mt-2">Adding Negara</h2>
        </div>

        {/* Input */}
        <form onSubmit={addNegara} className="space-y-4 mt-4">
          <input
            type="text"
            className="input input-bordered w-full text-lg p-3"
            value={namaNegara}
            onChange={(e) => setNamaNegara(e.target.value)}
            placeholder="Masukkan nama negara"
            required
          />

          {/* Error Message */}
          {error && (
            <div className="alert alert-error shadow-lg text-sm text-center p-2">
              <span>{error}</span>
            </div>
          )}

          {/* Tombol Cancel & Save di tengah */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              type="button"
              className="px-5 py-2 bg-black text-white rounded-md flex items-center gap-2"
              onClick={onCancel} // Sekarang bisa tutup modal
            >
              
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700"
              disabled={loading}
            >
              <FilePlus2 className="w-5 h-5" />
              {loading ?<span className="loading loading-infinity loading-md"></span> : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
