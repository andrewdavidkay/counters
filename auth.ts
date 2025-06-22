import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/db/index";
import * as schema from "@/db/schema";

const config: NextAuthConfig = {
  adapter: DrizzleAdapter(db, schema),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    newUser: "/new",
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth(config);
