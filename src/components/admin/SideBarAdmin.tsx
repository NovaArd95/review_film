"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LuTable } from "react-icons/lu";
import { HiHome } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { MdMovie } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import { GiWorld } from "react-icons/gi";
import { BsCalendarDate, BsPeople } from "react-icons/bs";
import { User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { data: session } = useSession();
  const [tablesOpen, setTablesOpen] = useState(true);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1C2434] transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out overflow-y-auto`}
    >
      {/* Admin Profile Section */}
      <div className="flex flex-col items-center px-6 py-6 text-white border-b border-gray-700">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-400">
          <Image
            src={session?.user?.image || "/default-avatar.png"}
            alt="Admin Avatar"
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="mt-2 text-lg font-semibold">{session?.user?.name}</span>
        <span className="text-sm text-gray-400">Administrator</span>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-4 flex flex-col h-[calc(100%-80px)] justify-between">
        <ul className="space-y-2">
          {/* Home */}
          <li>
            <Link
              href="/admin/home"
              className="flex items-center px-4 py-2 text-[#DEE4EE] hover:bg-[#333A48] rounded-lg transition-colors duration-200"
            >
              <HiHome className="w-5 h-5" />
              <span className="ml-3">Home</span>
            </Link>
          </li>

          {/* Tables */}
          <li>
            <button
              onClick={() => setTablesOpen(!tablesOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-[#DEE4EE] hover:bg-[#333A48] rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center">
                <LuTable className="w-5 h-5" />
                <span className="ml-3">Tables</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  tablesOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                tablesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="pl-4 mt-2 space-y-2">
                <li>
                  <Link
                    href="/film"
                    className="flex items-center px-4 py-2 text-[#DEE4EE] hover:bg-[#333A48] rounded-lg transition-colors duration-200"
                  >
                    <MdMovie className="w-4 h-4" />
                    <span className="ml-3">Film</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/genre"
                    className="flex items-center px-4 py-2 text-[#DEE4EE] hover:bg-[#333A48] rounded-lg transition-colors duration-200"
                  >
                    <BiCategoryAlt className="w-4 h-4" />
                    <span className="ml-3">Genre</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/negara"
                    className="flex items-center px-4 py-2 text-[#DEE4EE] hover:bg-[#333A48] rounded-lg transition-colors duration-200"
                  >
                    <GiWorld className="w-4 h-4" />
                    <span className="ml-3">Negara</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/tahun"
                    className="flex items-center px-4 py-2 text-[#DEE4EE] hover:bg-[#333A48] rounded-lg transition-colors duration-200"
                  >
                    <BsCalendarDate className="w-4 h-4" />
                    <span className="ml-3">Tahun</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/users"
                    className="flex items-center px-4 py-2 text-[#DEE4EE] hover:bg-[#333A48] rounded-lg transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span className="ml-3">Users</span>
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>

        {/* Logout Button */}
        <div className="px-4 mb-6">
          <button
            onClick={() => signOut()}
            className="flex items-center w-full px-4 py-2 text-[#DEE4EE] hover:bg-[#333A48] rounded-lg transition-colors duration-200"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
