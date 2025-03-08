"use client";

import React, { useEffect, useState } from 'react';
import { Trash2, Edit } from 'lucide-react';
import UpdateTahun from './UpdateTahun';
interface TahunTableProps {
    onSuccess?: () => void;
  }
  
  
interface TahunRilis {
  id_tahun: number;
  tahun: number; // Changed from tahun_rilis to tahun
  created_at: string;
}

export default function TahunRilisTable({ onSuccess }: TahunTableProps) {
  
  const [newTahun, setNewTahun] = useState<number>(new Date().getFullYear());
  const [tahunRilis, setTahunRilis] = useState<TahunRilis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [editValue, setEditValue] = useState<number>(0);
  const fetchTahunRilis = async () => {
    try {
      const response = await fetch('/api/tahun');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setTahunRilis(data.map((item: any) => ({ ...item, tahun: item.tahun_rilis }))); // Map tahun_rilis to tahun
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tahun rilis:', error);
      setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/tahun', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tahun: newTahun }), // Changed from tahun_rilis to tahun
      });

      if (response.ok) {
        if (onSuccess) {
          onSuccess(); // Memanggil callback onSuccess jika ada
        }
        fetchTahunRilis(); // Refresh data
        setNewTahun(new Date().getFullYear()); // Reset form
      }
    } catch (error) {
      console.error('Error adding tahun rilis:', error);
    }
  };

  
  useEffect(() => {
    fetchTahunRilis();
  }, []);

  const handleDelete = async () => {
    if (selectedId === null) return;

    try {
      const response = await fetch(`/api/tahun?id=${selectedId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTahunRilis();
        closeDeleteModal();
      }
    } catch (error) {
      console.error('Error deleting tahun rilis:', error);
    }
  };

  const handleEdit = async () => {
    if (selectedId === null) return;

    try {
      const response = await fetch(`/api/tahun?id=${selectedId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tahun: editValue }), // Changed from tahun_rilis to tahun
      });

      if (response.ok) {
        fetchTahunRilis();
        closeEditModal();
      }
    } catch (error) {
      console.error('Error updating tahun :', error);
    }
  };

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    (document.getElementById('deleteModal') as HTMLDialogElement)?.showModal();
  };

  const closeDeleteModal = () => {
    setSelectedId(null);
    (document.getElementById('deleteModal') as HTMLDialogElement)?.close();
  };

  const openEditModal = (id: number, year: number) => {
    setSelectedId(id);
    setSelectedYear(year);
    setIsEditing(true);
    (document.getElementById("editModal") as HTMLDialogElement)?.showModal();
  };

  const closeEditModal = () => {
    setSelectedId(null);
    setSelectedYear(0);
    setIsEditing(false);
    (document.getElementById("editModal") as HTMLDialogElement)?.close();
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
    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Tahun</th>
    <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Actions</th>
  </tr>
</thead>
<tbody>
  {tahunRilis.map((item) => (
    <tr key={item.id_tahun} className="border-b hover:bg-gray-50">
      <td className="px-6 py-4 text-sm text-gray-600">{item.id_tahun}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{item.tahun}</td>
      <td className="px-6 py-4">
        <div className="flex justify-end space-x-2">
          <button
            className="p-2 text-gray-500 hover:text-blue-600"
            onClick={() => openEditModal(item.id_tahun, item.tahun)}
          >
            <Edit size={18} />
          </button>
          <button
            className="p-2 text-gray-500 hover:text-red-600"
            onClick={() => openDeleteModal(item.id_tahun)}
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

           {/* Modal Konfirmasi Delete */}
           <dialog id="deleteModal" className="modal backdrop-blur-sm backdrop-brightness-50 backdrop-opacity-75">
        <form method="dialog" className="modal-box flex flex-col items-center text-center">
          <Trash2 size={48} className="text-red-500 mb-2" />
          <h3 className="font-bold text-lg mt-2">Are you sure?</h3>
          <p className="py-4 text-gray-700"> Do you really want to delete <span className="font-semibold">{selectedId && tahunRilis.find(t => t.id_tahun === selectedId)?.tahun}</span>?</p>
          <div className="flex justify-center gap-4 mt-4">
          <button className="btn bg-black text-white rounded-md hover:bg-gray-800" onClick={closeDeleteModal}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={handleDelete}>
            Delete
          </button>
          </div>
        </form>
      </dialog>

       {/* Modal Update */}
       {isEditing && (
        <UpdateTahun
          id_tahun={selectedId}
          tahun={selectedYear}
          onSuccess={fetchTahunRilis}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
}
