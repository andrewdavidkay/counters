import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/db/index";

const config: NextAuthConfig = {
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    newUser: "/new",
  },
  callbacks: {
    async session({ session, user }) {
      // Add username from the user object to the session
      if (session.user && user) {
        session.user.username = user.username;
      }
      return session;
    },
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth(config);
