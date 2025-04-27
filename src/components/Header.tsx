"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";

export default function Header() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Menu variants for animation
  const menuVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  return (
    <header className="bg-primary p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold cursor-pointer text-accent">
          <Link href="/">SillyLink</Link>
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
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

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-secondary p-2"
          aria-label="Toggle menu"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMenu}
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              ref={menuRef}
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              transition={{ type: "tween" }}
              className="fixed left-0 top-0 h-full w-64 bg-primary shadow-lg z-50"
            >
              <div className="p-4 flex flex-col h-full bg-white">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-accent">Menu</h2>
                  <button
                    onClick={closeMenu}
                    className="text-secondary p-2"
                    aria-label="Close menu"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <ul className="flex flex-col space-y-4 flex-1">
                  <li>
                    <Link
                      href="/"
                      className="hover:underline text-secondary"
                      onClick={closeMenu}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/analytics"
                      className="hover:underline text-secondary"
                      onClick={closeMenu}
                    >
                      Analytics
                    </Link>
                  </li>
                  {session ? (
                    <>
                      <li>
                        <button
                          onClick={() => {
                            closeMenu();
                            signOut({ callbackUrl: "/" });
                          }}
                          className="hover:underline text-secondary cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </li>
                      <li className="text-secondary mt-auto">
                        Hello, {session.user?.name}
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link
                        href="/login"
                        className="hover:underline text-secondary"
                        onClick={closeMenu}
                      >
                        Sign In
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}