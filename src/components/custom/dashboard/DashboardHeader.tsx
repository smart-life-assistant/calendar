"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, LogOut, Moon, Search, Settings, Sun, User } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface DashboardHeaderProps {
  session: Session;
}

export default function DashboardHeader({ session }: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount] = useState(3);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-30 shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search */}
        <motion.div
          className="flex-1 max-w-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <motion.input
              type="text"
              placeholder="Tìm kiếm... (Ctrl + K)"
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
              whileFocus={{ scale: 1.02 }}
            />
          </div>
        </motion.div>

        {/* Right side */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Dark Mode Toggle */}
          <motion.button
            className="rounded-lg p-2 hover:bg-white/50 transition-colors"
            onClick={() => setDarkMode(!darkMode)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {darkMode ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-5 w-5 text-yellow-600" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -180, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-5 w-5 text-gray-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Notifications */}
          <motion.button
            className="relative rounded-lg p-2 hover:bg-white/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell className="h-5 w-5 text-gray-600" />
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
          <div className="h-8 w-px bg-gray-300" />

          {/* User Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50 transition-all shadow-sm"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {session.user.username?.charAt(0).toUpperCase()}
              </motion.div>
              <div className="text-sm text-left hidden sm:block">
                <p className="font-semibold text-gray-900">
                  {session.user.username}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {session.user.role}
                </p>
              </div>
              <motion.svg
                className="h-4 w-4 text-gray-500"
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

            {/* Dropdown Menu */}
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
                    className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-2xl z-50 overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    {/* User Info */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-lg font-bold">
                          {session.user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {session.user.username}
                          </p>
                          <p className="text-xs text-blue-100">
                            {session.user.email ||
                              `${session.user.username}@calendar.app`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <motion.button
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        whileHover={{
                          x: 5,
                          backgroundColor: "rgba(249, 250, 251, 1)",
                        }}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Profile</p>
                          <p className="text-xs text-gray-500">
                            Xem thông tin cá nhân
                          </p>
                        </div>
                      </motion.button>

                      <motion.button
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        whileHover={{
                          x: 5,
                          backgroundColor: "rgba(249, 250, 251, 1)",
                        }}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                          <Settings className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Settings</p>
                          <p className="text-xs text-gray-500">
                            Cài đặt tài khoản
                          </p>
                        </div>
                      </motion.button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 py-2">
                      <motion.button
                        onClick={() => signOut({ redirectTo: "/login" })}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-700 hover:bg-red-50 transition-colors"
                        whileHover={{
                          x: 5,
                          backgroundColor: "rgba(254, 242, 242, 1)",
                        }}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                          <LogOut className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Đăng xuất</p>
                          <p className="text-xs text-red-600">
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
