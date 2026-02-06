"use client";

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
import { useTheme } from "next-themes";
import { memo, useCallback, useEffect, useState } from "react";
import { useCommandPalette } from "../../desktop/dashboard/CommandPaletteProvider";
import { useSignOut } from "@/hooks/useSignOut";

interface DashboardHeaderProps {
  session: Session;
  onMenuClick?: () => void;
}

function DashboardHeaderMobile({ session, onMenuClick }: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount] = useState(3);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const { setOpen } = useCommandPalette();
  const { signOut: handleSignOut, isSigningOut } = useSignOut({
    redirectTo: "/login",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const handleSearchClick = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleUserMenuToggle = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-30 shadow-sm">
      <div className="flex h-14 items-center justify-between px-3">
        {/* Left side - Mobile menu + Search */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Search */}
          <div className="flex-1 cursor-pointer" onClick={handleSearchClick}>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <div className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-9 pr-3 py-2 text-sm shadow-sm active:scale-[0.99] transition-transform cursor-pointer">
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  Tìm kiếm...
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            suppressHydrationWarning
          >
            {mounted ? (
              currentTheme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )
            ) : (
              <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all hidden sm:block">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={handleUserMenuToggle}
              className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold">
                {session.user.username?.charAt(0).toUpperCase()}
              </div>
              <svg
                className="h-4 w-4 text-gray-500 hidden sm:block"
                style={{
                  transform: showUserMenu ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-hidden">
                  <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
                        {session.user.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{session.user.username}</p>
                        <p className="text-xs text-blue-100 capitalize">
                          {session.user.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98] transition-all"
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
                    </button>

                    <button
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98] transition-all"
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
                    </button>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 py-2">
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(DashboardHeaderMobile);
