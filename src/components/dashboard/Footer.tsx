'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaYoutube, FaDiscord } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white rounded-t-xl shadow-lg p-10">
      {/* Logo, Social Media, and Grid Menu in one flex */}
      <div className="flex items-start justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4 mr-20">
          <Image src="/logo2.png" alt="FilmReview Logo" width={100} height={100} />
          <div>
            <p className="font-semibold">Find us in social media</p>
            <div className="flex gap-4 mt-2">
              <FaDiscord className="text-2xl hover:text-gray-700 cursor-pointer" />
              <FaInstagram className="text-2xl hover:text-gray-700 cursor-pointer" />
              <FaYoutube className="text-2xl hover:text-gray-700 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Community */}
        <div className="flex-1 ml-8">
          <h3 className="text-md font-semibold">COMMUNITY</h3>
          <ul className="mt-3 space-y-2">
            <li><Link href="#" className="hover:text-black">Blog</Link></li>
            <li><Link href="#" className="hover:text-black">Community</Link></li>
            <li><Link href="#" className="hover:text-black">Ideas</Link></li>
            <li><Link href="#" className="hover:text-black">Developers</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className="flex-1 ml-8">
          <h3 className="text-md font-semibold">COMPANY</h3>
          <ul className="mt-3 space-y-2">
            <li><Link href="#" className="hover:text-black">About us</Link></li>
            <li><Link href="#" className="hover:text-black">Team</Link></li>
            <li><Link href="#" className="hover:text-black">Where to Buy</Link></li>
            <li><Link href="#" className="hover:text-black">Resellers</Link></li>
            <li><Link href="#" className="hover:text-black">Media</Link></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div className="flex-1 ml-8">
          <h3 className="text-md font-semibold">USEFUL LINKS</h3>
          <ul className="mt-3 space-y-2">
            <li><Link href="#" className="hover:text-black">Warranty</Link></li>
            <li><Link href="#" className="hover:text-black">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-black">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-300 mt-8 pt-6 text-center text-gray-600 text-sm">
        <p>Copyright &copy; {new Date().getFullYear()} FilmReview. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
