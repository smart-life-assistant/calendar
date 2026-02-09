"use client";

import AddEventModal from "@/components/custom/desktop/calendar/AddEventModal";
import CalendarDay from "@/components/custom/desktop/calendar/CalendarDay";
import CalendarDetailModal from "@/components/custom/desktop/calendar/CalendarDetailModal";
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
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  startTransition,
} from "react";
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

export default function CalendarPage() {
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SpecialDate | null>(null);
  const [addEventDate, setAddEventDate] = useState<Date | null>(null);

  // Generate year options (current year ± 10 years) - Memoized
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2000;
    const endYear = currentYear + 10;
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i,
    );
  }, []);

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  // Handlers for year/month selection - Optimized with useCallback
  const handleYearChange = useCallback(
    (year: string) => {
      startTransition(() => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(parseInt(year));
        setCurrentDate(newDate);
      });
    },
    [currentDate],
  );

  const handleMonthChange = useCallback(
    (month: string) => {
      startTransition(() => {
        const newDate = new Date(currentDate);
        newDate.setMonth(parseInt(month) - 1);
        setCurrentDate(newDate);
      });
    },
    [currentDate],
  );

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

  // Fetch special dates
  useEffect(() => {
    void fetchSpecialDates();
  }, [fetchSpecialDates]);

  // Handle modal actions - Optimized with useCallback
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

  // Generate calendar grid with days from previous and next month - Memoized
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });
  }, [currentDate]);

  // Get lunar date using our custom library - Memoized function
  const getLunarDate = useCallback((date: Date) => {
    const lunar = convertSolar2Lunar(
      date.getDate(),
      date.getMonth() + 1,
      date.getFullYear(),
    );
    return {
      day: lunar.day,
      month: lunar.month,
      year: lunar.year,
      isLeapMonth: lunar.isLeapMonth,
    };
  }, []);

  // Get can chi using our custom library - Memoized function
  const getDayCanChi = useCallback((date: Date) => {
    const canChi = getCanChi(
      date.getDate(),
      date.getMonth() + 1,
      date.getFullYear(),
    );
    return canChi.day;
  }, []);

  // Get can chi of year (based on lunar year) - Memoized function
  const getYearCanChi = useCallback(
    (date: Date) => {
      const lunar = getLunarDate(date);
      return getYearCanChiString(lunar.year);
    },
    [getLunarDate],
  );

  // Get can chi of month - Memoized function
  const getMonthCanChi = useCallback((date: Date) => {
    const canChi = getCanChi(
      date.getDate(),
      date.getMonth() + 1,
      date.getFullYear(),
    );
    return canChi.month;
  }, []);

  // Get current month lunar info (for displaying in header) - Memoized
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

  // Get events for a specific date - Memoized function
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
    [specialDates, getLunarDate],
  );

  // Navigation handlers - Optimized with useCallback
  const handlePrevMonth = useCallback(() => {
    startTransition(() => {
      setCurrentDate((prev) => subMonths(prev, 1));
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    startTransition(() => {
      setCurrentDate((prev) => addMonths(prev, 1));
    });
  }, []);

  const handleToday = useCallback(() => {
    startTransition(() => {
      setCurrentDate(new Date());
    });
  }, []);

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  // Animation variants - Memoized to prevent recreation
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.01, // Reduced from 0.02 for better performance
        },
      },
    }),
    [],
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 0.95 }, // Reduced scale difference
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring" as const,
          stiffness: 200, // Reduced from 300 for smoother animation
          damping: 20,
        },
      },
    }),
    [],
  );

  return (
    <article className="min-h-screen py-4 sm:py-6 md:py-8 px-2 sm:px-4 relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-950 opacity-40" />
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-[1800px] mx-auto">
        {/* Two Column Layout: Calendar Left, Header Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 relative">
          {/* LEFT COLUMN: Calendar Grid with Navigation */}
          <motion.section
            className="relative rounded-3xl bg-card/40 backdrop-blur-2xl border border-border/50 shadow-2xl overflow-visible order-2 lg:order-1 ml-6 mr-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            aria-label="Calendar grid"
          >
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-blue-500/5 to-transparent pointer-events-none" />

            {/* Left Hover Zone */}
            <div className="hidden lg:block absolute -left-12 top-0 bottom-0 w-24 group/left">
              <motion.button
                onClick={handlePrevMonth}
                className="absolute left-0 top-1/2 -translate-y-1/2 h-24 w-12 flex items-center justify-center bg-white/95 dark:bg-gray-800/95 backdrop-blur-md opacity-0 group-hover/left:opacity-100 transition-all duration-300 rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/20 dark:border-gray-700/50 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)]"
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Tháng trước"
              >
                <ChevronLeft
                  className="h-6 w-6 text-gray-700 dark:text-gray-200"
                  strokeWidth={2.5}
                />
              </motion.button>
            </div>

            {/* Right Hover Zone */}
            <div className="hidden lg:block absolute -right-12 top-0 bottom-0 w-24 group/right">
              <motion.button
                onClick={handleNextMonth}
                className="absolute right-0 top-1/2 -translate-y-1/2 h-24 w-12 flex items-center justify-center bg-white/95 dark:bg-gray-800/95 backdrop-blur-md opacity-0 group-hover/right:opacity-100 transition-all duration-300 rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/20 dark:border-gray-700/50 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)]"
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Tháng sau"
              >
                <ChevronRight
                  className="h-6 w-6 text-gray-700 dark:text-gray-200"
                  strokeWidth={2.5}
                />
              </motion.button>
            </div>

            {/* Content wrapper with overflow hidden to preserve rounded corners */}
            <div className="overflow-hidden rounded-3xl">
              {/* Month Navigation Header */}
              <div className="relative z-10 flex items-center justify-between p-3 sm:p-4 border-b border-border/50 bg-background/60 backdrop-blur-sm">
                <motion.button
                  onClick={handlePrevMonth}
                  className="p-2 sm:p-3 rounded-xl hover:bg-accent transition-colors bg-background/80"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Tháng trước"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.button>

                <div className="text-center flex-1">
                  <div className="font-bold text-lg sm:text-xl mb-1">
                    Tháng {format(currentDate, "MM/yyyy")}
                  </div>

                  {/* Lunar Month Info */}
                  <div className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">
                    🌙 Tháng {currentMonthLunar.lunarMonth}{" "}
                    {currentMonthLunar.isLeapMonth && "nhuận"} năm{" "}
                    {currentMonthLunar.yearCanChi}
                    {currentMonthLunar.isYearLeap && " nhuận"}
                  </div>

                  {/* Month Can Chi Badge */}
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-linear-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200 dark:border-indigo-700">
                    <span className="text-xs font-bold bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                      ✨ Tháng {currentMonthLunar.monthCanChi}
                    </span>
                  </div>
                </div>

                <motion.button
                  onClick={handleNextMonth}
                  className="p-2 sm:p-3 rounded-xl hover:bg-accent transition-colors bg-background/80"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Tháng sau"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 border-b border-border/50 bg-linear-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
                {[
                  { short: "T2", full: "Thứ Hai", color: "text-foreground" },
                  { short: "T3", full: "Thứ Ba", color: "text-foreground" },
                  { short: "T4", full: "Thứ Tư", color: "text-foreground" },
                  { short: "T5", full: "Thứ Năm", color: "text-foreground" },
                  { short: "T6", full: "Thứ Sáu", color: "text-foreground" },
                  {
                    short: "T7",
                    full: "Thứ Bảy",
                    color: "text-blue-600 dark:text-blue-400",
                  },
                  {
                    short: "CN",
                    full: "Chủ Nhật",
                    color: "text-red-600 dark:text-red-400",
                  },
                ].map((day, index) => (
                  <motion.div
                    key={day.short}
                    className="p-2 sm:p-3 md:p-4 text-center relative group"
                    title={day.full}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-blue-500/0 group-hover:to-blue-500/5 transition-colors" />
                    <span
                      className={`relative font-bold text-xs sm:text-sm md:text-base ${day.color}`}
                    >
                      {day.short}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Calendar Days Grid */}
              <motion.div
                className="grid grid-cols-7 gap-0.5 sm:gap-1 p-1 sm:p-2 bg-muted/20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {calendarDays.map((date) => {
                  const lunar = getLunarDate(date);
                  const canChi = getDayCanChi(date);
                  const monthCanChi = getMonthCanChi(date);
                  const yearCanChi = getYearCanChi(date);
                  const isYearLeap = hasLeapMonth(lunar.year) > 0;
                  const events = getEventsForDate(date);
                  const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

                  return (
                    <motion.div
                      key={dateKey}
                      variants={itemVariants}
                      className="aspect-square"
                    >
                      <CalendarDay
                        date={date}
                        lunar={lunar}
                        canChi={canChi}
                        monthCanChi={monthCanChi}
                        yearCanChi={yearCanChi}
                        isYearLeap={isYearLeap}
                        events={events}
                        isCurrentMonth={isSameMonth(date, currentDate)}
                        isToday={isToday(date)}
                        onClick={() => handleDateClick(date)}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.section>

          {/* RIGHT COLUMN: Header & Controls */}
          <motion.header
            className="order-1 lg:order-2 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] self-start mr-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            aria-label="Calendar header"
          >
            <div className="relative rounded-2xl sm:rounded-3xl bg-card/40 backdrop-blur-2xl border border-border/50 p-4 sm:p-6 shadow-2xl overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />

              <div className="relative z-10 space-y-4 sm:space-y-6">
                {/* Title Section */}
                <div className="flex items-center gap-3">
                  <motion.div
                    className="relative shrink-0"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 blur-lg opacity-50" />
                    <div className="relative rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 p-2.5">
                      <CalendarIcon className="h-7 w-7 text-white" />
                    </div>
                  </motion.div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                      Lịch Việt Nam
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Tra cứu âm dương lịch & ngày lễ tết 🇻🇳
                    </p>
                  </div>
                </div>

                {/* Add Event Button */}
                {session && (
                  <motion.button
                    onClick={() => handleAddEvent()}
                    className="w-full px-4 py-3 bg-linear-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all inline-flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Thêm sự kiện mới"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Thêm sự kiện mới</span>
                  </motion.button>
                )}

                {/* Divider */}
                <div className="border-t border-border/50" />

                {/* Year Selector */}
                <div className="space-y-2">
                  <label
                    htmlFor="year-select-right"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Chọn năm</span>
                  </label>
                  <Select
                    value={currentDate.getFullYear().toString()}
                    onValueChange={handleYearChange}
                  >
                    <SelectTrigger
                      id="year-select-right"
                      className="w-full bg-background/60 backdrop-blur-sm"
                      aria-label="Chọn năm"
                    >
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

                {/* Month Selector */}
                <div className="space-y-2">
                  <label
                    htmlFor="month-select-right"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <CalendarRange className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Chọn tháng</span>
                  </label>
                  <Select
                    value={(currentDate.getMonth() + 1).toString()}
                    onValueChange={handleMonthChange}
                  >
                    <SelectTrigger
                      id="month-select-right"
                      className="w-full bg-background/60 backdrop-blur-sm"
                      aria-label="Chọn tháng"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          Tháng {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Today Button */}
                <motion.button
                  onClick={handleToday}
                  className="w-full px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Quay về ngày hôm nay"
                >
                  🏠 Quay về hôm nay
                </motion.button>
              </div>
            </div>
          </motion.header>
        </div>
        {/* Modern Legend with Cards - Fully Responsive */}
        <motion.aside
          className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          aria-label="Calendar legend"
        >
          {[
            {
              icon: "🎯",
              label: "Hôm nay",
              description: "Ngày hiện tại",
              gradient: "from-blue-500/10 to-indigo-500/10",
              border: "border-blue-500/20",
            },
            {
              icon: "🎉",
              label: "Ngày lễ",
              description: "Lễ tết Việt Nam",
              gradient: "from-red-500/10 to-pink-500/10",
              border: "border-red-500/20",
            },
            {
              icon: "📌",
              label: "Sự kiện",
              description: "Ghi chú cá nhân",
              gradient: "from-green-500/10 to-emerald-500/10",
              border: "border-green-500/20",
            },
            {
              icon: "🌙",
              label: "Âm lịch",
              description: "Ngày âm dương",
              gradient: "from-amber-500/10 to-orange-500/10",
              border: "border-amber-500/20",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`relative rounded-xl sm:rounded-2xl bg-linear-to-br ${item.gradient} backdrop-blur-sm border ${item.border} p-3 sm:p-4 group hover:scale-105 transition-transform`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 text-center sm:text-left">
                <div className="text-2xl sm:text-3xl">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs sm:text-sm truncate">
                    {item.label}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {item.description}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.aside>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDate && (
          <CalendarDetailModal
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
      </AnimatePresence>

      {/* Add/Edit Event Modal */}
      <AddEventModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        selectedDate={addEventDate}
        editingEvent={editingEvent}
      />
    </article>
  );
}
