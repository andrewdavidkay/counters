import { auth } from "@/auth";
import db from "@/db";
import { countersTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import SignIn from "@/components/sign-in";
import CountersClient from "@/components/counters-client";

export default async function Home() {
  const session = await auth();

  // Get total count of all counters
  const [totalCounters] = await db
    .select({ count: sql<number>`count(*)` })
    .from(countersTable);

  if (!session?.user?.id) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Track what matters to you
        </h1>
        <p className="text-center text-gray-600 mb-8 text-lg">
          <span className="text-blue-600 font-semibold">
            {totalCounters.count}
          </span>{" "}
          counters created
        </p>
        <div className="flex justify-center">
          <SignIn size="large" />
        </div>
      </div>
    );
  }

  const counters = await db
    .select()
    .from(countersTable)
    .where(eq(countersTable.userId, session.user.id));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Your counters</h1>
      <CountersClient initialCounters={counters} />
    </div>
  );
}
