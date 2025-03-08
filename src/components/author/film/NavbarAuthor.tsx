"use client";

import React from "react";
import Image from "next/image";
import { HiSearch, HiQuestionMarkCircle } from "react-icons/hi";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-64 right-0 z-40 bg-white shadow-xl h-16 flex items-center justify-between px-6 border-b border-gray-200">
      {/* Logo dan Tulisan "Studio" */}
      <div className="flex items-center "> {/* Jarak dikurangi menjadi space-x-2 */}
        <Image
          src="/logo.png" // Ganti dengan path logo Anda
          alt="Logo"
          width={120}
          height={100}
          className="w-auto h-20"
        />
        <span className="text-2xl font-bold text-gray-800">Studio</span>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 rounded-3xl px-4 py-2 w-96  shadow-md"> {/* Lebar input pencarian diatur ke w-96 */}
        <HiSearch className="text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search"
          className="ml-2 bg-transparent text-gray-700 outline-none w-full" 
        />
      </div>

      {/* Ikon Bantuan dan Profile Avatar */}
      <div className="flex items-center space-x-4">
        {/* Ikon Bantuan */}
        <button className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
          <HiQuestionMarkCircle className="w-6 h-6" />
        </button>

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