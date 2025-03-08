import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { executeQuery } from 'lib/db';
import fs from 'fs';
import path from 'path';

export async function PUT(request: Request) {
  try {
    // Ambil token dari request
    const token = await getToken({ req: request as any });

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let id: string | null = null;
    let username: string | null = null;
    let profile_picture: File | null = null;

    if (request.headers.get('Content-Type')?.includes('application/json')) {
      const body = await request.json();
      id = body.id;
      username = body.username;
    } else if (request.headers.get('Content-Type')?.includes('multipart/form-data')) {
      const formData = await request.formData();
      id = formData.get('id') as string;
      username = formData.get('username') as string | null;
      profile_picture = formData.get('profile_picture') as File | null;
    }

    if (!id) {
      return NextResponse.json({ error: 'ID user diperlukan.' }, { status: 400 });
    }

    if (!username && !profile_picture) {
      return NextResponse.json({ error: 'Username atau profile_picture harus diisi.' }, { status: 400 });
    }

    let profilePicturePath = null;
    if (profile_picture) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, profile_picture.name);
      const buffer = Buffer.from(await profile_picture.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      profilePicturePath = `/uploads/${profile_picture.name}`;
    }

    const result = await executeQuery<{ affectedRows: number }>({
      query: 'UPDATE users SET username = IFNULL(?, username), profile_picture = IFNULL(?, profile_picture) WHERE id = ?',
      values: [username, profilePicturePath, parseInt(id)],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 });
    }

    // Update session data
    token.name = username || token.name;
    token.image = profilePicturePath || token.image;

    // Get updated user data
    const userData = await executeQuery<{ id: number, username: string, email: string, profile_picture: string }[]>({
      query: 'SELECT id, username, email, profile_picture FROM users WHERE id = ?',
      values: [parseInt(id)],
    });

    const updatedUser = userData[0];

    // Kembalikan data yang diperbarui
    return NextResponse.json({
      message: 'User berhasil diperbarui.',
      user: {
        id: updatedUser.id,
        name: updatedUser.username,
        email: updatedUser.email,
        image: updatedUser.profile_picture,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat memperbarui user.' }, { status: 500 });
  }
}