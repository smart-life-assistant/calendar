"use client";

import AddEventModal from "@/components/custom/calendar/AddEventModal";
import CalendarDay from "@/components/custom/calendar/CalendarDay";
import CalendarDetailModal from "@/components/custom/calendar/CalendarDetailModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertSolar2Lunar, getCanChi } from "@/lib/lunar-calendar";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import { vi } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
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

export default function CalendarPage() {
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SpecialDate | null>(null);
  const [addEventDate, setAddEventDate] = useState<Date | null>(null);

  // Generate year options (current year ± 10 years)
  const currentYear = new Date().getFullYear();
  // get years from 2000 to currentYear + 10
  const startYear = 2000;
  const endYear = currentYear + 10;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Handlers for year/month selection
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

  const fetchSpecialDates = async () => {
    try {
      const response = await fetch("/api/special-dates");
      const data = await response.json();
      setSpecialDates(data);
    } catch (error) {
      console.error("Error fetching special dates:", error);
    }
  };

  // Fetch special dates
  useEffect(() => {
    fetchSpecialDates();
  }, []);

  // Handle modal actions
  const handleAddEvent = (date?: Date) => {
    setAddEventDate(date || null);
    setEditingEvent(null);
    setShowAddModal(true);
  };

  const handleEditEvent = (event: SpecialDate) => {
    setEditingEvent(event);
    setAddEventDate(null);
    setShowAddModal(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setSpecialDates((prev) => prev.filter((e) => e.id !== eventId));
  };

  const handleModalSuccess = () => {
    fetchSpecialDates();
    setShowAddModal(false);
    setEditingEvent(null);
    setAddEventDate(null);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingEvent(null);
    setAddEventDate(null);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get lunar date using our custom library
  const getLunarDate = (date: Date) => {
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
  };

  // Get can chi using our custom library
  const getDayCanChi = (date: Date) => {
    const canChi = getCanChi(
      date.getDate(),
      date.getMonth() + 1,
      date.getFullYear()
    );
    return canChi.day;
  }; // Get events for a specific date
  const getEventsForDate = (date: Date) => {
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
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
      },
    },
  };

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-2 sm:px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-950 opacity-40" />
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

      <div className="max-w-[1600px] mx-auto">
        {/* Modern Header with Glassmorphism - Responsive */}
        <motion.div
          className="mb-4 sm:mb-6 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative rounded-2xl sm:rounded-3xl bg-card/40 backdrop-blur-2xl border border-border/50 p-4 sm:p-6 md:p-8 shadow-2xl overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              {/* Title Section - Responsive */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <motion.div
                      className="relative flex-shrink-0"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 blur-lg sm:blur-xl opacity-50" />
                      <div className="relative rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-2 sm:p-3">
                        <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                    </motion.div>
                    <div className="min-w-0 flex-1">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent truncate">
                        Lịch Việt Nam
                      </h1>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                        Tra cứu âm dương lịch & ngày lễ tết 🇻🇳
                      </p>
                    </div>
                  </div>
                </div>

                {session && (
                  <motion.div
                    className="w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/dashboard"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                    >
                      <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      Dashboard
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Modern Filter & Navigation Bar - Fully Responsive */}
              <div className="flex flex-col gap-4">
                {/* Row 1: Year & Month Selectors + Today Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Year Selector */}
                  <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-border/50 flex-1 sm:flex-initial">
                    <label className="text-xs sm:text-sm font-medium whitespace-nowrap">
                      📅 Năm:
                    </label>
                    <Select
                      value={currentDate.getFullYear().toString()}
                      onValueChange={handleYearChange}
                    >
                      <SelectTrigger className="w-[80px] sm:w-[100px] border-0 bg-transparent focus:ring-0 h-8">
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
                  <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-border/50 flex-1 sm:flex-initial">
                    <label className="text-xs sm:text-sm font-medium whitespace-nowrap">
                      🗓️ Tháng:
                    </label>
                    <Select
                      value={(currentDate.getMonth() + 1).toString()}
                      onValueChange={handleMonthChange}
                    >
                      <SelectTrigger className="w-[90px] sm:w-[110px] border-0 bg-transparent focus:ring-0 h-8">
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
                    onClick={() => setCurrentDate(new Date())}
                    className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="hidden sm:inline">🏠 Hôm nay</span>
                    <span className="sm:hidden">📅 Hôm nay</span>
                  </motion.button>
                </div>

                {/* Row 2: Navigation & Actions */}
                <div className="flex items-center gap-3 justify-between">
                  {/* Month Navigation */}
                  <div className="flex items-center gap-1 sm:gap-2 bg-background/60 backdrop-blur-sm rounded-xl border border-border/50 p-1">
                    <motion.button
                      onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                      className="p-1.5 sm:p-2 rounded-lg hover:bg-accent transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Tháng trước"
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </motion.button>

                    <div className="px-2 sm:px-4 text-center min-w-[120px] sm:min-w-[160px]">
                      <div className="font-bold text-sm sm:text-lg">
                        Tháng {format(currentDate, "MM/yyyy")}
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground hidden md:block">
                        {format(currentDate, "MMMM yyyy", { locale: vi })}
                      </div>
                    </div>

                    <motion.button
                      onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                      className="p-1.5 sm:p-2 rounded-lg hover:bg-accent transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Tháng sau"
                    >
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </motion.button>
                  </div>

                  {/* Add Event Button */}
                  {session && (
                    <motion.button
                      onClick={() => handleAddEvent()}
                      className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden md:inline">Thêm sự kiện</span>
                      <span className="md:hidden">Thêm</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ultra Modern Calendar Grid with Glassmorphism */}
        <motion.div
          className="relative rounded-3xl bg-card/40 backdrop-blur-2xl border border-border/50 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

          {/* Weekday Headers - Modern Gradient Design - Responsive */}
          <div className="grid grid-cols-7 border-b border-border/50 bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
            {[
              {
                short: "CN",
                full: "Chủ Nhật",
                color: "text-red-600 dark:text-red-400",
              },
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
            ].map((day, index) => (
              <motion.div
                key={day.short}
                className="p-2 sm:p-3 md:p-4 text-center relative group"
                title={day.full}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-500/0 group-hover:to-blue-500/5 transition-colors" />
                <span
                  className={`relative font-bold text-xs sm:text-sm md:text-base ${day.color}`}
                >
                  {day.short}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Calendar Days Grid - Fully Responsive */}
          <motion.div
            className="grid grid-cols-7 gap-0.5 sm:gap-1 p-1 sm:p-2 bg-muted/20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {calendarDays.map((date, index) => {
              const lunar = getLunarDate(date);
              const canChi = getDayCanChi(date);
              const events = getEventsForDate(date);

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="md:aspect-square min-h-[80px] xs:min-h-[90px] sm:min-h-[100px] md:min-h-[120px] lg:min-h-[130px]"
                >
                  <CalendarDay
                    date={date}
                    lunar={lunar}
                    canChi={canChi}
                    events={events}
                    isCurrentMonth={isSameMonth(date, currentDate)}
                    isToday={isToday(date)}
                    onClick={() => setSelectedDate(date)}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Modern Legend with Cards - Fully Responsive */}
        <motion.div
          className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
              className={`relative rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.gradient} backdrop-blur-sm border ${item.border} p-3 sm:p-4 group hover:scale-105 transition-transform`}
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
        </motion.div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDate && (
          <CalendarDetailModal
            date={selectedDate}
            lunar={getLunarDate(selectedDate)}
            canChi={getDayCanChi(selectedDate)}
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
    </div>
  );
}
