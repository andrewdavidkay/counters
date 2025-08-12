import NextAuth, { NextAuthConfig } from "next-auth";
import Twitter from "next-auth/providers/twitter";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/db/index";
import { usersTable, accountsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const config: NextAuthConfig = {
  adapter: DrizzleAdapter(db, { usersTable, accountsTable }),
  providers: [
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID,
      clientSecret: process.env.AUTH_TWITTER_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "twitter" && profile && user.id) {
        // Extract Twitter username from the profile
        const twitterProfile = profile as any;
        const username =
          twitterProfile.data?.username || twitterProfile.screen_name;

        const full400Url = twitterProfile.data?.profile_image_url.replace(
          "_normal",
          "_400x400"
        );

        if (username) {
          // Update the user's username in the database
          await db
            .update(usersTable)
            .set({ username, image: full400Url })
            .where(eq(usersTable.id, user.id));
        }
      }
      return true;
    },
    async session({ session, user }) {
      // Ensure the username is included in the session
      if (user) {
        session.user.username = user.username;
      }
      return session;
    },
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth(config);
