import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from 'next-auth/react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  filmId: number;
  userRating: number | null;
  onRatingSubmit: (rating: number | null) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, filmId, userRating, onRatingSubmit }) => {
  const [rating, setRating] = useState(userRating || 0);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const { data: session, status } = useSession() as { data: { user: { role: string } } | null, status: string };

  const handleSubmit = async () => {
    if (status !== 'authenticated' || (session?.user?.role !== 'user' && session?.user?.role !== 'author')) {
      toast.error('Anda harus login sebagai user atau author untuk memberikan rating.');
      return;
    }

    try {
      await onRatingSubmit(rating);
      onClose();
    } catch (error) {
      toast.error('Terjadi kesalahan');
    }
  };

  // Fungsi untuk menentukan warna berdasarkan nilai rating
  const getRatingColor = (rating: number) => {
    if (rating <= 33) return 'red'; // Merah untuk rating rendah
    if (rating <= 66) return 'yellow'; // Kuning untuk rating sedang
    return 'green'; // Hijau untuk rating tinggi
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-4 w-full max-w-5xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-xl font-bold mb-8 text-black">Rating</h1>
        <h2 className="text-md font-bold mb-4 text-black">What did you think of this film?</h2>
        <div className="slider-container relative w-full mb-4">
          <input
            type="range"
            min="0"
            max="100"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const offsetX = e.clientX - rect.left;
              const percent = (offsetX / rect.width) * 100;
              setHoverValue(Math.round(percent));
            }}
            onMouseLeave={() => setHoverValue(null)}
            className="slider w-full h-2 rounded-full appearance-none outline-none"
            style={{
              background: `linear-gradient(to right, white 0%, ${getRatingColor(rating)} ${rating}%, #ddd ${rating}%, #ddd 100%)`,
            }}
          />
          {hoverValue !== null && (
            <div
              className="slider-value absolute top-[-30px] text-sm bg-black text-white px-2 py-1 rounded"
              style={{ left: `${hoverValue}%`, transform: 'translateX(-50%)' }}
            >
              {hoverValue}
            </div>
          )}
        </div>
        <div className="flex justify-between text-black mb-4">
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => (
            <span key={value}>{value}</span>
          ))}
        </div>
        {userRating !== null && (
          <button
            onClick={async () => {
              await onRatingSubmit(null);
              onClose();
            }}
            className="text-blue-500 hover:text-blue-600"
          >
            Clear My Rating
          </button>
        )}
        <div className="flex justify-end">
        
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-4 py-2 rounded-2xl"
          >
            I'm Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;