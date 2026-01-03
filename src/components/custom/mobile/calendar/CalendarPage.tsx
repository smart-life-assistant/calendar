"use client";

import AddEventModal from "@/components/custom/desktop/calendar/AddEventModal";
import CalendarDayMobile from "@/components/custom/mobile/calendar/CalendarDay";
import CalendarDetailModalMobile from "@/components/custom/mobile/calendar/CalendarDetailModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  convertSolar2Lunar,
  getCanChi,
  getYearCanChiString,
  hasLeapMonth,
} from "@/lib/lunar-calendar";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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

export default function CalendarPageMobile() {
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SpecialDate | null>(null);
  const [addEventDate, setAddEventDate] = useState<Date | null>(null);

  const currentYear = new Date().getFullYear();
  const startYear = 2000;
  const endYear = currentYear + 10;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(year));
    setCurrentDate(newDate);
  };

  const handleMonthChange = (month: string) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(month) - 1);
    setCurrentDate(newDate);
  };

  const fetchSpecialDates = useCallback(async () => {
    try {
      const response = await fetch("/api/special-dates");
      if (!response.ok) {
        throw new Error("Failed to fetch special dates");
      }
      const data = await response.json();
      setSpecialDates(data);
    } catch (error) {
      console.error("Error fetching special dates:", error);
      toast.error("Không thể tải dữ liệu sự kiện. Vui lòng thử lại sau!");
      setSpecialDates([]);
    }
  }, []);

  useEffect(() => {
    void fetchSpecialDates();
  }, [fetchSpecialDates]);

  const handleAddEvent = useCallback((date?: Date) => {
    setAddEventDate(date || null);
    setEditingEvent(null);
    setShowAddModal(true);
  }, []);

  const handleEditEvent = useCallback((event: SpecialDate) => {
    setEditingEvent(event);
    setAddEventDate(null);
    setShowAddModal(true);
  }, []);

  const handleDeleteEvent = useCallback((eventId: string) => {
    setSpecialDates((prev) => prev.filter((e) => e.id !== eventId));
  }, []);

  const handleModalSuccess = useCallback(() => {
    fetchSpecialDates();
    setShowAddModal(false);
    setEditingEvent(null);
    setAddEventDate(null);
  }, [fetchSpecialDates]);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setEditingEvent(null);
    setAddEventDate(null);
  }, []);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const getLunarDate = useCallback((date: Date) => {
    const lunar = convertSolar2Lunar(
      date.getDate(),
      date.getMonth() + 1,
      date.getFullYear()
    );
    return {
      day: lunar.day,
      month: lunar.month,
      year: lunar.year,
      isLeapMonth: lunar.isLeapMonth,
    };
  }, []);

  const getDayCanChi = useCallback((date: Date) => {
    const canChi = getCanChi(
      date.getDate(),
      date.getMonth() + 1,
      date.getFullYear()
    );
    return canChi.day;
  }, []);

  const getYearCanChi = useCallback(
    (date: Date) => {
      const lunar = getLunarDate(date);
      return getYearCanChiString(lunar.year);
    },
    [getLunarDate]
  );

  const getMonthCanChi = useCallback((date: Date) => {
    const canChi = getCanChi(
      date.getDate(),
      date.getMonth() + 1,
      date.getFullYear()
    );
    return canChi.month;
  }, []);

  const currentMonthLunar = useMemo(() => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lunar = getLunarDate(firstDayOfMonth);
    const monthCanChi = getMonthCanChi(firstDayOfMonth);
    const yearCanChi = getYearCanChi(firstDayOfMonth);
    const isYearLeap = hasLeapMonth(lunar.year) > 0;
    return {
      lunarMonth: lunar.month,
      lunarYear: lunar.year,
      isLeapMonth: lunar.isLeapMonth,
      isYearLeap,
      monthCanChi,
      yearCanChi,
    };
  }, [currentDate, getLunarDate, getMonthCanChi, getYearCanChi]);

  const getEventsForDate = useCallback(
    (date: Date) => {
      const lunar = getLunarDate(date);
      return specialDates.filter((event) => {
        if (event.date_type === "solar") {
          return (
            event.day === date.getDate() &&
            event.month === date.getMonth() + 1 &&
            (event.is_recurring || event.year === date.getFullYear())
          );
        } else {
          return (
            event.day === lunar.day &&
            event.month === lunar.month &&
            (event.is_recurring || event.year === lunar.year)
          );
        }
      });
    },
    [specialDates, getLunarDate]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-3">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Lịch Việt Nam
                </h1>
                <p className="text-xs text-muted-foreground">
                  Âm dương lịch 🇻🇳
                </p>
              </div>
            </div>
            {session && (
              <button
                onClick={() => handleAddEvent()}
                className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg active:scale-95 transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Thêm</span>
              </button>
            )}
          </div>

          {/* Year & Month Selectors */}
          <div className="flex gap-2 mb-3">
            <div className="flex items-center gap-2 bg-background/60 rounded-xl px-3 py-2 border border-border/50 flex-1">
              <label className="text-xs font-medium whitespace-nowrap">
                📅 Năm:
              </label>
              <Select
                value={currentDate.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-full border-0 bg-transparent focus:ring-0 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 bg-background/60 rounded-xl px-3 py-2 border border-border/50 flex-1">
              <label className="text-xs font-medium whitespace-nowrap">
                🗓️ Tháng:
              </label>
              <Select
                value={(currentDate.getMonth() + 1).toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="w-full border-0 bg-transparent focus:ring-0 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      T{month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center gap-2 justify-between bg-background/60 rounded-xl border border-border/50 p-1">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 rounded-lg hover:bg-accent transition-colors active:scale-95"
              aria-label="Tháng trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-center flex-1">
              <div className="font-bold text-sm mb-0.5">
                Tháng {format(currentDate, "MM/yyyy")}
              </div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                🌙 Tháng {currentMonthLunar.lunarMonth}{" "}
                {currentMonthLunar.isLeapMonth && "nhuận"}{" "}
                {currentMonthLunar.yearCanChi}
                {currentMonthLunar.isYearLeap && " nhuận"}
              </div>
            </div>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 rounded-lg hover:bg-accent transition-colors active:scale-95"
              aria-label="Tháng sau"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg active:scale-95 transition-all"
          >
            📅 Hôm nay
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border/50 bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => (
              <div key={day} className="p-2 text-center">
                <span
                  className={`font-bold text-xs ${
                    index === 5
                      ? "text-blue-600 dark:text-blue-400"
                      : index === 6
                      ? "text-red-600 dark:text-red-400"
                      : "text-foreground"
                  }`}
                >
                  {day}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5 p-1 bg-muted/20">
            {calendarDays.map((date, index) => {
              const lunar = getLunarDate(date);
              const canChi = getDayCanChi(date);
              const events = getEventsForDate(date);
              return (
                <div key={index} className="min-h-[85px]">
                  <CalendarDayMobile
                    date={date}
                    lunar={lunar}
                    canChi={canChi}
                    events={events}
                    isCurrentMonth={isSameMonth(date, currentDate)}
                    isToday={isToday(date)}
                    onClick={() => setSelectedDate(date)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedDate && (
        <CalendarDetailModalMobile
          date={selectedDate}
          lunar={getLunarDate(selectedDate)}
          canChi={getDayCanChi(selectedDate)}
          monthCanChi={getMonthCanChi(selectedDate)}
          yearCanChi={getYearCanChi(selectedDate)}
          isYearLeap={hasLeapMonth(getLunarDate(selectedDate).year) > 0}
          events={getEventsForDate(selectedDate)}
          onClose={() => setSelectedDate(null)}
          isAuthenticated={!!session}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onAddNew={() => handleAddEvent(selectedDate)}
        />
      )}

      {showAddModal && (
        <AddEventModal
          isOpen={showAddModal}
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          selectedDate={addEventDate}
          editingEvent={editingEvent}
        />
      )}
    </div>
  );
}
