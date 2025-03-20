'use client'

import { useEffect, useState } from "react";
import Image from "next/image";

interface TopUser {
  user_id: number;
  username: string;
  profile_picture: string;
  comment_count: number;
  total_likes: number;
  avg_rating: number;
}

export default function TopUsers() {
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);

  useEffect(() => {
    fetch("/api/top-users")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const text = await res.text(); // Ambil respons sebagai teks dulu
        return text ? JSON.parse(text) : []; // Jika kosong, return array kosong
      })
      .then((data) => {
        // Urutkan pengguna berdasarkan comment_count, total_likes, dan avg_rating
        const sortedUsers = data.sort((a: TopUser, b: TopUser) => {
          if (b.comment_count !== a.comment_count) {
            return b.comment_count - a.comment_count;
          } else if (b.total_likes !== a.total_likes) {
            return b.total_likes - a.total_likes;
          } else {
            return b.avg_rating - a.avg_rating;
          }
        });
        // Ambil 3 pengguna teratas
        setTopUsers(sortedUsers.slice(0, 3));
      })
      .catch((error) => console.error("Error fetching top users:", error));
  }, []);

  return (
    <div className="bg-black shadow-lg  p-6">
      <h1 className="text-white text-2xl font-bold flex items-center gap-2 mb-12">
            <span className="w-1 h-8 bg-yellow-500"></span>
            Top Users Rating 🏆
          </h1>
      <div className="flex justify-between">
        {topUsers.map((user, index) => (
          <div key={user.user_id} className={`flex flex-col items-center ${index === 1 ? 'mx-4' : ''}`}>
            <div className="w-24 h-24 relative">
              <Image
                src={user.profile_picture || "/default-avatar.png"}
                alt={user.username}
                width={300}
                height={300}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <p className="font-semibold mt-2 text-white">{user.username}</p>
            <p className="text-sm text-gray-500 mb-20">
              {user.comment_count} Comments • {user.total_likes} Likes
              
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}