"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Moon, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";

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
  yearCanChi: string;
  events: SpecialDate[];
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: () => void;
}

export default function CalendarDay({
  date,
  lunar,
  canChi,
  yearCanChi,
  events,
  isCurrentMonth,
  isToday,
  onClick,
}: CalendarDayProps) {
  const hasHoliday = events.some((e) => e.is_holiday);
  const hasEvent = events.length > 0;

  // Detect if device supports hover (desktop) or is touch-only (mobile/tablet)
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if device is touch-only (mobile/tablet)
    const checkTouchDevice = () => {
      // Check if touch is primary input AND hover is not available
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const hasHover = window.matchMedia("(hover: hover)").matches;
      setIsTouchDevice(hasTouch && !hasHover);
    };

    checkTouchDevice();

    // Re-check on window resize (for device rotation)
    window.addEventListener("resize", checkTouchDevice);
    return () => window.removeEventListener("resize", checkTouchDevice);
  }, []);

  // Disable HoverCard on touch devices (mobile/tablet)
  const HoverWrapper = isTouchDevice ? "div" : HoverCard;
  const TriggerWrapper = isTouchDevice ? "div" : HoverCardTrigger;

  return (
    <HoverWrapper
      {...(!isTouchDevice && { openDelay: 200, closeDelay: 100 })}
      className="h-full"
    >
      <TriggerWrapper
        {...(!isTouchDevice && { asChild: true })}
        className="h-full"
      >
        <motion.div
          className={cn(
            "relative h-full w-full border border-gray-200 dark:border-gray-700 rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-3 cursor-pointer transition-all hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600",
            !isCurrentMonth && "bg-gray-50/50 dark:bg-gray-900/50 opacity-60",
            isCurrentMonth && "bg-white dark:bg-gray-800",
            isToday &&
              "ring-1 sm:ring-2 ring-blue-500 ring-offset-1 sm:ring-offset-2 dark:ring-offset-gray-900",
            hasHoliday &&
              "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20"
          )}
          onClick={onClick}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
        >
          {/* Date Number with modern design - Responsive */}
          <div className="flex items-start justify-between mb-1 sm:mb-2">
            <div
              className={cn(
                "text-base sm:text-xl md:text-2xl font-bold tracking-tight transition-colors leading-none",
                !isCurrentMonth && "text-gray-400 dark:text-gray-600",
                isToday && "text-blue-600 dark:text-blue-400",
                hasHoliday && !isToday && "text-red-600 dark:text-red-400",
                isCurrentMonth &&
                  !isToday &&
                  !hasHoliday &&
                  "text-gray-900 dark:text-gray-100"
              )}
            >
              {date.getDate()}
            </div>
            <div className="flex gap-0.5 sm:gap-1">
              {hasHoliday && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 fill-red-500" />
                </motion.div>
              )}
              {hasEvent && !hasHoliday && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 fill-green-500" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Lunar Date with icon - Responsive */}
          <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-3">
            <Moon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-500 shrink-0" />
            <div className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
              {lunar.day}/{lunar.month}
              {lunar.isLeapMonth && (
                <Badge
                  variant="outline"
                  className="ml-0.5 sm:ml-1 text-[8px] sm:text-[10px] px-0.5 sm:px-1 py-0 hidden sm:inline-flex"
                >
                  nhuận
                </Badge>
              )}
            </div>
          </div>

          {/* Events Preview with better styling - Responsive */}
          {events.length > 0 && (
            <div className="space-y-1 sm:space-y-1.5">
              {/* Show only 1 event on mobile, 2 on larger screens */}
              {events.slice(0, 1).map((event, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="hidden sm:block"
                >
                  <Badge
                    variant={event.is_holiday ? "destructive" : "default"}
                    className="w-full justify-start truncate text-[10px] sm:text-xs font-normal py-0 sm:py-0.5"
                  >
                    <span className="hidden sm:inline">
                      {event.is_holiday ? "🎉" : "📌"}{" "}
                    </span>
                    {event.name}
                  </Badge>
                </motion.div>
              ))}
              {/* Mobile: just show count */}
              <div className="text-[9px] sm:hidden text-muted-foreground font-medium truncate">
                {events[0].is_holiday ? "🎉" : "📌"}{" "}
                {events.length > 1
                  ? `${events.length} sự kiện`
                  : events[0].name.substring(0, 12) + "..."}
              </div>
              {/* Desktop: show second event if exists */}
              {events.length > 1 &&
                events.slice(1, 2).map((event, idx) => (
                  <motion.div
                    key={idx + 1}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (idx + 1) * 0.1 }}
                    className="hidden md:block"
                  >
                    <Badge
                      variant={event.is_holiday ? "destructive" : "default"}
                      className="w-full justify-start truncate text-xs font-normal"
                    >
                      {event.is_holiday ? "🎉" : "📌"} {event.name}
                    </Badge>
                  </motion.div>
                ))}
              {events.length > 2 && (
                <div className="text-[9px] sm:text-[11px] text-muted-foreground font-medium pl-0.5 sm:pl-1 hidden md:block">
                  +{events.length - 2} khác
                </div>
              )}
              {events.length > 1 && (
                <div className="text-[9px] sm:text-[11px] text-muted-foreground font-medium pl-0.5 sm:pl-1 hidden sm:block md:hidden">
                  +{events.length - 1} khác
                </div>
              )}
            </div>
          )}

          {/* Today indicator - Responsive */}
          {isToday && (
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
          )}
        </motion.div>
      </TriggerWrapper>

      {!isTouchDevice && (
        <HoverCardContent
          className="w-80 p-0 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          side="top"
          align="center"
          sideOffset={8}
        >
          <Card className="border-0 shadow-none">
            <div className="p-4 space-y-3">
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">
                    {date.getDate()} tháng {date.getMonth() + 1}
                  </h3>
                  {isToday && (
                    <Badge variant="default" className="bg-blue-500">
                      Hôm nay
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {date.getFullYear()}
                </p>
              </div>

              {/* Lunar info */}
              <div className="space-y-2">
                {/* Lunar Date Card */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 shadow-sm">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Moon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-semibold text-amber-900 dark:text-amber-100">
                      Âm lịch
                    </span>
                  </div>
                  <p className="text-lg font-bold text-amber-900 dark:text-amber-100">
                    {lunar.day}/{lunar.month}/{lunar.year}
                  </p>
                  {lunar.isLeapMonth && (
                    <Badge
                      variant="outline"
                      className="text-[10px] mt-1.5 px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700"
                    >
                      🌙 Tháng nhuận
                    </Badge>
                  )}
                </div>

                {/* Can Chi Cards */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 shadow-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                      <span className="text-[10px] font-semibold text-purple-900 dark:text-purple-100">
                        Ngày
                      </span>
                    </div>
                    <p className="text-sm font-bold text-purple-900 dark:text-purple-100">
                      {canChi}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border border-indigo-200 dark:border-indigo-800 shadow-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
                      <span className="text-[10px] font-semibold text-indigo-900 dark:text-indigo-100">
                        Năm
                      </span>
                    </div>
                    <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100">
                      {yearCanChi}
                    </p>
                  </div>
                </div>
              </div>

              {/* Events */}
              {events.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Sự kiện ({events.length})
                  </h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {events.map((event, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "p-2 rounded-md text-sm border",
                          event.is_holiday
                            ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-900 dark:text-red-100"
                            : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-100"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-base">
                            {event.is_holiday ? "🎉" : "📌"}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{event.name}</p>
                            {event.description && (
                              <p className="text-xs opacity-75 mt-0.5">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {events.length === 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  Không có sự kiện
                </div>
              )}

              {/* Footer hint */}
              <div className="pt-2 border-t">
                <p className="text-xs text-center text-muted-foreground">
                  Click để xem chi tiết đầy đủ
                </p>
              </div>
            </div>
          </Card>
        </HoverCardContent>
      )}
    </HoverWrapper>
  );
}
