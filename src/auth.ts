import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { getUserAuthentication } from './lib/data';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);
          if (!parsedCredentials.success) return null;
          const { email, password } = parsedCredentials.data;
          const { user, passwordHash } = await getUserAuthentication({ email });
          const passwordsMatch = await bcrypt.compare(password, passwordHash);

          if (passwordsMatch) return {
            ...user,
            name: `${user.firstName} ${user.lastName}`,
          };
          return null;
        } catch (e) {
          // console.error(e);
          return null;
        }
      },
    }),
  ],
});