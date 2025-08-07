import { notFound } from "next/navigation";
import db from "@/db";
import { usersTable, countersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default async function Profile({ params }: ProfilePageProps) {
  const { username } = params;

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
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {user.name || user.username}
        </h1>
        <p className="text-gray-600">@{user.username}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {counters.map((counter) => (
          <div
            key={counter.id}
            className="bg-white p-6 rounded-lg shadow-md border"
          >
            <h3 className="text-xl font-semibold mb-2">{counter.name}</h3>
            <p className="text-3xl font-bold text-blue-600">{counter.value}</p>
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
