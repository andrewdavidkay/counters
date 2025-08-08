import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/db";
import { countersTable } from "@/db/schema";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { name } = await req.json();
  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const [counter] = await db
    .insert(countersTable)
    .values({
      id: crypto.randomUUID(),
      name: name.trim(),
      userId: session.user.id,
    })
    .returning();

  return NextResponse.json({ counter });
}
