"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-primary p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold cursor-pointer text-accent">
          <Link href="/">SillyLink</Link>
        </h1>
        <nav className="flex items-center space-x-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:underline text-secondary">
                Home
              </Link>
            </li>
            <li>
              <Link href="/analytics" className="hover:underline text-secondary">
                Analytics
              </Link>
            </li>
          </ul>
          {session ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hover:underline text-secondary cursor-pointer"
              >
                Sign Out
              </button>
              <span className="text-secondary">Hello, {session.user?.name}</span>
            </div>
          ) : (
            <Link
              href="/login"
              className="hover:underline text-secondary cursor-pointer"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}