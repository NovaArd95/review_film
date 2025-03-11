import React from "react";

interface OverviewModalProps {
  overview: string;
  onClose: () => void;
}

const OverviewModal: React.FC<OverviewModalProps> = ({ overview, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose} // Tutup modal ketika diklik di luar
    >
      <div
        className="bg-black p-6 rounded-lg max-w-3xl   max-h-[90vh] overflow-y-auto" // Scroll jika konten panjang
        onClick={(e) => e.stopPropagation()} // Mencegah event bubbling ke parent
      >
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <p className="text-white">{overview}</p>
      </div>
    </div>
  );
};

export default OverviewModal;