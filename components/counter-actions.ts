"use server";

import db from "@/db";
import { countersTable } from "@/db/schema";
import { auth } from "@/auth";

export async function createCounter(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const name = formData.get("name") as string;
  if (!name) {
    throw new Error("Name is required");
  }

  await db.insert(countersTable).values({
    id: crypto.randomUUID(),
    name,
    userId: session.user.id,
  });
}
