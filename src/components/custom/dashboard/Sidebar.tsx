"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  Clock,
  Home,
  Settings,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
    title: "Ngày lễ",
    icon: Star,
    href: "/dashboard/holidays",
  },
  {
    title: "Thống kê",
    icon: TrendingUp,
    href: "/dashboard/stats",
  },
  {
    title: "Lịch sử",
    icon: Clock,
    href: "/dashboard/history",
  },
  {
    title: "Người dùng",
    icon: Users,
    href: "/dashboard/users",
  },
  {
    title: "Cài đặt",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const sidebarVariants = {
    expanded: {
      width: "16rem",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    collapsed: {
      width: "5rem",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.05,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  return (
    <motion.aside
      className="sticky top-16 h-[calc(100vh-4rem)] border-r border-gray-200 bg-white flex flex-col hidden md:flex overflow-hidden"
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      initial={false}
    >
      {/* Sidebar Header */}
      <div
        className={`flex h-16 items-center border-b border-gray-200 px-4 flex-shrink-0 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              className="flex items-center gap-2 overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-2"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <CalendarDays className="h-5 w-5 text-white" />
              </motion.div>
              <span className="font-semibold text-gray-900 whitespace-nowrap">
                Dashboard
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 hover:bg-gray-100 transition-colors flex-shrink-0"
          aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </motion.div>
        </motion.button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <motion.div
              key={item.href}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative overflow-hidden",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.title : undefined}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-blue-50"
                    layoutId="activeTab"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
                <motion.div
                  className="relative z-10 flex-shrink-0"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon
                    className={cn("h-5 w-5", isActive && "text-blue-600")}
                  />
                </motion.div>
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      className="relative z-10 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            className="p-4 border-t border-gray-200 flex-shrink-0"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-100"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Star className="h-4 w-4 text-blue-600" />
                </motion.div>
                <span className="text-sm font-semibold text-blue-900">
                  Pro Tip
                </span>
              </div>
              <p className="text-xs text-blue-700">
                Nhấn Ctrl + K để mở quick search
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
