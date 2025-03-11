import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { executeQuery } from 'lib/db';


 interface CommentReaction {
    id: number;
    comment_id: number;
    user_id: number;
    reaction: 'like' | 'dislike';
    created_at: string;
  }
  
  interface Comment {
    id: number;
    film_id: number;
    user_id: number;
    content: string;
    parent_comment_id: number | null;
    created_at: string;
    like_count: number;
    dislike_count: number;
  }


  export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const token = await getToken({ req: request });
  
      // Cek apakah user sudah login
      if (!token || !token.id) {
        return NextResponse.json(
          { error: 'Anda harus login untuk memberikan reaksi.' },
          { status: 401 }
        );
      }
  
      const commentId = parseInt(params.id);
      const body = await request.json();
      const { reaction } = body; // 'like' atau 'dislike'
  
      if (!reaction || !['like', 'dislike'].includes(reaction)) {
        return NextResponse.json(
          { error: 'Reaksi tidak valid.' },
          { status: 400 }
        );
      }
  
      // Cek apakah user sudah memberikan reaksi sebelumnya
      const existingReaction = await executeQuery<CommentReaction[]>({
        query: 'SELECT * FROM comment_reactions WHERE comment_id = ? AND user_id = ?',
        values: [commentId, token.id],
      });
  
      if (existingReaction.length > 0) {
        // Update reaksi jika sudah ada
        await executeQuery({
          query: 'UPDATE comment_reactions SET reaction = ? WHERE id = ?',
          values: [reaction, existingReaction[0].id],
        });
      } else {
        // Tambahkan reaksi baru
        await executeQuery({
          query: 'INSERT INTO comment_reactions (comment_id, user_id, reaction) VALUES (?, ?, ?)',
          values: [commentId, token.id, reaction],
        });
      }
  
      // Hitung jumlah like dan dislike
      const likeCount = await executeQuery<{ count: number }[]>({
        query: 'SELECT COUNT(*) AS count FROM comment_reactions WHERE comment_id = ? AND reaction = "like"',
        values: [commentId],
      });
  
      const dislikeCount = await executeQuery<{ count: number }[]>({
        query: 'SELECT COUNT(*) AS count FROM comment_reactions WHERE comment_id = ? AND reaction = "dislike"',
        values: [commentId],
      });
  
      // Ambil data komentar terbaru
      const comment = await executeQuery<Comment[]>({
        query: `
          SELECT 
            c.*, 
            u.username, 
            u.profile_picture
          FROM comments c
          LEFT JOIN users u ON c.user_id = u.id
          WHERE c.id = ?
        `,
        values: [commentId],
      });
  
      if (!comment.length) {
        return NextResponse.json(
          { error: "Komentar tidak ditemukan." },
          { status: 404 }
        );
      }
  
      // Siapkan data komentar terbaru
      const updatedComment = {
        ...comment[0],
        like_count: likeCount[0].count,
        dislike_count: dislikeCount[0].count,
      };
  
      return NextResponse.json(
        { message: 'Reaksi berhasil ditambahkan.', comment: updatedComment },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error adding reaction:', error);
      return NextResponse.json(
        { error: 'Terjadi kesalahan saat menambahkan reaksi.' },
        { status: 500 }
      );
    }
  }