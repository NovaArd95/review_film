'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';

interface User {
  id: string;
  username: string;
  profile_picture: string;
  email: string;
}

interface SettingsUserProps {
  user: User;
  onClose: () => void;
}

const SettingsUser = ({ user, onClose }: SettingsUserProps) => {
  const [username, setUsername] = useState(user.username);
  const [profilePicture, setProfilePicture] = useState(user.profile_picture);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, update } = useSession();

  // Add new state for author request
  const [isRequestingAuthor, setIsRequestingAuthor] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('id', user.id);
        formData.append('profile_picture', file);

        const response = await fetch('/api/user/update', {
          method: 'PUT',
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Gagal mengupdate avatar');

        // Update session with complete user data
        await update({
          ...session,
          user: data.user
        });
 
        setProfilePicture(data.user.image);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUsernameUpdate = async (newUsername: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, username: newUsername }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal mengupdate username');

      // Update session with complete user data
      await update({
        ...session,
        user: data.user
      });

      setUsername(data.user.name);
      setIsEditingUsername(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  // Add request author handler
  const handleRequestAuthor = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/author-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id,
          username: username,
          email: user.email 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal mengirim permintaan');

      setRequestStatus('pending');
      setIsRequestingAuthor(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simpan perubahan username jika ada
      if (username !== user.username) {
        await handleUsernameUpdate(username);
      }

      // Simpan perubahan avatar jika ada
      if (profilePicture !== user.profile_picture) {
        // Anda bisa menambahkan logika untuk menyimpan avatar di sini
      }

      // Tutup modal setelah perubahan disimpan
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  // Add click outside handler
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleOutsideClick}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-6 w-full max-w-md relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6 ">Setting User</h2>

        {/* Layout baru: Avatar di kiri, informasi di kanan */}
        <div className="flex space-x-8">
          {/* Bagian Avatar */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 relative">
              <Image
                src={profilePicture || '/default-avatar.png'}
                alt="User Avatar"
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <label className="text-sm text-blue-600 hover:text-blue-500 cursor-pointer">
              Change Avatar
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Bagian Informasi User dengan Label */}
          <div className="flex-1 space-y-6">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Username</p>
              <p className="text-sm font-medium">{username}</p>
              <button
                onClick={() => setIsEditingUsername(true)}
                className="text-xs text-blue-600 hover:text-blue-500"
              >
                Change name
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            {/* Author Request Section */}
            <div className="space-y-1 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">Role Status</p>
              {requestStatus === 'none' && (
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">User</p>
                  <button
                    onClick={() => setIsRequestingAuthor(true)}
                    className="text-xs text-blue-600 hover:text-blue-500"
                  >
                    Request to become an Author
                  </button>
                </div>
              )}
              {requestStatus === 'pending' && (
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <p className="text-sm text-yellow-600">Author request pending</p>
                </div>
              )}
              {requestStatus === 'approved' && (
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                  <p className="text-sm text-green-600">Author request approved</p>
                </div>
              )}
              {requestStatus === 'rejected' && (
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-red-400 rounded-full"></span>
                  <p className="text-sm text-red-600">Author request rejected</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal untuk edit username */}
        {isEditingUsername && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleOutsideClick}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg p-6 w-full max-w-md relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setIsEditingUsername(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-xl font-semibold mb-4">Edit Username</h2>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditingUsername(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleUsernameUpdate(username)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Author Request Modal */}
        {isRequestingAuthor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleOutsideClick}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg p-6 w-full max-w-md relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setIsRequestingAuthor(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-xl font-semibold mb-4">Request Author Role</h2>
              <p className="text-sm text-gray-600 mb-4">
                By becoming an author, you'll be able to create and publish film reviews.
                Your request will be reviewed by our administrators.
              </p>
              
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsRequestingAuthor(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRequestAuthor}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {isLoading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SettingsUser;