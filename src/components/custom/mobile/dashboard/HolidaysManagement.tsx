"use client";

import AddEventModal from "@/components/custom/desktop/calendar/AddEventModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Loader2,
  Moon,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
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
  created_at?: string;
  updated_at?: string;
}

function HolidaysManagementMobile() {
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
  const [filteredDates, setFilteredDates] = useState<SpecialDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "solar" | "lunar">(
    "all",
  );
  const [filterCategory, setFilterCategory] = useState<
    "all" | "holiday" | "event"
  >("all");
  const [filterVisibility, setFilterVisibility] = useState<
    "all" | "public" | "private"
  >("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SpecialDate | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data
  const fetchSpecialDates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/special-dates");
      const data = await response.json();
      setSpecialDates(data);
      setFilteredDates(data);
    } catch (error) {
      console.error("Error fetching special dates:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpecialDates();
  }, [fetchSpecialDates]);

  // Filter logic
  useEffect(() => {
    let filtered = [...specialDates];

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.date_type === filterType);
    }

    if (filterCategory === "holiday") {
      filtered = filtered.filter((item) => item.is_holiday);
    } else if (filterCategory === "event") {
      filtered = filtered.filter((item) => !item.is_holiday);
    }

    if (filterVisibility === "public") {
      filtered = filtered.filter((item) => item.is_public);
    } else if (filterVisibility === "private") {
      filtered = filtered.filter((item) => !item.is_public);
    }

    filtered.sort((a, b) => {
      if (a.month !== b.month) return a.month - b.month;
      return a.day - b.day;
    });

    setFilteredDates(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterType, filterCategory, filterVisibility, specialDates]);

  // Pagination logic
  const totalPages = Math.ceil(filteredDates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDates = filteredDates.slice(startIndex, endIndex);

  const handleResetFilters = useCallback(() => {
    setSearchTerm("");
    setFilterType("all");
    setFilterCategory("all");
    setFilterVisibility("all");
    setCurrentPage(1);
    toast.success("Đã đặt lại bộ lọc!");
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/special-dates?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSpecialDates((prev) => prev.filter((item) => item.id !== id));
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
  }, []);

  const handleEdit = useCallback((event: SpecialDate) => {
    setEditingEvent(event);
    setShowAddModal(true);
  }, []);

  const handleModalSuccess = useCallback(() => {
    fetchSpecialDates();
    setShowAddModal(false);
    setEditingEvent(null);
  }, [fetchSpecialDates]);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setEditingEvent(null);
  }, []);

  const stats = {
    total: specialDates.length,
    holidays: specialDates.filter((item) => item.is_holiday).length,
    events: specialDates.filter((item) => !item.is_holiday).length,
    lunar: specialDates.filter((item) => item.date_type === "lunar").length,
    solar: specialDates.filter((item) => item.date_type === "solar").length,
  };

  return (
    <div className="space-y-4 p-3">
      {/* Header - Compact */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
              <Star className="h-4 w-4 text-white" />
            </div>
            Sự kiện & Ngày lễ
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {stats.total} sự kiện
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingEvent(null);
            setShowAddModal(true);
          }}
          size="sm"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 active:scale-95 transition-transform"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats Cards - Compact Grid */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            label: "Ngày lễ",
            value: stats.holidays,
            icon: Star,
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-900/20",
          },
          {
            label: "Sự kiện",
            value: stats.events,
            icon: Calendar,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-50 dark:bg-green-900/20",
          },
          {
            label: "Âm lịch",
            value: stats.lunar,
            icon: Moon,
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-900/20",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-lg border border-border/50 p-2 ${stat.bg}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`h-3.5 w-3.5 ${stat.color}`} />
                <div className={`text-lg font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 h-9 text-sm"
        />
      </div>

      {/* Filters - Compact */}
      <div className="grid grid-cols-2 gap-2">
        <Select
          value={filterType}
          onValueChange={(value) =>
            setFilterType(value as "all" | "solar" | "lunar")
          }
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả lịch</SelectItem>
            <SelectItem value="solar">🌞 Dương</SelectItem>
            <SelectItem value="lunar">🌙 Âm</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filterCategory}
          onValueChange={(value) =>
            setFilterCategory(value as "all" | "holiday" | "event")
          }
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="holiday">⭐ Lễ</SelectItem>
            <SelectItem value="event">📅 Sự kiện</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <Select
            value={filterVisibility}
            onValueChange={(value) =>
              setFilterVisibility(value as "all" | "public" | "private")
            }
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Hiển thị</SelectItem>
              <SelectItem value="public">🌍 Công khai</SelectItem>
              <SelectItem value="private">🔒 Riêng tư</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleResetFilters}
          variant="outline"
          size="sm"
          className="h-9 px-3 active:scale-95 transition-transform"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Table/List - Mobile Card Layout */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : paginatedDates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Không tìm thấy sự kiện nào</p>
        </div>
      ) : (
        <div className="space-y-2">
          {paginatedDates.map((event) => (
            <div
              key={event.id}
              className="bg-card border border-border rounded-lg p-3 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                    <span className="truncate">{event.name}</span>
                    {event.is_holiday && (
                      <Badge
                        variant="destructive"
                        className="text-[10px] px-1.5 py-0"
                      >
                        Lễ
                      </Badge>
                    )}
                    {event.is_public ? (
                      <Badge
                        variant="default"
                        className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      >
                        🌍
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        🔒
                      </Badge>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span>
                    {event.date_type === "lunar" ? "🌙" : "🌞"} {event.day}/
                    {event.month}
                    {event.year && `/${event.year}`}
                  </span>
                  {event.is_recurring && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0"
                    >
                      Lặp lại
                    </Badge>
                  )}
                </div>

                <div className="flex gap-1">
                  <Button
                    onClick={() => handleEdit(event)}
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 active:scale-95 transition-transform"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(event.id)}
                    variant="ghost"
                    size="sm"
                    disabled={deletingId === event.id}
                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95 transition-transform"
                  >
                    {deletingId === event.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination - Compact */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            {startIndex + 1}-{Math.min(endIndex, filteredDates.length)} /{" "}
            {filteredDates.length}
          </div>
          <div className="flex items-center gap-1">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <div className="text-xs px-2">
              {currentPage}/{totalPages}
            </div>
            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 active:scale-95 transition-transform"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddEventModal
          isOpen={showAddModal}
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          editingEvent={editingEvent}
        />
      )}
    </div>
  );
}

export default memo(HolidaysManagementMobile);
