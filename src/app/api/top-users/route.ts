import { NextResponse } from "next/server";
import { executeQuery } from "lib/db";

export async function GET() {
  try {
    const users = await executeQuery({
      query: `
        SELECT 
          u.id AS user_id, 
          u.username, 
          u.profile_picture, 
          COUNT(DISTINCT c.id) AS comment_count, 
          COALESCE(SUM(cr.likes), 0) AS total_likes,
          CAST(COALESCE(AVG(r.rating), 0) AS FLOAT) AS avg_rating,
          COUNT(DISTINCT r.id) AS rating_count
        FROM users u
        LEFT JOIN comments c ON u.id = c.user_id
        LEFT JOIN (
          SELECT comment_id, COUNT(*) AS likes 
          FROM comment_reactions 
          WHERE reaction = 'like'
          GROUP BY comment_id
        ) cr ON c.id = cr.comment_id
        LEFT JOIN ratings r ON u.id = r.user_id
        GROUP BY u.id
        ORDER BY comment_count DESC, avg_rating DESC, total_likes DESC
        LIMIT 5;
      `,
      values: [],
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching top users:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data." },
      { status: 500 }
    );
  }
}
