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
      console.log("user:", auth?.user || "null");
      const isLoggedIn = !!auth?.user;
      const isInProtectedPath =
        protectedPatterns.some((pattern) => pattern.test(nextUrl.pathname));
      if (isLoggedIn && nextUrl.pathname.endsWith("/login"))
        return Response.redirect(new URL('/', nextUrl));
      if (isInProtectedPath) return isLoggedIn;
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
/*
providers: [Credentials({
  authorize: async (credentials) => {
    console.log("running authorize")
    try {
      const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string().min(6) })
        .safeParse(credentials);

      if (parsedCredentials.success) {
        const { email, password } = parsedCredentials.data;
        const { user, passwordHash } = await getUserAuthentication({ email });
        console.log({ user, passwordHash });
        if (!user) return null;
        // return true;
        // const passwordsMatch = await bcrypt.compare(password, passwordHash);
        // console.log({ passwordsMatch });

        // if (passwordsMatch) return user;
        return null;
      }
      console.log("returning normally")
      return null;
    } catch (e) {
      // console.error(e);
      return null;
    }
  },
}),],
*/