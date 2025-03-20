import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Author {
  id: number;
  username: string;
  email: string;
  profile_picture: string;
  created_at: string; // Tambahkan created_at
}

interface PageAuthorProps {
  authors: Author[];
}

const PageAuthor: React.FC<PageAuthorProps> = ({ authors }) => {
  return (
    <div className="space-y-4">
      {authors.map((author) => (
        <Link
          key={author.id}
          href={`/admin/films/${author.id}`}
          className="flex items-center p-4 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-200"
        >
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-300">
            <Image
              src={author.profile_picture || '/default-avatar.png'}
              alt={author.username}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-bold text-black">{author.username}</h3>
            <p className="text-sm text-gray-600">Author</p>
            <p className="text-sm text-gray-600">{author.email}</p>
            <p className="text-xs text-gray-500">
              Created on: {new Date(author.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PageAuthor;
