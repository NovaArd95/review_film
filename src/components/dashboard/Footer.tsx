'use client'
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';


const handleExploreClick = () => {
    const topMoviesSection = document.getElementById('dashboard');
    if (topMoviesSection) {
      topMoviesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

const Footer = () => {
  return (
    <footer className="bg-white rounded-t-xl shadow-lg p-10">
      <div  className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Address */}
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo2.png" alt="FilmReview Logo" width={50} height={50} />
            <span className="text-xl font-bold text-black">FilmReview</span>
          </div>
          <p className="text-gray-600 mt-3">
            Your ultimate destination for movie reviews, ratings, and discussions. Stay updated with the latest trends in the film industry.
          </p>
          <div className="flex space-x-4 mt-4">
            <FaFacebookF className="text-gray-700 hover:text-black text-xl cursor-pointer" />
            <FaTwitter className="text-gray-700 hover:text-black text-xl cursor-pointer" />
            <FaInstagram className="text-gray-700 hover:text-black text-xl cursor-pointer" />
            <FaYoutube className="text-gray-700 hover:text-black text-xl cursor-pointer" />
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-black">Navigation</h3>
          <ul className="mt-3 space-y-2 text-gray-600">
            <li><Link  onClick={handleExploreClick} href="/" className="hover:text-black">Home</Link></li>
            <li><Link href="/search" className="hover:text-black">Category Film</Link></li>
            <li><Link href="/about" className="hover:text-black">About</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-black">Get the latest information</h3>
          <div className="mt-3 flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input type="email" placeholder="Email Address" className="p-2 flex-1 outline-none" />
            <button className="bg-yellow-500 px-4 py-2 text-white">&gt;</button>
          </div>
        </div>
      </div>

      {/* Copyright & Policy */}
      <div className="border-t border-gray-300 mt-8 pt-6 text-center text-gray-600 text-sm">
        <p>Copyright &copy; {new Date().getFullYear()} FilmReview. All Rights Reserved.</p>
        <p className="mt-2">
          <Link href="#" className="hover:text-black">User Terms & Conditions</Link> | 
          <Link href="#" className="hover:text-black"> Privacy Policy</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
