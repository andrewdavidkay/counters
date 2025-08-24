import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import db from "@/db";
import { usersTable, countersTable, counterItemsTable } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import CounterLogs from "@/components/counter-logs";

interface CounterLogsPageProps {
  params: Promise<{
    username: string;
    counterId: string;
  }>;
}

export async function generateMetadata({
  params,
}: CounterLogsPageProps): Promise<Metadata> {
  const { username, counterId } = await params;

  // Get user by username
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));

  if (!user) {
    return {
      title: "Counter Not Found",
    };
  }

  // Get the specific counter
  const [counter] = await db
    .select()
    .from(countersTable)
    .where(
      and(eq(countersTable.id, counterId), eq(countersTable.userId, user.id))
    );

  if (!counter) {
    return {
      title: "Counter Not Found",
    };
  }

  return {
    title: `${counter.name} - ${user.name || user.username}'s Counter`,
    description: `View the activity log for ${counter.name} by ${
      user.name || user.username
    }`,
  };
}

export default async function CounterLogsPage({
  params,
}: CounterLogsPageProps) {
  const { username, counterId } = await params;

  // Get user by username
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));

  if (!user) {
    notFound();
  }

  // Get the specific counter
  const [counter] = await db
    .select()
    .from(countersTable)
    .where(
      and(eq(countersTable.id, counterId), eq(countersTable.userId, user.id))
    );

  if (!counter) {
    notFound();
  }

  // Get all log entries for this counter, ordered by most recent first
  const logs = await db
    .select()
    .from(counterItemsTable)
    .where(eq(counterItemsTable.counterId, counterId))
    .orderBy(desc(counterItemsTable.createdAt));

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with back button */}
      <div className="mb-6">
        <Link
          href={`/${username}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to {user.name || user.username}
          {"'s"} profile
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={user.image ?? "/default-avatar.png"}
            alt={`${user.name || user.username}'s avatar`}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{counter.name}</h1>
            <p className="text-gray-600">
              Counter by {user.name || user.username} (@{user.username})
            </p>
          </div>
        </div>

        {/* Current counter value */}
        <div className="bg-white p-6 rounded-lg border border-slate-300 mb-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Current Value</p>
            <div className="text-4xl font-bold text-blue-600">
              {counter.value}
            </div>
          </div>
        </div>
      </div>

      {/* Logs section */}
      <CounterLogs logs={logs} />
    </div>
  );
}
