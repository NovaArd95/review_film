"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { HiSearch, HiQuestionMarkCircle, HiBell } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

// Define the ExtendedSession type
type ExtendedSession = Session & {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
};

const Navbar = () => {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<any[]>([]); // Menyimpan notifikasi yang belum dibaca
  const [lastOpened, setLastOpened] = useState<Date | null>(null); // Timestamp terakhir dropdown dibuka
  const [showNotifications, setShowNotifications] = useState(false);

  // Fungsi untuk mengambil lastOpened dari localStorage
  const getLastOpenedFromStorage = () => {
    const storedLastOpened = localStorage.getItem("lastOpened");
    return storedLastOpened ? new Date(storedLastOpened) : null;
  };

  // Fungsi untuk menyimpan lastOpened ke localStorage
  const saveLastOpenedToStorage = (date: Date) => {
    localStorage.setItem("lastOpened", date.toISOString());
  };

  useEffect(() => {
    // Set lastOpened dari localStorage saat komponen pertama kali di-mount
    const storedLastOpened = getLastOpenedFromStorage();
    if (storedLastOpened) {
      setLastOpened(storedLastOpened);
    }
  }, []);

  useEffect(() => {
    // Cek role dan fetch notifikasi hanya untuk author
    if (session?.user?.role === "author") {
      fetch("/api/notification")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Pastikan data.notifications ada dan merupakan array
          if (Array.isArray(data.notifications)) {
            setNotifications(data.notifications);

            // Filter notifikasi baru (yang dibuat setelah lastOpened)
            const storedLastOpened = getLastOpenedFromStorage();
            if (storedLastOpened) {
              const newNotifications = data.notifications.filter(
                (notification: { created_at: string | number | Date }) =>
                  new Date(notification.created_at) > storedLastOpened
              );
              setUnreadNotifications(newNotifications);
            } else {
              // Jika lastOpened belum ada, semua notifikasi dianggap baru
              setUnreadNotifications(data.notifications);
            }
          } else {
            setNotifications([]);
            setUnreadNotifications([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
          setNotifications([]);
          setUnreadNotifications([]);
        });
    }
  }, [session]);

  // Fungsi untuk menangani pembukaan dropdown notifikasi
  const handleNotificationClick = () => {
    if (!showNotifications) {
      // Set lastOpened ke waktu sekarang ketika dropdown dibuka
      const now = new Date();
      setLastOpened(now);
      saveLastOpenedToStorage(now); // Simpan ke localStorage
      setUnreadNotifications([]); // Reset notifikasi yang belum dibaca
    }
    setShowNotifications(!showNotifications);
  };

  // Fungsi untuk menghitung waktu yang lalu
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - notificationTime.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} detik yang lalu`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
    }
  };

  return (
    <nav className="fixed top-0 left-64 right-0 z-40 bg-white shadow-xl h-16 flex items-center justify-between px-6 border-b border-gray-200">
      {/* Logo dan Tulisan "Studio" */}
      <div className="flex items-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={100}
          className="w-auto h-20"
        />
        <span className="text-2xl font-bold text-gray-800">Studio</span>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 rounded-3xl px-4 py-2 w-96 shadow-md">
        <HiSearch className="text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search"
          className="ml-2 bg-transparent text-gray-700 outline-none w-full"
        />
      </div>

      {/* Ikon Bantuan, Notifikasi, dan Profile Avatar */}
      <div className="flex items-center space-x-4">
      
        {/* Ikon Notifikasi (hanya untuk author) */}
        {session?.user?.role === "author" && (
          <div className="relative">
            <button
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              onClick={handleNotificationClick}
            >
              <HiBell className="w-6 h-6" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Dropdown Notifikasi */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-4">Notifications</h3>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={`${notification.film_id}-${notification.user_id}`}
                        className="mt-2 text-sm text-gray-700"
                      >
                        <div className="flex items-start space-x-2">
                          {/* Avatar User */}
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
                            <Image
                              src={notification.avatar || "/default-avatar.png"}
                              alt="User Avatar"
                              width={100}
                              height={100}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Username, Waktu, dan Isi Notifikasi */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold">{notification.username}</p>
                              <p className="text-xs text-gray-500">
                                {getTimeAgo(notification.created_at)}
                              </p>
                            </div>
                            <p>
                              Memberikan rating{" "}
                              <span
                                className={`font-semibold ${
                                  notification.rating < 50 ? "text-red-500" : "text-gray-700"
                                }`}
                              >
                                {notification.rating}%
                              </span>{" "}
                              pada film{" "}
                              <span className="font-bold break-words">
                                {notification.film_title}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-700">No notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Avatar */}
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
            <Image
              src={session?.user?.image || "/default-avatar.png"}
              alt="Profile Avatar"
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;