'use client';

import React, { useState } from 'react';
import UserTable from '@/components/admin/users/UserTabel';
import AddUser from '@/components/admin/users/AddUsers';
import { FaPlus } from 'react-icons/fa';

export default function UserPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="min-h-screen flex">
      <div className="flex-grow ml-64 p-4">
        {/* Header & Tombol Tambah */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm md:text-base flex items-center justify-center"
          >
            <FaPlus className="mr-2" />
            Tambah User
          </button>
        </div>

        {/* Tabel */}
        <div className="w-full">
          <UserTable />
        </div>

        {/* Modal Tambah User */}
        {showAddForm && (
          <AddUser 
            onSuccess={() => setShowAddForm(false)} 
            onCancel={() => setShowAddForm(false)} 
          />
        )}
      </div>
    </div>
  );
}
