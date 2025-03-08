"use client";

import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

interface Negara {
  id_negara: number;
  nama_negara: string;
  created_at: string;
}

export default function NegaraTable() {
  const [negara, setNegara] = useState<Negara[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNegara, setSelectedNegara] = useState<Negara | null>(null); // Simpan data negara yang dipilih

  const fetchNegara = async () => {
    try {
      const response = await fetch("/api/negara");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setNegara(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching negara:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNegara();
  }, []);

  const handleDelete = async () => {
    if (!selectedNegara) return;

    try {
      const response = await fetch(`/api/negara?id=${selectedNegara.id_negara}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchNegara();
        closeModal();
      }
    } catch (error) {
      console.error("Error deleting negara:", error);
    }
  };

  const openModal = (negara: Negara) => {
    setSelectedNegara(negara);
    (document.getElementById("deleteModal") as HTMLDialogElement)?.showModal();
  };

  const closeModal = () => {
    setSelectedNegara(null);
    (document.getElementById("deleteModal") as HTMLDialogElement)?.close();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">ID</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Negara</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {negara.map((item) => (
              <tr key={item.id_negara} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600">{item.id_negara}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.nama_negara}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end space-x-2">
                    <button
                      className="p-2 text-gray-500 hover:text-red-600"
                      onClick={() => openModal(item)}
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

      {/* Modal Konfirmasi */}
      <dialog id="deleteModal" className="modal backdrop-blur-sm backdrop-brightness-50 backdrop-opacity-75">
      <div className="modal-box text-center">
      <Trash2 className="mx-auto text-red-500" size={50} />
          <h3 className="font-bold text-lg mt-2">Are you sure?</h3>
          <p className="text-gray-500 mt-2">
          Do you really want to delete <strong>{selectedNegara?.nama_negara}</strong>?
          </p>
          <div className="flex justify-center gap-4 mt-4">
          <button className="btn bg-black text-white rounded-md hover:bg-gray-800" onClick={closeModal}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={handleDelete}>
            Delete
          </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}


