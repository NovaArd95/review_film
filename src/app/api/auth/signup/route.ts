import { NextResponse } from 'next/server';
import { executeQuery } from 'lib/db';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password') as string;
    const age = formData.get('age');
    const profile_picture = formData.get('profile_picture');

    if (!username || !email || !password || !age) {
      return NextResponse.json({ error: 'Semua field harus diisi.' }, { status: 400 });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await executeQuery<any[]>({
      query: 'SELECT id FROM users WHERE email = ?',
      values: [email],
    });

    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'Email sudah digunakan.' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profilePictureUrl = null;
    if (profile_picture) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const file = profile_picture as File;
      const filePath = path.join(uploadDir, file.name);
      const buffer = await (profile_picture as File).arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));
      profilePictureUrl = `/uploads/${(profile_picture as File).name}`;
    }

    const result = await executeQuery<{ insertId: number }>({
      query: `
        INSERT INTO users (username, email, password, age, profile_picture, role)
        VALUES (?, ?, ?, ?, ?, 'user')
      `,
      values: [username, email, hashedPassword, age, profilePictureUrl],
    });

    return NextResponse.json({ message: 'User berhasil didaftarkan.', userId: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Error during signup:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat mendaftarkan user.' }, { status: 500 });
  }
}