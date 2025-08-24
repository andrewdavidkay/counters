"use server";

import db from "@/db";
import { counterItemsTable, countersTable } from "@/db/schema";
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

  await db.insert(countersTable).values({
    id: crypto.randomUUID(),
    name,
    userId: session.user.id,
  });
}

export async function logCounterItem(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const counterId = formData.get("counterId");
  if (typeof counterId !== "string" || counterId.length === 0) {
    throw new Error("Counter id is required");
  }

  await db.insert(counterItemsTable).values({
    id: crypto.randomUUID(),
    counterId,
    name: formData.get("name") as string,
    value: Number(formData.get("value")),
    userId: session.user.id,
  });
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

  // First, get the current counter data
  const [currentCounter] = await db
    .select()
    .from(countersTable)
    .where(
      and(eq(countersTable.id, id), eq(countersTable.userId, session.user.id))
    );

  if (!currentCounter) {
    throw new Error("Counter not found");
  }

  // Update the counter
  await db
    .update(countersTable)
    .set({ value: sql`${countersTable.value} + 1` })
    .where(
      and(eq(countersTable.id, id), eq(countersTable.userId, session.user.id))
    );

  // Create a log entry with the change amount (+1)
  await db.insert(counterItemsTable).values({
    id: crypto.randomUUID(),
    counterId: id,
    name: currentCounter.name,
    value: 1, // Log the change amount, not the total
    userId: session.user.id,
  });
}

export async function decrementCounter(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    throw new Error("Counter id is required");
  }

  // First, get the current counter data
  const [currentCounter] = await db
    .select()
    .from(countersTable)
    .where(
      and(eq(countersTable.id, id), eq(countersTable.userId, session.user.id))
    );

  if (!currentCounter) {
    throw new Error("Counter not found");
  }

  // Check if counter value is already 0
  if (currentCounter.value <= 0) {
    throw new Error("Counter value cannot go below 0");
  }

  // Update the counter
  await db
    .update(countersTable)
    .set({ value: sql`${countersTable.value} - 1` })
    .where(
      and(eq(countersTable.id, id), eq(countersTable.userId, session.user.id))
    );

  // Create a log entry with the change amount (-1)
  await db.insert(counterItemsTable).values({
    id: crypto.randomUUID(),
    counterId: id,
    name: currentCounter.name,
    value: -1, // Log the change amount, not the total
    userId: session.user.id,
  });
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
