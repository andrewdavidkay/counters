import { ReactElement } from "react";
import { auth } from "@/auth";

export default async function User(): Promise<ReactElement> {
  const session = await auth();

  return (
    <div>
      <img src={session?.user.image ?? undefined} width={100} height={100} />
      <div>username: {session?.user.username}</div>
    </div>
  );
}
