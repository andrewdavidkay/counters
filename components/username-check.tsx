// components/username-check.tsx (Client Component)
"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react"; // or your session hook

export default function UsernameCheck() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (
      status === "authenticated" &&
      !session?.user?.username &&
      pathname !== "/new"
    ) {
      window.location.href = "/new";
    }
  }, [session, pathname]);

  return null; // This component only handles redirect logic
}
