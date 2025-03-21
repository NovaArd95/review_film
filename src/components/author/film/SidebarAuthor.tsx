"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiHome, HiTrendingUp, HiUser, HiClock, HiCog, HiChat } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const SidebarAuthor: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { data: session } = useSession();
  const pathname = usePathname(); // Mendapatkan path saat ini

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out overflow-y-auto custom-scrollbar`}
    >
      {/* Author Profile Section */}
      <div className="flex flex-col items-center px-6 py-6 text-gray-800 border-b border-gray-200">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
          <Image
            src={session?.user?.image || "/default-avatar.png"}
            alt="Author Avatar"
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="mt-2 text-lg font-semibold">{session?.user?.name}</span>
        <span className="text-sm text-gray-500">Author</span>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-4 flex flex-col h-[calc(100%-80px)] justify-between">
        <ul className="space-y-2">
          {/* Home */}
          <li>
            <Link
              href="/author/home"
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                pathname === "/author/home"
                  ? "bg-gray-200 text-gray-900 font-semibold"
                  : "text-gray-900 hover:bg-gray-300"
              }`}
            >
              <HiHome className="w-5 h-5" />
              <span className="ml-3">Home</span>
            </Link>
          </li>

          {/* Trending */}
         
        </ul>

        {/* Logout Button */}
        <div className="px-4 mb-24">
          <button
            onClick={() => signOut()}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default SidebarAuthor;
