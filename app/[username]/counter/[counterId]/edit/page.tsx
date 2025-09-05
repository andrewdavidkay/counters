import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import db from "@/db";
import { usersTable, countersTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import EditCounterForm from "@/components/edit-counter-form";

interface EditCounterPageProps {
  params: Promise<{
    username: string;
    counterId: string;
  }>;
}

export async function generateMetadata({
  params,
}: EditCounterPageProps): Promise<Metadata> {
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
    title: `Edit ${counter.name} - ${user.name || user.username}'s Counter`,
    description: `Edit the counter ${counter.name} by ${
      user.name || user.username
    }`,
  };
}

export default async function EditCounterPage({
  params,
}: EditCounterPageProps) {
  const { username, counterId } = await params;
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user?.id) {
    redirect("/");
  }

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

  // Check if the current user owns this counter
  if (counter.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header with back button */}
      <div className="mb-6">
        <Link
          href={`/${username}/counter/${counterId}`}
          className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full mb-4 transition-all duration-200 hover:translate-x-[-2px] transform"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 transition-transform duration-200" />
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={user.image ?? "/default-avatar.png"}
            alt={`${user.name || user.username}'s avatar`}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">Edit Counter</h1>
            <p className="text-gray-600">
              Counter by {user.name || user.username} (@{user.username})
            </p>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-lg border border-slate-300 p-6">
        <EditCounterForm counter={counter} username={username} />
      </div>
    </div>
  );
}
