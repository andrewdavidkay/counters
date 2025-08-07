import { ReactElement } from "react";
import { auth } from "@/auth";
import Link from "next/link";

export default async function User(): Promise<ReactElement> {
  const session = await auth();

  return (
    <div>
      <Link href={`/${session?.user.username}`}>
        <img src={session?.user.image ?? undefined} width={100} height={100} />
      </Link>
      <div>
        username:{" "}
        <Link href={`/${session?.user.username}`}>
          {session?.user.username}
        </Link>
      </div>
    </div>
  );
}
