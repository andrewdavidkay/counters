import { notFound } from "next/navigation";
import db from "@/db";
import { usersTable, countersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function Profile({ params }: ProfilePageProps) {
  const { username } = await params;

  // Get user by username
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));

  if (!user) {
    notFound();
  }

  // Get all counters for this user
  const counters = await db
    .select()
    .from(countersTable)
    .where(eq(countersTable.userId, user.id));

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {user.name || user.username}
        </h1>
        <p className="text-gray-600">@{user.username}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-slate-300 overflow-hidden">
        {counters.map((counter) => (
          <div
            key={counter.id}
            className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {counter.name}
              </h3>
            </div>
            <div className="ml-4">
              <span className="text-2xl font-bold text-blue-600">
                {counter.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {counters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No counters found for this user.
          </p>
        </div>
      )}
    </div>
  );
}
