"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale'; // Untuk bahasa Indonesia
import Image from 'next/image';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { FaRegSmile } from "react-icons/fa";

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
  replies?: Comment[]; // Tambahkan properti replies untuk komentar balasan
}

interface CommentsProps {
  filmId: number;
}

const Comments: React.FC<CommentsProps> = ({ filmId }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null); // Untuk menangani balasan
  const [replyContent, setReplyContent] = useState(""); // Input khusus untuk balasan
  const [error, setError] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<{ [key: number]: boolean }>({});

  const toggleReplies = (commentId: number) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // Toggle expand/collapse
    }));
  };
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
      const response = await fetch(`/api/comments?film_id=${filmId}`);
      if (!response.ok) {
        throw new Error('Gagal mengambil komentar.');
      }
      const data = await response.json();
      console.log("Data komentar dari API:", data); // Debugging
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Terjadi kesalahan saat mengambil komentar.');
    }
  };

 // Fungsi untuk menambahkan komentar utama
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!session?.user) {
      alert("Anda harus login untuk menambahkan komentar.");
      return;
    }
  
    try {
      const payload = {
        film_id: filmId,
        content: newComment,
        parent_comment_id: null, // Komentar utama tidak memiliki parent_comment_id
      };
  
      console.log("Mengirim data ke API:", payload); // Debugging
  
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Gagal menambahkan komentar.');
      }
  
      const data = await response.json();
      console.log("Respons dari API:", data); // Debugging
      setComments([data.comment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Terjadi kesalahan saat menambahkan komentar.');
    }
  };
  // Fungsi untuk menambahkan balasan
  const handleReplySubmit = async (parentCommentId: number) => {
    if (!session?.user) {
      alert("Anda harus login untuk menambahkan balasan.");
      return;
    }

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          film_id: filmId,
          content: replyContent,
          parent_comment_id: parentCommentId, // Gunakan parent_comment_id untuk balasan
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menambahkan balasan.');
      }

      const data = await response.json();
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === parentCommentId
            ? { ...comment, replies: [...(comment.replies || []), data.comment] }
            : comment
        )
      );
      setReplyContent("");
      setReplyTo(null); // Reset replyTo setelah balasan berhasil ditambahkan
    } catch (error) {
      console.error('Error adding reply:', error);
      setError('Terjadi kesalahan saat menambahkan balasan.');
    }
  };


  // Fungsi untuk menambahkan like/dislike
  const handleReaction = async (commentId: number, reaction: 'like' | 'dislike') => {
    try {
      const response = await fetch(`/api/comments/${commentId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reaction }),
      });
  
      if (!response.ok) {
        throw new Error('Gagal menambahkan reaksi.');
      }
  
      // Ambil data komentar terbaru dari API
      const data = await response.json();
      const updatedComment = data.comment;
  
      // Perbarui state comments secara rekursif
      const updateComments = (comments: Comment[]): Comment[] => {
        return comments.map((comment) => {
          if (comment.id === commentId) {
            // Perbarui komentar yang di-like/dislike
            return { ...comment, like_count: updatedComment.like_count, dislike_count: updatedComment.dislike_count };
          } else if (comment.replies) {
            // Perbarui balasan (replies) secara rekursif
            return { ...comment, replies: updateComments(comment.replies) };
          }
          return comment;
        });
      };
  
      setComments((prevComments) => updateComments(prevComments));
    } catch (error) {
      console.error('Error adding reaction:', error);
      setError('Terjadi kesalahan saat menambahkan reaksi.');
    }
  };
  // Ambil komentar saat komponen dimuat
  useEffect(() => {
    fetchComments();
  }, [filmId]);

  return (
    <div className="space-y-6">
      {/* Form untuk menambahkan komentar utama */}
      {session?.user && (
        <div className=" p-6 rounded-lg shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="relative w-10 h-10">
              <Image
                src={session.user.image || "/default-avatar.png"}
                alt={session.user.name || "User"}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <form onSubmit={handleSubmit} className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Tulis komentar Anda..."
                className="w-full p-3 bg-transparent text-black border-b border-gray-600 focus:outline-none focus:border-blue-500"
                required
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tampilkan pesan error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Daftar komentar */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className=" p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="relative w-10 h-10">
                <Image
                  src={comment.profile_picture || "/default-avatar.png"}
                  alt={comment.username}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-black">{comment.username}</p>
                <p className="text-sm text-gray-600">
                  {formatRelativeTime(comment.created_at)}
                </p>
              </div>
            </div>
            <p className="mt-4 text-black">{comment.content}</p>
            <div className="mt-2 flex items-center space-x-4">
              <button onClick={() => handleReaction(comment.id, 'like')} className="flex items-center space-x-1">
                <ThumbsUp size={18} />
                <span>{comment.like_count}</span>
              </button>
              <button onClick={() => handleReaction(comment.id, 'dislike')} className="flex items-center space-x-1">
                <ThumbsDown size={18} />
                <span>{comment.dislike_count}</span>
              </button>
              <button onClick={() => setReplyTo(comment.id)}>
                Balas
              </button>
            </div>

            {/* Tampilkan input balasan jika replyTo sesuai */}
            {replyTo === comment.id && (
               <div className="flex items-start space-x-3 mt-4">
               {/* Avatar */}
               <div className="relative w-10 h-10">
                 <Image
                   src={comment.profile_picture || "/default-avatar.png"}
                   alt={comment.username}
                   fill
                   className="rounded-full object-cover"
                 />
               </div>
         
               {/* Input Balasan */}
               <div className="flex-1">
                 <div className="relative">
                   <textarea
                     value={replyContent}
                     onChange={(e) => setReplyContent(e.target.value)}
                     placeholder="Tulis balasan Anda..."
                     className="w-full p-3 pr-10 bg-transparent text-black border-b border-black focus:outline-none focus:border-blue-500"
                     required
                   />
                   {/* Ikon Emoticon */}
                  
                 </div>
         
                 {/* Tombol Batal & Balas */}
                 <div className="mt-2 flex justify-end space-x-3">
                   <button
                     onClick={() => setReplyTo(null)}
                     className="text-gray-600 hover:text-gray-800 transition-colors"
                   >
                     Batal
                   </button>
                   <button
                     onClick={() => handleReplySubmit(comment.id)}
                     className={`px-4 py-1 rounded-lg transition-colors ${
                       replyContent.trim()
                         ? "bg-gray-800 text-white hover:bg-black"
                         : "bg-gray-200 text-gray-400 cursor-not-allowed"
                     }`}
                     disabled={!replyContent.trim()}
                   >
                     Balas
                   </button>
                 </div>
               </div>
             </div>
            )}

            {/* Tampilkan balasan */}
            {comment.replies && comment.replies.length > 0 && (
              <div>
                <button
                  onClick={() => toggleReplies(comment.id)}
                  className="text-blue-500 hover:underline"
                >
                  {expandedReplies[comment.id] ? "Sembunyikan balasan" : `Lihat ${comment.replies.length} balasan`}
                </button>
                {expandedReplies[comment.id] && (
                  <div className="ml-8 mt-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="mt-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative w-8 h-8">
                            <Image
                              src={reply.profile_picture || "/default-avatar.png"}
                              alt={reply.username}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-black">{reply.username}</p>
                            <p className="text-sm text-gray-600">
                              {formatRelativeTime(reply.created_at)}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 text-black">{reply.content}</p>
                        <div className="mt-2 flex items-center space-x-4">
                          <button onClick={() => handleReaction(reply.id, 'like')} className="flex items-center space-x-1">
                            <ThumbsUp size={18} />
                            <span>{reply.like_count}</span>
                          </button>
                          <button onClick={() => handleReaction(reply.id, 'dislike')} className="flex items-center space-x-1">
                            <ThumbsDown size={18} />
                            <span>{reply.dislike_count}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Comments;