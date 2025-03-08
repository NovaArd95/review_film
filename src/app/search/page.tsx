import React from 'react';
import { ChevronRight, Star, Plus, Play } from 'lucide-react';

const movies = [
  {
    title: "Avengers: Endgame",
    rating: 8.2,
    image: "/images/End.png",
    platform: "NETFLIX",
    date: "JANUARY 9",
    rank: 1
  },
  {
    title: "Spider-Man No Way Home",
    rating: 8.3,
    image: "/images/spider.png",
    platform: "Paramount",
    date: "NOV 17",
    rank: 2
  },
  {
    title: "Squid Game (2021)",
    rating: 8.7,
    image: "/images/squid.png",
    platform: "Apple TV+",
    date: "",
    rank: 3
  },
  {
    title: "Thor (2011)",
    rating: 8.0,
    image: "/images/Thor.png",
    platform: "NETFLIX",
    date: "DECEMBER 26",
    rank: 4
  },
  {
    title: "Sword Art Online: Progressive",
    rating: 7.6,
    image: "/images/download (2).png",
    platform: "",
    date: "",
    rank: 5
  },
  {
    title: "That Time I Got Reincarnated as a Slime: The Movie – Scarlet Bond",
    rating: 8.1,
    image: "/images/rimuru.png",
    platform: "Apple TV+",
    date: "",
    rank: 6
  }
];

const TopMovies = () => {
  return (
    <div className="bg-black min-h-screen p-6 ">
      <div className="max-w-7xl mx-auto mt-16">
        <div className="flex items-center justify-between mb-6 ">
          <h1 className="text-white text-2xl font-bold flex items-center gap-2">
            <span className="w-1 h-8 bg-yellow-500"></span>
            Top 10 Rating FilmReview
          </h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <div key={movie.rank} className="relative group">
              <div className="absolute top-2 left-2 z-10">
                <button className="bg-black/50 hover:bg-black/70 p-1 rounded-full">
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="flex items-center gap-2 text-white mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{movie.rating}</span>
                  </div>
                  <p className="text-sm text-white font-bold">{movie.rank}. {movie.title}</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-md flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Watchlist
                </button>
                
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-md flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Trailer
                </button>
              </div>
            </div>
          ))}
        </div>
        
       
      </div>
    </div>
  );
};

export default TopMovies;