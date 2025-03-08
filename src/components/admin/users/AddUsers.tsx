"use client";

import React, { useState } from "react";
import { FilePlus2, X, UserPlus } from "lucide-react";

interface AddUserProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddUser({ onSuccess, onCancel }: AddUserProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    age: "",
    profile_picture: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        profile_picture: e.target.files ? e.target.files[0] : null,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasi sederhana
    if (!formData.username || !formData.email || !formData.password) {
      setError("Semua kolom wajib diisi!");
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Format email tidak valid.");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter.");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("role", formData.role);
      if (formData.age) {
        formDataToSend.append("age", String(formData.age)); // Pastikan dalam bentuk string
      }
      if (formData.profile_picture) {
        formDataToSend.append("profile_picture", formData.profile_picture);
      }

      const response = await fetch("/api/users", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan user");
      }

      onSuccess(); // Refresh data tabel
      onCancel(); // Tutup modal
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md relative">
        {/* Tombol Close */}
        <button className="absolute top-3 right-3 text-gray-500 hover:text-black" onClick={onCancel}>
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center">
          <UserPlus className="w-8 h-8 text-gray-700" />
          <h2 className="text-xl font-bold text-black text-center mt-2">Add New User</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input
            type="text"
            name="username"
            className="input input-bordered w-full p-3"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            className="input input-bordered w-full p-3"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            className="input input-bordered w-full p-3"
            placeholder="Password (min. 6 karakter)"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            className="select select-bordered w-full p-3"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="author">Author</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="number"
            name="age"
            className="input input-bordered w-full p-3"
            placeholder="Age (optional)"
            value={formData.age}
            onChange={handleChange}
          />

          <input
            type="file"
            name="profile_picture"
            className="file-input file-input-bordered w-full p-3"
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* Error Message */}
          {error && (
            <div className="alert alert-error shadow-lg text-sm text-center p-2">
              <span>{error}</span>
            </div>
          )}

          {/* Tombol Cancel & Save */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              type="button"
              className="px-5 py-2 bg-gray-500 text-white rounded-md"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700"
              disabled={loading}
            >
              <FilePlus2 className="w-5 h-5" />
              {loading ? <span className="loading loading-infinity loading-md"></span> : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
