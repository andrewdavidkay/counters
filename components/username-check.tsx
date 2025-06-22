// components/username-check.tsx (Client Component)
"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react"; // or your session hook
import { useRouter, usePathname } from "next/navigation";

export default function UsernameCheck() {
  const pathname = usePathname();
  const { data: session, status, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.username &&
      pathname !== "/new"
    ) {
      console.log("user", session.user);
      update().then(() => {
        //router.replace("/new");
      });
    }
  }, [status, session?.user?.username, update, router]);

  return null; // This component only handles redirect logic
}
