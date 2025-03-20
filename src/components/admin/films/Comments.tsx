import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale'; // Untuk bahasa Indonesia

interface Comment {
  id: number;
  film_id: number;
  user_id: number;
  content: string;
  parent_comment_id: number | null;
  created_at: string;
  username: string;
  profile_picture: string;
  like_count: number;
  dislike_count: number;
  replies: Comment[]; // Pastikan replies selalu ada
}

interface CommentsProps {
  filmId: number;
  onClose: () => void;
}

const Comments: React.FC<CommentsProps> = ({ filmId, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<{ [key: number]: boolean }>({});

  // Fungsi untuk memformat waktu relatif
  const formatRelativeTime = (date: string) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: id, // Opsional: Gunakan bahasa Indonesia
    });
  };

  // Fungsi untuk mengambil komentar
  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/admin/comments?filmId=${filmId}`);
      if (!response.ok) {
        throw new Error('Gagal mengambil komentar.');
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Terjadi kesalahan saat mengambil komentar.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle tampilan balasan
  const toggleReplies = (commentId: number) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // Toggle expand/collapse
    }));
  };

  // Ambil komentar saat komponen dimuat
  useEffect(() => {
    fetchComments();
  }, [filmId]);

  // Tutup modal saat diklik di luar modal
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
        <div className="bg-white rounded-lg p-4 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <p>Memuat komentar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
        <div className="bg-white rounded-lg p-4 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50"
      onClick={handleOutsideClick} // Tutup modal saat diklik di luar
    >
      <div className="bg-white rounded-lg p-4 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Komentar</h2>

        {comments.length === 0 ? (
          <p>Belum ada komentar.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4">
                {/* Komentar Utama */}
                <div className="flex items-center space-x-4">
                  <div className="relative w-10 h-10">
                    <Image
                      src={comment.profile_picture || '/default-avatar.png'}
                      alt={comment.username}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{comment.username}</p>
                    <p className="text-sm text-gray-500">
                      {formatRelativeTime(comment.created_at)}
                    </p>
                  </div>
                </div>
                <p className="mt-2">{comment.content}</p>

                {/* Tombol Lihat Balasan */}
                {comment.replies && comment.replies.length > 0 && (
                  <button
                    onClick={() => toggleReplies(comment.id)}
                    className="text-blue-500 hover:underline mt-2"
                  >
                    {expandedReplies[comment.id] ? 'Sembunyikan balasan' : `Lihat ${comment.replies.length} balasan`}
                  </button>
                )}

                {/* Tampilkan Balasan */}
                {expandedReplies[comment.id] && comment.replies && (
                  <div className="ml-8 mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="border-l-2 pl-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative w-8 h-8">
                            <Image
                              src={reply.profile_picture || '/default-avatar.png'}
                              alt={reply.username}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold">{reply.username}</p>
                            <p className="text-sm text-gray-500">
                              {formatRelativeTime(reply.created_at)}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;