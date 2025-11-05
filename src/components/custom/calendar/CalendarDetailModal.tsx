"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  Calendar,
  Edit,
  Loader2,
  Moon,
  Plus,
  Star,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
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
}

interface CalendarDetailModalProps {
  date: Date;
  lunar: {
    day: number;
    month: number;
    year: number;
    isLeapMonth: boolean;
  };
  canChi: string;
  events: SpecialDate[];
  onClose: () => void;
  isAuthenticated: boolean;
  onEdit?: (event: SpecialDate) => void;
  onDelete?: (eventId: string) => void;
  onAddNew?: () => void;
}

export default function CalendarDetailModal({
  date,
  lunar,
  canChi,
  events,
  onClose,
  isAuthenticated,
  onEdit,
  onDelete,
  onAddNew,
}: CalendarDetailModalProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const holidays = events.filter((e) => e.is_holiday);
  const regularEvents = events.filter((e) => !e.is_holiday);

  const handleDelete = async (eventId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) return;

    setDeletingId(eventId);
    try {
      const response = await fetch(`/api/special-dates?id=${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete?.(eventId);
        toast.success("Xóa sự kiện thành công!");
      } else {
        toast.error("Có lỗi xảy ra khi xóa sự kiện!");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Có lỗi xảy ra khi xóa sự kiện!");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {format(date, "dd/MM/yyyy")}
              </h2>
              <p className="text-blue-100">
                {format(date, "EEEE, dd MMMM yyyy", { locale: vi })}
              </p>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-6 w-6" />
            </motion.button>
          </div>

          {/* Date Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="h-4 w-4" />
                <span className="text-sm text-blue-100">Âm lịch</span>
              </div>
              <p className="text-xl font-semibold">
                {lunar.day}/{lunar.month}/{lunar.year}
              </p>
              {lunar.isLeapMonth && (
                <span className="text-xs text-blue-200">(Tháng nhuận)</span>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="h-4 w-4" />
                <span className="text-sm text-blue-100">Can Chi</span>
              </div>
              <p className="text-xl font-semibold">{canChi}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {/* Holidays */}
          {holidays.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Ngày lễ ({holidays.length})
                </h3>
              </div>
              <div className="space-y-3">
                {holidays.map((event) => (
                  <motion.div
                    key={event.id}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-900 dark:text-red-300 mb-1">
                          {event.name}
                        </h4>
                        {event.description && (
                          <p className="text-sm text-red-700 dark:text-red-400">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-red-600 dark:text-red-400">
                          <span>
                            {event.date_type === "lunar"
                              ? "🌙 Âm lịch"
                              : "☀️ Dương lịch"}
                          </span>
                          {event.is_recurring && <span>🔄 Hàng năm</span>}
                        </div>
                      </div>
                      {isAuthenticated && (
                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => onEdit?.(event)}
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Chỉnh sửa"
                          >
                            <Edit className="h-4 w-4 text-red-700 dark:text-red-400" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(event.id)}
                            disabled={deletingId === event.id}
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Xóa"
                          >
                            {deletingId === event.id ? (
                              <Loader2 className="h-4 w-4 text-red-700 dark:text-red-400 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-700 dark:text-red-400" />
                            )}
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Events */}
          {regularEvents.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Sự kiện ({regularEvents.length})
                </h3>
              </div>
              <div className="space-y-3">
                {regularEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-900 dark:text-green-300 mb-1">
                          {event.name}
                        </h4>
                        {event.description && (
                          <p className="text-sm text-green-700 dark:text-green-400">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-green-600 dark:text-green-400">
                          <span>
                            {event.date_type === "lunar"
                              ? "🌙 Âm lịch"
                              : "☀️ Dương lịch"}
                          </span>
                          {event.is_recurring && <span>🔄 Hàng năm</span>}
                        </div>
                      </div>
                      {isAuthenticated && (
                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => onEdit?.(event)}
                            className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Chỉnh sửa"
                          >
                            <Edit className="h-4 w-4 text-green-700 dark:text-green-400" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(event.id)}
                            disabled={deletingId === event.id}
                            className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Xóa"
                          >
                            {deletingId === event.id ? (
                              <Loader2 className="h-4 w-4 text-green-700 dark:text-green-400 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-green-700 dark:text-green-400" />
                            )}
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* No Events */}
          {events.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Không có sự kiện nào trong ngày này
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {isAuthenticated && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <motion.button
              onClick={onAddNew}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-5 w-5" />
              Thêm sự kiện mới
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
