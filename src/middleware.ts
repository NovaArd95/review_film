import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.error("NEXTAUTH_SECRET tidak ditemukan.");
    return NextResponse.error();
  }

  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  console.log("Middleware running, Path:", pathname, "Token:", token);

  // Jika sudah login dan coba akses login/signup, redirect ke /
  if (token && (pathname.includes("/auth/login") || pathname.includes("/auth/signup"))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Jika belum login dan mencoba akses halaman admin
  if (!token && (pathname.includes("/admin"))) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  // Jika role admin, izinkan akses ke semua route /admin/*
  if (token?.role === "admin" && pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (token?.role === "author" && pathname.startsWith("/author")) {
    return NextResponse.next();
  }
  // Jika role bukan admin, redirect ke halaman yang sesuai (misalnya, home)
  if (token?.role !== "admin" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token?.role !== "author" && pathname.startsWith("/author")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

// Tentukan route yang diproses middleware
export const config = {
  matcher: ["/", "/admin/:path*", "/auth/:path*", "/author/:path*"],
};