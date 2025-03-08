import Image from 'next/image';

interface ModalViewImageProps {
  imageUrl: string;
  title: string;
  onClose: () => void;
}

const ModalViewImage: React.FC<ModalViewImageProps> = ({ imageUrl, title, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-5 w-96 text-center">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="flex justify-center">
          <div className="w-32 h-32 relative">
          <Image
        src={imageUrl}
        alt={title || "Displayed Image"} // Pastikan ada teks alternatif
        layout="fill"
        objectFit="cover"
        className="rounded-full"
        />

          </div>
        </div>
        <button onClick={onClose} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
          Close
        </button>
      </div>
    </div>
  );
};

export default ModalViewImage;
