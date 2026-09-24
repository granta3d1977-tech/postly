import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export function getGoogleCredentials() {
  const clientId = process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID ?? process.env.GOOGLE_ID;
  const clientSecret = process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET ?? process.env.GOOGLE_SECRET;
  return { clientId, clientSecret };
}

export function getGitHubCredentials() {
  const clientId = process.env.AUTH_GITHUB_ID ?? process.env.GITHUB_CLIENT_ID ?? process.env.GITHUB_ID;
  const clientSecret = process.env.AUTH_GITHUB_SECRET ?? process.env.GITHUB_CLIENT_SECRET ?? process.env.GITHUB_SECRET;
  return { clientId, clientSecret };
}

const google = getGoogleCredentials();
const github = getGitHubCredentials();

const providers = [
  ...(google.clientId && google.clientSecret ? [Google({ 
    clientId: google.clientId, 
    clientSecret: google.clientSecret,
    allowDangerousEmailAccountLinking: true,
    checks: ["state"]
  })] : []),
  ...(github.clientId && github.clientSecret ? [GitHub({ 
    clientId: github.clientId, 
    clientSecret: github.clientSecret,
    allowDangerousEmailAccountLinking: true,
    checks: ["state"]
  })] : []),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token }) {
      token.id = token.sub;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
});