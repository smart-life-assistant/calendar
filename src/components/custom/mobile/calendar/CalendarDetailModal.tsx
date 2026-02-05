"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
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
import { memo, useCallback, useState } from "react";
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

interface CalendarDetailModalProps {
  date: Date;
  lunar: {
    day: number;
    month: number;
    year: number;
    isLeapMonth: boolean;
  };
  canChi: string;
  monthCanChi: string;
  yearCanChi: string;
  isYearLeap: boolean;
  events: SpecialDate[];
  onClose: () => void;
  isAuthenticated: boolean;
  onEdit?: (event: SpecialDate) => void;
  onDelete?: (eventId: string) => void;
  onAddNew?: () => void;
}

function CalendarDetailModalMobile({
  date,
  lunar,
  canChi,
  monthCanChi,
  yearCanChi,
  isYearLeap,
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

  const handleDelete = useCallback(
    async (eventId: string) => {
      if (!confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) return;

      setDeletingId(eventId);
      try {
        const response = await fetch(`/api/special-dates?id=${eventId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("Xóa sự kiện thành công!");
          if (onDelete) {
            onDelete(eventId);
          }
        } else {
          toast.error("Có lỗi xảy ra khi xóa sự kiện!");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Có lỗi xảy ra khi xóa sự kiện!");
      } finally {
        setDeletingId(null);
      }
    },
    [onDelete]
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal - Fullscreen on mobile */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0 border-b border-border p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  {format(date, "EEEE, dd MMMM yyyy", { locale: vi })}
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                🌙 Ngày {lunar.day} tháng {lunar.month}{" "}
                {lunar.isLeapMonth && "nhuận"} năm {yearCanChi}
                {isYearLeap && " nhuận"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Date Info Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-1">
                <Sun className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                  Dương lịch
                </span>
              </div>
              <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                {format(date, "dd/MM/yyyy")}
              </p>
            </div>

            <div className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-1">
                <Moon className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold text-amber-900 dark:text-amber-100">
                  Âm lịch
                </span>
              </div>
              <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
                {lunar.day}/{lunar.month}/{lunar.year}
              </p>
            </div>
          </div>

          {/* Can Chi Info */}
          <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <p className="text-xs font-semibold text-purple-900 dark:text-purple-100 mb-1.5">
              🎋 Can Chi
            </p>
            <div className="space-y-1 text-xs text-purple-700 dark:text-purple-300">
              <p>
                Ngày: <span className="font-bold">{canChi}</span>
              </p>
              <p>
                Tháng: <span className="font-bold">{monthCanChi}</span>
              </p>
              <p>
                Năm: <span className="font-bold">{yearCanChi}</span>
              </p>
            </div>
          </div>

          {/* Holidays Section */}
          {holidays.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <Star className="h-4 w-4 text-red-600 dark:text-red-400" />
                Ngày lễ ({holidays.length})
              </h3>
              <div className="space-y-2">
                {holidays.map((holiday) => (
                  <div
                    key={holiday.id}
                    className="bg-red-50 dark:bg-red-950/30 rounded-lg p-3 border border-red-200 dark:border-red-800"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-red-900 dark:text-red-100 mb-0.5">
                          {holiday.name}
                        </h4>
                        {holiday.description && (
                          <p className="text-xs text-red-700 dark:text-red-300">
                            {holiday.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          <span className="text-[10px] px-1.5 py-0.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
                            {holiday.date_type === "lunar"
                              ? "🌙 Âm lịch"
                              : "🌞 Dương lịch"}
                          </span>
                          {holiday.is_recurring && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
                              🔁 Lặp lại
                            </span>
                          )}
                          {holiday.is_public ? (
                            <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                              🌍 Công khai
                            </span>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                              🔒 Riêng tư
                            </span>
                          )}
                        </div>
                      </div>
                      {isAuthenticated && (
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => onEdit && onEdit(holiday)}
                            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 active:scale-95 transition-all"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(holiday.id)}
                            disabled={deletingId === holiday.id}
                            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 active:scale-95 transition-all"
                          >
                            {deletingId === holiday.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Events Section */}
          {regularEvents.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Sự kiện ({regularEvents.length})
              </h3>
              <div className="space-y-2">
                {regularEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-0.5">
                          {event.name}
                        </h4>
                        {event.description && (
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            {event.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                            {event.date_type === "lunar"
                              ? "🌙 Âm lịch"
                              : "🌞 Dương lịch"}
                          </span>
                          {event.is_recurring && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                              🔁 Lặp lại
                            </span>
                          )}
                          {event.is_public ? (
                            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded">
                              🌍 Công khai
                            </span>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                              🔒 Riêng tư
                            </span>
                          )}
                        </div>
                      </div>
                      {isAuthenticated && (
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => onEdit && onEdit(event)}
                            className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 active:scale-95 transition-all"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            disabled={deletingId === event.id}
                            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 active:scale-95 transition-all"
                          >
                            {deletingId === event.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Events Message */}
          {events.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
              <p className="text-sm text-muted-foreground">
                Không có sự kiện nào trong ngày này
              </p>
            </div>
          )}

          {/* Add Event Button */}
          {isAuthenticated && onAddNew && (
            <button
              onClick={() => {
                onAddNew();
                onClose();
              }}
              className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Plus className="h-4 w-4" />
              Thêm sự kiện mới
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(CalendarDetailModalMobile);
