"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Edit, Eye } from "lucide-react";
import ImageDetails from "./ImageDetails"; // Import ImageDetails

interface UserTableProps {
  onSuccess?: () => void;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  profile_picture: string; // Corrected column name
}

export default function UserTable({ onSuccess }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (selectedId === null) return;

    try {
      const response = await fetch(`/api/users?id=${selectedId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchUsers();
        closeDeleteModal();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    (document.getElementById("deleteModal") as HTMLDialogElement)?.showModal();
  };

  const closeDeleteModal = () => {
    setSelectedId(null);
    (document.getElementById("deleteModal") as HTMLDialogElement)?.close();
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setTimeout(() => {
      const modal = document.getElementById("imageModal") as HTMLDialogElement;
      if (modal && !modal.open) modal.showModal();
    }, 100);
  };
  const closeImageModal = () => {
    setSelectedImage(null);
    const modal = document.getElementById("imageModal") as HTMLDialogElement;
    if (modal) modal.close();
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
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Username</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Role</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Profile</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600">{user.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.username}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                <td className="px-6 py-4 text-sm text-gray-600 text-center">
                  <button onClick={() => openImageModal(user.profile_picture)} className="text-gray-500 hover:text-blue-600">
                    <Eye size={18} />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end space-x-2">
                    <button className="p-2 text-gray-500 hover:text-blue-600">
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-red-600"
                      onClick={() => openDeleteModal(user.id)}
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
          <p className="py-4 text-gray-700">
            Do you really want to delete user <span className="font-semibold">{selectedId && users.find(u => u.id === selectedId)?.username}</span>?
          </p>
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

      {/* Modal View Profile Picture menggunakan ImageDetails */}
      {selectedImage && <ImageDetails imageUrl={selectedImage} onClose={closeImageModal} title={""} />}
    </div>
  );
}
