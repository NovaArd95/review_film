import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";
import { executeQuery } from "lib/db";
import bcrypt from "bcryptjs";

interface CustomSession extends Session {
  user?: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  };
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // Query user dari database MySQL
        const users = await executeQuery<any[]>({
          query: "SELECT * FROM users WHERE email = ?",
          values: [credentials.email],
        });

        if (!users || users.length === 0) {
          throw new Error("Invalid credentials");
        }

        const user = users[0];

        // Bandingkan password
        if (!bcrypt.compareSync(credentials.password, user.password)) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id.toString(),
          name: user.username,
          email: user.email,
          image: user.profile_picture,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({
      token, 
      user, 
      trigger, 
      session,
    }: { 
      token: JWT; 
      user?: User | null; 
      trigger?: "signIn" | "signUp" | "update"; 
      session?: Session;
      account?: any;
      profile?: any;
      isNewUser?: boolean;
    }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.role = (user as any).role; // Hindari error TypeScript jika role tidak ada di tipe User
      }

      // Handle session update setelah user mengubah data di settings
      if (trigger === "update" && session?.user) {
        token.name = session.user.name ?? token.name;
        token.email = session.user.email ?? token.email;
        token.image = session.user.image ?? token.image;
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name,
          email: token.email,
          image: token.image,
          role: token.role as string,
        } as any;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
