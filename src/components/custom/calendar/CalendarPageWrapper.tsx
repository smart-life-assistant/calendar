"use client";

import { useDeviceType } from "@/hooks/useDeviceType";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamic imports for code splitting
const CalendarPageDesktop = dynamic(
  () => import("@/components/custom/desktop/calendar/CalendarPage"),
  {
    loading: () => <CalendarSkeleton />,
  }
);

const CalendarPageMobile = dynamic(
  () => import("@/components/custom/mobile/calendar/CalendarPage"),
  {
    loading: () => <CalendarSkeleton />,
  }
);

// Tablet can use mobile or desktop depending on preference
// For now, use mobile version for tablet as well
const CalendarPageTablet = CalendarPageMobile;

function CalendarSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gray-300 dark:bg-gray-700 w-12 h-12 rounded-xl" />
              <div className="space-y-2">
                <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            </div>
            <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded-xl" />
          </div>

          {/* Selectors Skeleton */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          </div>

          {/* Navigation Skeleton */}
          <div className="flex items-center gap-3 mb-4 h-14 bg-gray-200 dark:bg-gray-800 rounded-xl" />

          {/* Today Button Skeleton */}
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-xl" />
        </div>

        {/* Calendar Grid Skeleton */}
        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg overflow-hidden">
          {/* Week Headers */}
          <div className="grid grid-cols-7 border-b border-border/50 bg-gray-100 dark:bg-gray-900">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="p-3 text-center">
                <div className="h-4 w-8 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2 p-4 bg-muted/20">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CalendarPageWrapper() {
  const deviceType = useDeviceType();

  return (
    <Suspense fallback={<CalendarSkeleton />}>
      {deviceType === "mobile" && <CalendarPageMobile />}
      {deviceType === "tablet" && <CalendarPageTablet />}
      {deviceType === "desktop" && <CalendarPageDesktop />}
    </Suspense>
  );
}
