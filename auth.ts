import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google, GitHub],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token }) {
      // `sub` is the stable provider identifier Auth.js puts in the JWT.
      token.id = token.sub;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
