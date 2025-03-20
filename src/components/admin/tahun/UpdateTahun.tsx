"use client";

import React, { useState, useEffect, useRef } from "react";
import { Pencil, Save } from "lucide-react";
import { toast } from "react-toastify";

interface UpdateTahunProps {
  id_tahun: number | null;
  tahun: number;
  onSuccess: () => void;
  onClose: () => void;
}

export default function UpdateTahun({ id_tahun, tahun, onSuccess, onClose }: UpdateTahunProps) {
  const [editValue, setEditValue] = useState<number>(tahun);
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (modalRef.current) modalRef.current.showModal();
  }, []);

  const handleEdit = async () => {
    if (id_tahun === null) return;
  
    try {
      const response = await fetch(`/api/tahun?id=${id_tahun}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tahun_rilis: editValue }),
      });
  
      if (response.ok) {
        // Simpan notifikasi ke localStorage sebelum reload halaman
        localStorage.setItem("notif", "Tahun berhasil diperbarui!");
  
        onSuccess();
        onClose();
        window.location.reload();
      } else {
        throw new Error("Gagal memperbarui tahun.");
      }
    } catch (error) {
      toast.error("Gagal memperbarui tahun.");
      console.error("Error updating tahun:", error);
    }
  };
  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box">
        <div className="flex flex-col items-center">
          <Pencil className="w-8 h-8 text-gray-700" />
          <h3 className="font-bold text-lg mt-2">Update Tahun</h3>
        </div>
        <input type="number" value={editValue} onChange={(e) => setEditValue(Number(e.target.value))} className="input input-bordered w-full mt-4" />
        <div className="modal-action flex justify-center gap-3">
          <button className="btn bg-black text-white" onClick={onClose}>Cancel</button>
          <button className="btn bg-blue-600 text-white flex items-center gap-2" onClick={handleEdit}>
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </dialog>
  );
}
