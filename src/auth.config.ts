import type { NextAuthConfig } from 'next-auth';
const protectedPatterns = [
  /\/new/,
  /\/edit/,
];

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isInProtectedPath =
        protectedPatterns.some((pattern) => pattern.test(nextUrl.pathname));
      if (isLoggedIn && nextUrl.pathname.endsWith("/login"))
        return Response.redirect(new URL('/', nextUrl));
      if (isInProtectedPath) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      Object.assign(token, user);
      return token
    },
    session: async ({ session, token }) => {
      if (session?.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  providers: [], // providers get set in ./auth.ts
} satisfies NextAuthConfig;