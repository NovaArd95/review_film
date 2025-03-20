"use client";

import React, { useState, useEffect, useRef } from "react";
import { Pencil, Save } from "lucide-react";
import { toast } from "react-toastify";

interface UpdateGenreProps {
  id_genre: number | null;
  nama_genre: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function UpdateGenre({ id_genre, nama_genre, onSuccess, onClose }: UpdateGenreProps) {
  const [editValue, setEditValue] = useState<string>(nama_genre);
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }, []);

  const handleEdit = async () => {
    if (id_genre === null) return;

    try {
      const response = await fetch(`/api/genre`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_genre, nama_genre: editValue }),
      });

      if (response.ok) {
        toast.success("Genre berhasil diperbarui!");
        onSuccess();
        window.location.reload(); // Auto-reload setelah berhasil
      } else {
        const result = await response.json();
        toast.error(result.error || "Terjadi kesalahan saat memperbarui genre.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui genre.");
    }
  };

  return (
    <dialog ref={modalRef} className="modal backdrop-blur-sm backdrop-brightness-50 backdrop-opacity-75">
      <div className="modal-box">
        <div className="flex flex-col items-center">
          <Pencil className="w-8 h-8 text-gray-700" />
          <h3 className="font-bold text-lg mt-2">Update Genre</h3>
        </div>

        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="input input-bordered w-full mt-4"
        />

        <div className="modal-action flex justify-center gap-3">
          <button className="btn bg-black text-white hover:bg-gray-800" onClick={onClose}>
            Cancel
          </button>
          <button className="btn bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2" onClick={handleEdit}>
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </dialog>
  );
}