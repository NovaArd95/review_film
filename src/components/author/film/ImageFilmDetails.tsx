import React, { useEffect } from "react";
import Image from "next/image";

interface ImageFilmDetailsProps {
  imageUrl: string;
  title: string;
  onClose: () => void;
}

const ImageFilmDetails: React.FC<ImageFilmDetailsProps> = ({ imageUrl, title, onClose }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
      onClick={onClose} // Klik luar gambar untuk menutup
    >
      {/* Gambar */}
      <Image
        src={imageUrl}
        alt={title}
        width={800} // Maksimal lebar 800px
        height={600}
        className="max-w-[80%] max-h-[80vh] object-contain rounded-md"
        unoptimized={true}
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat klik gambar
      />
    </div>
  );
};

export default ImageFilmDetails;
