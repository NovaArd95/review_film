"use client";

import React, { useState } from "react";
import AddGenreForm from "@/components/admin/genre/AddGenre";
import GenreTable from "@/components/admin/genre/GenreTable";
import { FaPlus } from 'react-icons/fa';


export default function GenrePage() {
  const [showAddForm, setShowAddForm] = useState(false);

  const openAddForm = () => setShowAddForm(true);
  const closeAddForm = () => setShowAddForm(false);

  return (
    <div className="min-h-screen flex">
      <div className="flex-grow ml-64 p-4">
        {/* Wrapper for title and button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Manajemen Genre</h1>
          <button
          onClick={openAddForm}
          className="px-6 py-2w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm md:text-base flex items-center justify-center"
        >
            <FaPlus className="mr-2" />
          Add Genre
        </button>
        </div>

        {/* Modal form for adding genre */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              
              <AddGenreForm onSuccess={closeAddForm} onCancel={closeAddForm} />
              <div className="flex justify-end mt-4">
                <button 
                  onClick={closeAddForm} 
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="w-full mt-4">
          <GenreTable />
        </div>
      </div>
    </div>
  );
}
