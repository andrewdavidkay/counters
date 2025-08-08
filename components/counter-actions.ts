"use server";

import db from "@/db";
import { countersTable } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and, sql } from "drizzle-orm";

export async function createCounter(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const name = formData.get("name") as string;
  if (!name) {
    throw new Error("Name is required");
  }

  const [counter] = await db
    .insert(countersTable)
    .values({
      id: crypto.randomUUID(),
      name,
      userId: session.user.id,
    })
    .returning();

  return counter;
}

export async function incrementCounter(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    throw new Error("Counter id is required");
  }

  const [counter] = await db
    .update(countersTable)
    .set({ value: sql`${countersTable.value} + 1` })
    .where(
      and(eq(countersTable.id, id), eq(countersTable.userId, session.user.id))
    )
    .returning();

  return counter;
}

export async function deleteCounter(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    throw new Error("Counter id is required");
  }

  await db
    .delete(countersTable)
    .where(
      and(eq(countersTable.id, id), eq(countersTable.userId, session.user.id))
    );
}
