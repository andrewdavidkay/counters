import { redirect } from "next/navigation";
import { ReactElement } from "react";
import { auth } from "@/auth";

export default async function User(): Promise<ReactElement> {
  const session = await auth();

  if (!session?.user?.username) {
    redirect("/new");
  }

  return <div>{session.user.name}</div>;
}
