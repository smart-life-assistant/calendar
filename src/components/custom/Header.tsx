"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, LogOut, Menu, Moon, Sun, User, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const { theme, setTheme, systemTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <CalendarDays className="h-6 w-6 text-blue-600" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Lịch Việt
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav
          className="hidden md:flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/calendar"
            className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            Xem lịch
          </Link>

          {/* Dark Mode Toggle */}
          <motion.button
            className="rounded-lg p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle theme"
            suppressHydrationWarning
          >
            {mounted && (
              <AnimatePresence mode="wait">
                {currentTheme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5 text-yellow-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -180, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
            {!mounted && (
              <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}
          </motion.button>

          {session ? (
            <>
              <motion.div
                className="flex items-center gap-2 rounded-xl bg-accent/50 px-4 py-2 border"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">
                  {session.user.username}
                </span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                >
                  Dashboard
                </Link>
              </motion.div>
              <motion.button
                onClick={() => signOut({ redirectTo: "/login" })}
                className="inline-flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/20 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors border border-red-200 dark:border-red-900"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </motion.button>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/login"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
              >
                Đăng nhập
              </Link>
            </motion.div>
          )}
        </motion.nav>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: 90 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: -90 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-gray-200 bg-white"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {session ? (
                <>
                  <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-3">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {session.user.username}
                    </span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ redirectTo: "/login" });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
