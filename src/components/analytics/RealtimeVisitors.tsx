"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Eye } from "lucide-react";

export default function RealtimeVisitors() {
  const [activeUsers, setActiveUsers] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        const response = await fetch("/api/analytics/realtime");
        const data = await response.json();
        setActiveUsers(data.activeUsers || 0);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch realtime data:", error);
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchRealtimeData();

    // Poll every 30 seconds
    const interval = setInterval(fetchRealtimeData, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading || activeUsers === null) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.div
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Animated pulse indicator */}
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-green-500/30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative w-3 h-3 rounded-full bg-green-500" />
          </div>

          {/* Content */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 leading-none">
                Đang online
              </span>
              <motion.span
                key={activeUsers}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-none mt-0.5"
              >
                {activeUsers}
              </motion.span>
            </div>
          </div>

          {/* Icon indicator */}
          <Eye className="h-4 w-4 text-blue-500" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
