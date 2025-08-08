import { auth } from "@/auth";
import db from "@/db";
import { countersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import SignIn from "@/components/sign-in";
import CountersClient from "@/components/counters-client";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Welcome</h1>
        <div className="flex justify-center">
          <SignIn />
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
