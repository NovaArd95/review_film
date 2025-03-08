import { NextResponse } from 'next/server';
import { executeQuery } from 'lib/db';
import fs from 'fs';
import path from 'path';
interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'author' | 'admin';
  age?: number;
  profile_picture?: string;
  created_at?: string;
}


// POST: Add a new user
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;
    const age = formData.get("age") ? parseInt(formData.get("age") as string) : null;
    const profile_picture = formData.get("profile_picture") as File | null;

    if (!username || !email || !password || !role) {
      return NextResponse.json({ error: 'Username, email, password, dan role harus diisi.' }, { status: 400 });
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
      query: 'INSERT INTO users (username, email, password, role, age, profile_picture) VALUES (?, ?, ?, ?, ?, ?)',
      values: [username, email, password, role, age, profilePicturePath],
    });

    return NextResponse.json({ message: 'User berhasil ditambahkan.', result }, { status: 201 });
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat menambahkan user.' }, { status: 500 });
  }
}
  

// PUT: Update user
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const body = await request.json();
    let { username, email, password, role, age, profile_picture } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID user diperlukan.' }, { status: 400 });
    }

    if (profile_picture) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    
      const file = profile_picture as File;
      const filePath = path.join(uploadDir, file.name);
      const buffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));
      profile_picture = `/uploads/${file.name}`;
    }

    const result = await executeQuery<{ affectedRows: number }>({
      query: 'UPDATE users SET username = ?, email = ?, password = ?, role = ?, age = ?, profile_picture = ? WHERE id = ?',
      values: [username, email, password, role, age || null, profile_picture || null, parseInt(id)],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User berhasil diperbarui.', result });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat memperbarui user.' }, { status: 500 });
  }
}
// GET: Fetch all users
export async function GET() {
  try {
    const users = await executeQuery<User[]>({
      query: 'SELECT * FROM users ORDER BY created_at DESC',
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data.' }, { status: 500 });
  }
}


// DELETE: Remove user
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID user diperlukan.' }, { status: 400 });
    }

    const result = await executeQuery<{ affectedRows: number }>({
      query: 'DELETE FROM users WHERE id = ?',
      values: [parseInt(id)],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User berhasil dihapus.', result });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat menghapus user.' }, { status: 500 });
  }
}
