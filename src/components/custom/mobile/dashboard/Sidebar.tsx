"use client";

import { cn } from "@/lib/utils";
import { CalendarDays, Home, Settings, Star, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useEffect } from "react";

const menuItems = [
  {
    title: "Tổng quan",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Lịch",
    icon: CalendarDays,
    href: "/dashboard/calendar",
  },
  {
    title: "Sự kiện & Ngày lễ",
    icon: Star,
    href: "/dashboard/holidays",
  },
  {
    title: "Cài đặt",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

function SidebarMobile({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  }, [pathname, setMobileOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen && setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 shrink-0 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          mobileOpen ? "flex translate-x-0" : "hidden md:flex -translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-14 items-center border-b border-gray-200 dark:border-gray-700 px-4 shrink-0 justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-2">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Dashboard
            </span>
          </div>

          <button
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all md:hidden"
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium active:scale-95 transition-all relative",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 rounded-lg" />
                )}
                <Icon
                  className={cn(
                    "h-5 w-5 relative z-10",
                    isActive && "text-blue-600 dark:text-blue-400"
                  )}
                />
                <span className="relative z-10">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 shrink-0">
          <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-full bg-blue-600 h-2 w-2 animate-pulse" />
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                Hệ thống hoạt động tốt
              </p>
            </div>
            <p className="text-[10px] text-blue-700 dark:text-blue-300">
              📅 Lịch Việt Nam v2.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default memo(SidebarMobile);
