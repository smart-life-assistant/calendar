"use client";

import { cn } from "@/lib/utils";
import { Moon, Sparkles, Star } from "lucide-react";
import { memo } from "react";

interface SpecialDate {
  id: string;
  name: string;
  description?: string;
  date_type: "lunar" | "solar";
  day: number;
  month: number;
  year?: number;
  is_holiday: boolean;
  is_recurring: boolean;
  is_public: boolean;
}

interface CalendarDayProps {
  date: Date;
  lunar: {
    day: number;
    month: number;
    year: number;
    isLeapMonth: boolean;
  };
  canChi: string;
  events: SpecialDate[];
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: () => void;
}

function CalendarDayMobile({
  date,
  lunar,
  events,
  isCurrentMonth,
  isToday,
  onClick,
}: CalendarDayProps) {
  const hasHoliday = events.some((e) => e.is_holiday);
  const hasEvent = events.length > 0;

  return (
    <div
      className={cn(
        "relative h-full w-full border rounded-md p-1.5 cursor-pointer transition-colors active:scale-95",
        isCurrentMonth && [
          "bg-white dark:bg-gray-800",
          "border-gray-200 dark:border-gray-700",
        ],
        !isCurrentMonth && [
          "bg-gray-50/50 dark:bg-gray-900/50",
          "border-gray-200 dark:border-gray-700",
          "opacity-70",
        ],
        isToday &&
          "ring-1 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900",
        hasHoliday && isCurrentMonth && "bg-red-50/50 dark:bg-red-950/20",
      )}
      onClick={onClick}
    >
      {/* Date Number */}
      <div className="flex items-start justify-between mb-1">
        <div
          className={cn(
            "text-base font-bold leading-none",
            isCurrentMonth && isToday && "text-blue-600 dark:text-blue-400",
            isCurrentMonth &&
              hasHoliday &&
              !isToday &&
              "text-red-600 dark:text-red-400",
            isCurrentMonth &&
              !isToday &&
              !hasHoliday &&
              "text-gray-900 dark:text-gray-100",
            !isCurrentMonth && "font-normal text-gray-600 dark:text-gray-500",
          )}
        >
          {date.getDate()}
        </div>
        <div className="flex gap-0.5">
          {hasHoliday && <Star className="h-3 w-3 text-red-500 fill-red-500" />}
          {hasEvent && !hasHoliday && (
            <Sparkles className="h-3 w-3 text-green-500 fill-green-500" />
          )}
        </div>
      </div>

      {/* Lunar Date - Optimized for mobile */}
      <div className="flex items-center gap-0.5 mb-1 min-w-0">
        <Moon className="h-2 w-2 text-amber-500 shrink-0" />
        <div className="text-[9px] font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {lunar.day}/{lunar.month}
        </div>
      </div>

      {/* Events Preview */}
      {events.length > 0 && (
        <div className="text-[9px] text-muted-foreground font-medium truncate">
          {events[0].is_holiday ? "🎉" : "📌"}{" "}
          {events.length > 1
            ? `${events.length} sự kiện`
            : events[0].name.substring(0, 10) + "..."}
        </div>
      )}

      {/* Today indicator */}
      {isToday && (
        <div className="absolute top-1 right-1">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        </div>
      )}
    </div>
  );
}

export default memo(CalendarDayMobile);
