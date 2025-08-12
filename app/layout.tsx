import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react"; // or "@auth/next/client" for Auth.js v5
import Link from "next/link";
import { auth } from "@/auth";
import SignIn from "@/components/sign-in";
import SignOut from "@/components/sign-out";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Counters",
  description: "a place to count things",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: "red !important" }}
      >
        {/* Temporary debug - remove this later */}
        <div
          style={{
            background: "yellow",
            padding: "10px",
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          DEBUG: If you see this yellow bar, CSS is loading
        </div>
        <SessionProvider>
          <header className="border border-slate-300">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/" className="font-semibold">
                Counters
              </Link>
              <div className="flex items-center gap-3">
                {session?.user ? (
                  <>
                    <Link href={`/${session.user.username}`}>
                      <img
                        src={session.user.image ?? "/default-avatar.png"}
                        alt={`${
                          session.user.name || session.user.username
                        }'s avatar`}
                        className="w-8 h-8 rounded-full"
                      />
                    </Link>
                    <SignOut />
                  </>
                ) : (
                  <SignIn size="small" />
                )}
              </div>
            </div>
          </header>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
