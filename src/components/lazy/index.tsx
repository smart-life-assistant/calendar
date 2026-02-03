"use client";

import dynamic from "next/dynamic";

// Lazy load heavy components with loading states
export const LazyAddEventModal = dynamic(
  () => import("@/components/custom/desktop/calendar/AddEventModal"),
  {
    loading: () => (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-card rounded-2xl p-8 flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Đang tải...</span>
        </div>
      </div>
    ),
    ssr: false,
  },
);

export const LazyCalendarDetailModal = dynamic(
  () => import("@/components/custom/desktop/calendar/CalendarDetailModal"),
  {
    loading: () => (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-card rounded-2xl p-8 flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Đang tải...</span>
        </div>
      </div>
    ),
    ssr: false,
  },
);

// Lazy load mobile components
export const LazyMobileCalendarPage = dynamic(
  () => import("@/components/custom/mobile/calendar/CalendarPage"),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Đang tải lịch...</p>
        </div>
      </div>
    ),
    ssr: false,
  },
);

export const LazyDesktopCalendarPage = dynamic(
  () => import("@/components/custom/desktop/calendar/CalendarPage"),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Đang tải lịch...</p>
        </div>
      </div>
    ),
    ssr: false,
  },
);
