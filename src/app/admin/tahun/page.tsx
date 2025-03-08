
'use client';

import React, { useState } from "react";
import TahunRilisTable from "@/components/admin/tahun/TahunTabel";
import TahunForm from "@/components/admin/tahun/AddTahun";
import { FaPlus } from "react-icons/fa";
export default function TahunPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  
  const openAddForm = () => setShowAddForm(true);
  const closeAddForm = () => setShowAddForm(false);
  
  const handleSuccess = () => {
    closeAddForm();
    setRefreshTable(!refreshTable); // Toggle to trigger table refresh
  };
  
  return (
    <div className="min-h-screen flex">
      <div className="flex-grow ml-64 p-4">
        {/* Header dan tombol tambah */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Manajemen Tahun</h1>
           <button
              onClick={openAddForm}
              className="px-6 py-2w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm md:text-base flex items-center justify-center"
               >
              <FaPlus className="mr-2" />
             Add Tahun
           </button>
        </div>

        {/* Tabel */}
        <div className="w-full">
          <TahunRilisTable key={String(refreshTable)} />
        </div>

        {/* Modal form tambah */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Tambah Tahun Baru</h2>
              <TahunForm onSuccess={handleSuccess} onCancel={closeAddForm} />
              <button
                onClick={closeAddForm}
                className="btn btn-ghost mt-4"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}