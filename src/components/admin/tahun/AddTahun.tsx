"use client";

import React, { useState } from "react";
import { FilePlus2, Calendar } from "lucide-react";
import { toast } from "react-toastify";

interface TahunFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddTahunForm({ onSuccess, onCancel }: TahunFormProps) {
  const [newTahun, setNewTahun] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    if (!newTahun || isNaN(newTahun) || newTahun < 1900 || newTahun > 2100) {
      setError("Tahun harus di antara 1900 - 2100.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch("/api/tahun", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tahun_rilis: newTahun }),
      });
  
      if (!response.ok) throw new Error("Gagal menambahkan tahun.");
  
      // Simpan notifikasi ke localStorage sebelum reload halaman
      localStorage.setItem("notif", "Tahun berhasil ditambahkan!");
  
      setNewTahun(new Date().getFullYear());
      onSuccess();
      onCancel();
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
      toast.error("Gagal menambahkan tahun.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md relative">
        <div className="flex flex-col items-center">
          <Calendar className="w-8 h-8 text-gray-700" />
          <h2 className="text-xl font-bold text-black text-center mt-2">Adding Tahun Rilis</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input
            type="number"
            className="input input-bordered w-full text-lg p-3"
            value={newTahun}
            onChange={(e) => setNewTahun(parseInt(e.target.value) || 0)}
            min="1900"
            max="2100"
            required
          />
          {error && <div className="alert alert-error shadow-lg text-sm text-center p-2">{error}</div>}
          <div className="flex justify-center gap-4 mt-4">
            <button type="button" className="px-5 py-2 bg-black text-white rounded-md" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" disabled={loading}>
              <FilePlus2 className="w-5 h-5" />
              {loading ? "Loading..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
