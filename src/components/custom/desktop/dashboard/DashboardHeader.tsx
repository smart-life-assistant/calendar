"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useCommandPalette } from "./CommandPaletteProvider";
import { useTopLoader } from "nextjs-toploader";

interface DashboardHeaderProps {
  session: Session;
  onMenuClick?: () => void;
}

export default function DashboardHeader({
  session,
  onMenuClick,
}: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount] = useState(3);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const { setOpen } = useCommandPalette();
  const loader = useTopLoader();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 sticky top-0 z-30 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left side - Mobile menu + Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {/* Mobile Menu Button */}
          <motion.button
            onClick={onMenuClick}
            className="md:hidden rounded-lg p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </motion.button>

          {/* Search */}
          <motion.div
            className="flex-1 cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setOpen(true)}
          >
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              <motion.div
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-4 py-2 text-sm shadow-sm hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">
                    Tìm kiếm... (Ctrl + K)
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 sm:hidden">
                    Tìm kiếm...
                  </span>
                  <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex dark:text-gray-300">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right side */}
        <motion.div
          className="flex items-center gap-2 md:gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
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

          {/* Notifications */}
          <motion.button
            className="relative rounded-lg p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors hidden sm:block"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <AnimatePresence>
              {notificationCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    boxShadow: [
                      "0 0 0 0 rgba(239, 68, 68, 0.7)",
                      "0 0 0 10px rgba(239, 68, 68, 0)",
                    ],
                  }}
                  exit={{ scale: 0 }}
                  transition={{
                    boxShadow: {
                      duration: 1.5,
                      repeat: Infinity,
                    },
                  }}
                >
                  {notificationCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block" />

          {/* User Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 md:gap-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 md:px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {session.user.username?.charAt(0).toUpperCase()}
              </motion.div>
              <div className="text-sm text-left hidden lg:block">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {session.user.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {session.user.role}
                </p>
              </div>
              <motion.svg
                className="h-4 w-4 text-gray-500 dark:text-gray-400 hidden sm:block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: showUserMenu ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </motion.button>

            {/* Dropdown Menu - Rest of the code stays the same */}
            <AnimatePresence>
              {showUserMenu && (
                <>
                  <motion.div
                    className="fixed inset-0 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowUserMenu(false)}
                  />
                  <motion.div
                    className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{
                      type: "spring" as const,
                      stiffness: 300,
                      damping: 25,
                    }}
                  >
                    <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-lg font-bold">
                          {session.user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {session.user.username}
                          </p>
                          <p className="text-xs text-blue-100 capitalize">
                            {session.user.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <motion.button
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        whileHover={{ x: 5 }}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Profile</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Xem thông tin cá nhân
                          </p>
                        </div>
                      </motion.button>

                      <motion.button
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        whileHover={{ x: 5 }}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
                          <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Settings</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Cài đặt tài khoản
                          </p>
                        </div>
                      </motion.button>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 py-2">
                      <motion.button
                        onClick={() => {
                          loader.start();
                          signOut({ redirectTo: "/login" });
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
                          <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Đăng xuất</p>
                          <p className="text-xs text-red-600 dark:text-red-400">
                            Thoát khỏi tài khoản
                          </p>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
