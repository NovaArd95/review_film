'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaYoutube, FaDiscord } from 'react-icons/fa';

const FooterFilms = () => {
  return (
    <footer className="bg-black rounded-t-2xl shadow-lg p-10 w-full">
      {/* Logo, Social Media, and Grid Menu in one flex */}
      <div className="flex items-start justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4 mr-14">
          <Image src="/logofooter.png" alt="FilmReview Logo" width={115} height={115} className="self-center" />
        </div>
        <div className="flex-1">
          <h3 className="text-md font-bold text-white">Find us in social media</h3>
          <ul className="flex gap-4 mt-2">
            <FaDiscord className="text-2xl text-white hover:text-gray-400 cursor-pointer" />
            <FaInstagram className="text-2xl text-white hover:text-gray-400 cursor-pointer" />
            <FaYoutube className="text-2xl text-white hover:text-gray-400 cursor-pointer" />
          </ul>
        </div>

        {/* Community */}
        <div className="flex-1 ml-8">
          <h3 className="text-md font-bold text-white">COMMUNITY</h3>
          <ul className="mt-3 space-y-2">
            <li><Link href="#" className="text-white hover:text-gray-400">Blog</Link></li>
            <li><Link href="#" className="text-white hover:text-gray-400">Community</Link></li>
            <li><Link href="#" className="text-white hover:text-gray-400">Ideas</Link></li>
            <li><Link href="#" className="text-white hover:text-gray-400">Developers</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className="flex-1 ml-8">
          <h3 className="text-md font-bold text-white">COMPANY</h3>
          <ul className="mt-3 space-y-2">
            <li><Link href="#" className="text-white hover:text-gray-400">About us</Link></li>
            <li><Link href="#" className="text-white hover:text-gray-400">Team</Link></li>
            <li><Link href="#" className="text-white hover:text-gray-400">Where to Buy</Link></li>
            <li><Link href="#" className="text-white hover:text-gray-400">Resellers</Link></li>
            <li><Link href="#" className="text-white hover:text-gray-400">Media</Link></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div className="flex-1 ml-8">
          <h3 className="text-md font-bold text-white">USEFUL LINKS</h3>
          <ul className="mt-3 space-y-2">
            <li><Link href="#" className="text-white hover:text-gray-400">Warranty</Link></li>
            <li><Link href="#" className="text-white hover:text-gray-400">Privacy Policy</Link></li>
            <li><Link href="#" className="text-white hover:text-gray-400">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-300 mt-8 pt-6 text-center text-gray-600 text-sm">
        <p className="text-white">Copyright &copy; {new Date().getFullYear()} FilmReview. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default FooterFilms;
