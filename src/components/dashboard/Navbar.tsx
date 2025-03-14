'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, LogOut, BookmarkPlus, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { Menu } from '@headlessui/react';
import { motion } from 'framer-motion';
import SettingsUser from '@/components/dashboard/SettingsUser';
import { MdMovieFilter } from 'react-icons/md';


interface Film {
  id_film: number;
  title: string;
  cover_image: string;
  tahun: number;
  genre_names: string[];
  rating?: number;
}

const Navbar: React.FC = () => {
  const { data: session } = useSession() as { data: Session & { user: { role?: string } } };
  const status = useSession().status;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Film[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const hiddenPaths = ['/auth', '/admin'];

  useEffect(() => {
    console.log('Session updated:', session);
  }, [session]);

  useEffect(() => {
    if (!showSettings) {
      setIsOpen(false);
    }
  }, [showSettings]);

  const handleSearch = async (query: string) => {
    if (query.length > 2) {
      try {
        const response = await fetch(`/api/films/search?query=${query}`);
        const data = await response.json();
        setSearchResults(data);
        setIsSearchOpen(true);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  const handleFilmClick = () => {
    setIsSearchOpen(false); // Menutup dropdown
    setSearchQuery(''); // Mengosongkan input search (opsional)
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsSearchOpen(false); // Menutup dropdown
      router.push(`/search?query=${searchQuery}`); // Arahkan ke halaman pencarian
    }
  };
  if (hiddenPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="relative w-24 h-24">
              <Image src="/logo2.png" alt="Review Film Logo" fill className="object-contain" priority />
            </div>
            <Link
              href="/"
              className={`text-black hover:text-gray-900 relative ${
                pathname === "/" ? "font-bold text-black after:w-full" : "after:w-0"
              } after:absolute after:-bottom-2 after:left-0 after:h-[3px] after:bg-black after:transition-all after:duration-300`}
            >
              Home
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/category"
                className={`text-black hover:text-gray-900 relative ${
                  pathname === "/category" ?  "font-bold text-black after:w-full" : "after:w-0"
                } after:absolute after:-bottom-2 after:left-0 after:h-[3px] after:bg-black after:transition-all after:duration-300`}
              >
                Category Film
              </Link>
              <Link
                href="/about"
                className={`text-black hover:text-gray-900 relative ${
                  pathname === "/about" ? "font-bold text-yellow-500 after:w-full" : "after:w-0"
                } after:absolute after:-bottom-2 after:left-0 after:h-[3px] after:bg-yellow-500 after:transition-all after:duration-300`}
              >
                About
              </Link>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-8">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Search for movies..."
                className="w-full px-4 py-2 rounded-lg border border-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                onKeyPress={handleKeyPress} // Tambahkan event handler untuk "Enter"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-black w-5 h-5" />

              {/* Dropdown Hasil Pencarian */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-2 z-50 w-full max-h-64 overflow-y-auto">
                  {searchResults.map((film) => (
                    <Link key={film.id_film} href={`/films/${film.id_film}`} onClick={handleFilmClick}>
                      <div className="p-4 hover:bg-gray-100 cursor-pointer">
                        <div className="flex items-center space-x-4">
                          <img src={film.cover_image} alt={film.title} className="w-16 h-16 object-cover rounded-lg" />
                          <div>
                            <p className="font-semibold">{film.title}</p>
                            <p className="text-sm text-gray-500">{film.tahun}</p>
                            <p className="text-sm text-gray-400">{film.genre_names.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative flex items-center space-x-3">
            {status === 'loading' ? (
              <span className="loading loading-dots loading-sm"></span>
            ) : session ? (
              <Menu as="div" className="relative">
                <Menu.Button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-3 cursor-pointer">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-500">
                    <Image src={session.user?.image || '/default-avatar.png'} alt="User Avatar" width={200} height={200} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-black font-semibold">{session.user?.name || 'Username'}</span>
                </Menu.Button>
                {isOpen && !showSettings && (
                  <Menu.Items
                    static
                    as={motion.div}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded-lg py-2 z-50 border border-gray-200"
                  >
                    <div className="flex flex-col items-center border-b border-gray-300 p-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-500">
                        <Image src={session.user?.image || '/default-avatar.png'} alt="User Avatar" width={200} height={200} className="w-full h-full object-cover" />
                      </div>
                      <span className="mt-2 font-semibold">{session.user?.name || 'Username'}</span>
                      <span className="text-gray-500 text-sm">{session.user?.email || 'user@example.com'}</span>
                    </div>
                    <div className="py-2">
                      {session?.user?.role === 'author' && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link 
                              href="/author/film" 
                              className={`flex items-center px-4 py-2 w-full ${active ? 'bg-gray-100' : ''}`}
                            >
                              <MdMovieFilter className="w-5 h-5 text-gray-600 mr-2" />
                              Studio Author
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <Link href="/favorites" className={`flex items-center px-4 py-2 w-full ${active ? 'bg-gray-100' : ''}`}>
                            <Heart className="w-5 h-5 text-gray-600 mr-2" />
                            Favorites
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link href="/watchlist" className={`flex items-center px-4 py-2 w-full ${active ? 'bg-gray-100' : ''}`}>
                            <BookmarkPlus className="w-5 h-5 text-gray-600 mr-2" />
                            Watchlist
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button onClick={() => setShowSettings(true)} className={`flex items-center px-4 py-2 w-full ${active ? 'bg-gray-100' : ''}`}>
                            <span className="w-5 h-5 text-gray-600 mr-2">⚙️</span>
                            Settings
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="py-2 border-t border-gray-300">
                      <Menu.Item>
                        {({ active }) => (
                          <button className={`flex items-center px-4 py-2 w-full text-red-500 ${active ? 'bg-gray-100' : ''}`} onClick={() => signOut()}>
                            <LogOut className="w-5 h-5 mr-2" />
                            Log Out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                )}
              </Menu>
            ) : (
              <>
                <Link href="/auth/login" className="text-black hover:text-gray-900 px-3 py-2">Log in</Link>
                <Link href="/auth/signup" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {showSettings && session?.user && (
        <SettingsUser
          user={{
            id: session.user.id || '0',
            username: session.user.name || 'Guest',
            profile_picture: session.user.image || '',
            email: session.user.email || 'user@example.com',
          }}
          onClose={() => {
            setShowSettings(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;