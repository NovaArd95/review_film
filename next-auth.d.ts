// next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user?: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      role?: string;
    };
  }

  interface JWT {
    accessToken?: string;
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  }
}

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}
