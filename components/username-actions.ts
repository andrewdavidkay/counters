"use server";

import { auth } from "@/auth";
import db from "@/db/index";
import { usersTable as users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function saveUsername(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }
  const username = formData.get("username") as string;
  if (!username) {
    throw new Error("Username is required");
  }
  await db
    .update(users)
    .set({ username })
    .where(eq(users.email, session.user.email));
  redirect("/");
}
