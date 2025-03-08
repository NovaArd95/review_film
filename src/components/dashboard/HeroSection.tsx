'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

const Dashboard = () => {
  const images = [
    '/images/spiderman.png',
    '/images/Doctor.png',
    '/images/Avenger.png'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSlide = useCallback((newIndex: number | ((prevIndex: number) => number)) => {
    setCurrentIndex((prevIndex) => typeof newIndex === 'function' ? newIndex(prevIndex) : newIndex);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleSlide((prevIndex: number) => (prevIndex + 1) % images.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [handleSlide]);

  const handlePrev = () => {
    handleSlide(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    handleSlide((currentIndex + 1) % images.length);
  };
  const handleExploreClick = () => {
    const topMoviesSection = document.getElementById('top-movies');
    if (topMoviesSection) {
      topMoviesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div  id="dashboard" className=" relative min-h-screen bg-black text-white ">
      <div className="relative h-screen overflow-hidden rounded-xl">
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index + 1}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-500 ease-in-out ${
                index === currentIndex 
                  ? 'opacity-100 translate-x-0' 
                  : index < currentIndex 
                  ? 'opacity-0 -translate-x-full' 
                  : 'opacity-0 translate-x-full'
              }`}
            />
          ))}
        </div>

        {/* Overlay untuk Menggelapkan Gambar */}
        <div className="absolute inset-0 bg-black opacity-80"></div>

        {/* Gradien */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black via-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black via-transparent"></div>
          <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-black via-transparent"></div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-black via-transparent"></div>
        </div>

        {/* Navigation Buttons */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-white/40 text-white p-3 rounded-full z-20 transition-colors duration-300"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-white/40 text-white p-3 rounded-full z-20 transition-colors duration-300"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {images.map((_, index) => (
            <div 
              key={index} 
              className={`w-3 h-3 rounded-full cursor-pointer ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => handleSlide(index)}
            />
          ))}
        </div>

        {/* Teks Hero */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Discover & Review The Best Movies
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Explore in-depth reviews, ratings, and insights on the latest blockbusters and timeless classics.
          </p>
          <button 
            className="bg-white text-black border-2 font-medium py-3 px-6 rounded-md transition-all duration-300 hover:bg-black hover:text-white"
            onClick={handleExploreClick}
          >
            Start Exploring
          </button>
        </div>
      </div>

      {/* Statistik Section */}
      <div className="container mx-auto py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <h3 className="text-4xl font-bold mb-2">10K+</h3>
          <p className="text-gray-400">Movie Reviews</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold mb-2">50K+</h3>
          <p className="text-gray-400">Active Users</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold mb-2">1000+</h3>
          <p className="text-gray-400">Critics</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;