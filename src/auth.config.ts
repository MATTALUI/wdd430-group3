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
      console.log("user", auth?.user || "null");
      const isLoggedIn = !!auth?.user;
      const isInProtectedPath =
        protectedPatterns.some((pattern) => pattern.test(nextUrl.pathname));
      if (isLoggedIn && nextUrl.pathname.endsWith("/login"))
        return Response.redirect(new URL('/', nextUrl));
      if (isInProtectedPath) return isLoggedIn;
      return true;
    },
    // session(session) {
    //   console.log(session)
    //   return {}
    // },
    
  },
  providers: [], // providers get set in ./auth.ts
} satisfies NextAuthConfig;