import React from "react";

interface FilmTrailerModalProps {
  trailerUrl: string;
  onClose: () => void;
}

const getEmbedUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtube.com")) {
      const videoId = urlObj.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } else if (urlObj.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed${urlObj.pathname}`;
    }
    return url;
  } catch (error) {
    console.error("Invalid URL:", url);
    return url;
  }
};

const FilmTrailerModal: React.FC<FilmTrailerModalProps> = ({ trailerUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50"
    onClick={onClose} // Klik luar gambar untuk menutup

    
    >
      <div className="bg-black rounded-lg p-4 w-full max-w-5xl max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4">Play Trailer</h2>
        <iframe
          src={getEmbedUrl(trailerUrl)}
          className="w-full h-96 rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <div className="mt-5 flex justify-end">
            
        </div>
      </div>
    </div>
  );
};

export default FilmTrailerModal;
