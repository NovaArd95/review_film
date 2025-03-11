import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { executeQuery } from 'lib/db';

interface Comment {
  id?: number;
  film_id: number;
  user_id: number;
  content: string;
  parent_comment_id?: number | null;
  created_at?: string;
  username?: string;
  profile_picture?: string;
  like_count?: number;
  dislike_count?: number;
  replies: Comment[]; // Pastikan replies selalu ada
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filmId = searchParams.get("film_id");

    if (!filmId || isNaN(Number(filmId))) {
      return NextResponse.json({ error: "Film ID harus berupa angka." }, { status: 400 });
    }

    const comments = await executeQuery<Comment[]>({
      query: `
        SELECT 
          c.*, 
          u.username, 
          u.profile_picture,
          COUNT(DISTINCT l.id) AS like_count,
          COUNT(DISTINCT d.id) AS dislike_count
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        LEFT JOIN comment_reactions l ON c.id = l.comment_id AND l.reaction = 'like'
        LEFT JOIN comment_reactions d ON c.id = d.comment_id AND d.reaction = 'dislike'
        WHERE c.film_id = ?
        GROUP BY c.id
        ORDER BY c.parent_comment_id ASC, c.created_at DESC
      `,
      values: [parseInt(filmId)],
    });

    const commentMap = new Map<number, Comment>();
    const result: Comment[] = [];

    comments.forEach((comment) => {
      comment.replies = []; // Pastikan setiap komentar memiliki replies array
      commentMap.set(comment.id as number, comment);

      if (!comment.parent_comment_id) {
        result.push(comment);
      } else {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          parent.replies = parent.replies || []; // Pastikan replies tidak undefined
          parent.replies.push(comment);
        }
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil komentar." },
      { status: 500 }
    );
  }
}

// POST: Tambah komentar baru
// POST: Add a new comment
export async function POST(request: NextRequest) {
    try {
      const token = await getToken({ req: request });
  
      // Cek apakah user sudah login
      if (!token || !token.id || !token.role) {
        return NextResponse.json(
          { error: 'Anda harus login untuk menambahkan komentar.' },
          { status: 401 }
        );
      }
  
      const body = await request.json();
      const { film_id, content, parent_comment_id } = body;
  
      // Validasi input
      if (!film_id || !content) {
        return NextResponse.json(
          { error: 'Film ID dan content harus diisi.' },
          { status: 400 }
        );
      }

     // Tambahkan komentar ke database
     const result = await executeQuery<{ affectedRows: number; insertId: number }>({
        query: 'INSERT INTO comments (film_id, user_id, content, parent_comment_id) VALUES (?, ?, ?, ?)',
        values: [film_id, token.id, content, parent_comment_id || null],
      });
  
      const newComment = {
        id: result.insertId,
        film_id,
        user_id: token.id,
        content,
        parent_comment_id,
        created_at: new Date().toISOString(),
        username: token.name,
        profile_picture: token.image,
      };
  
      return NextResponse.json(
        { message: 'Komentar berhasil ditambahkan.', comment: newComment },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error adding comment:', error);
      return NextResponse.json(
        { error: 'Terjadi kesalahan saat menambahkan komentar.' },
        { status: 500 }
      );
    }
  }