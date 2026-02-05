"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  Home,
  Settings,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

interface SidebarContentProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  setMobileOpen?: (open: boolean) => void;
  pathname: string;
  itemVariants: {
    hidden: { opacity: number; x: number };
    visible: (custom: number) => {
      opacity: number;
      x: number;
      transition: {
        delay: number;
        type: "spring";
        stiffness: number;
      };
    };
  };
}

const SidebarContent = ({
  collapsed,
  setCollapsed,
  setMobileOpen,
  pathname,
  itemVariants,
}: SidebarContentProps) => (
  <>
    {/* Sidebar Header */}
    <div
      className={`flex h-16 items-center border-b border-gray-200 dark:border-gray-700 px-4 shrink-0 ${
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
                className="rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 p-2"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <CalendarDays className="h-5 w-5 text-white" />
              </motion.div>
              <span className="font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                Dashboard
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => {
            if (setMobileOpen && window.innerWidth < 768) {
              setMobileOpen(false);
            } else {
              setCollapsed(!collapsed);
            }
          }}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
          aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {setMobileOpen && window.innerWidth < 768 ? (
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
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
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                  collapsed && "justify-center px-2",
                )}
                title={collapsed ? item.title : undefined}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30"
                    layoutId="activeTab"
                    transition={{
                      type: "spring" as const,
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
                <motion.div
                  className="relative z-10 shrink-0"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive && "text-blue-600 dark:text-blue-400",
                    )}
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
            className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="rounded-lg bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 border border-blue-100 dark:border-blue-800"
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
                  <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                  Pro Tip
                </span>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Nhấn Ctrl + K để mở quick search
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
);

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  }, [pathname, setMobileOpen]);

  const sidebarVariants = {
    expanded: {
      width: "16rem",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
    collapsed: {
      width: "5rem",
      transition: {
        type: "spring" as const,
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
        type: "spring" as const,
        stiffness: 100,
      },
    }),
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className="sticky top-16 h-[calc(100vh-4rem)] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-col hidden md:flex overflow-hidden"
        variants={sidebarVariants}
        animate={collapsed ? "collapsed" : "expanded"}
        initial={false}
      >
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setMobileOpen={setMobileOpen}
          pathname={pathname}
          itemVariants={itemVariants}
        />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen && setMobileOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
              className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col md:hidden overflow-hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring" as const,
                stiffness: 300,
                damping: 30,
              }}
            >
              <SidebarContent
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                setMobileOpen={setMobileOpen}
                pathname={pathname}
                itemVariants={itemVariants}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
