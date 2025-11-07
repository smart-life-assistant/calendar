"use client";

import AddEventModal from "@/components/custom/calendar/AddEventModal";
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
import { motion } from "framer-motion";
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
  Sun,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
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

export default function HolidaysManagement() {
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
  const [filteredDates, setFilteredDates] = useState<SpecialDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "solar" | "lunar">(
    "all"
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
  const fetchSpecialDates = async () => {
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
  };

  useEffect(() => {
    fetchSpecialDates();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = [...specialDates];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter (lunar/solar)
    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.date_type === filterType);
    }

    // Category filter (holiday/event)
    if (filterCategory === "holiday") {
      filtered = filtered.filter((item) => item.is_holiday);
    } else if (filterCategory === "event") {
      filtered = filtered.filter((item) => !item.is_holiday);
    }

    // Visibility filter (public/private)
    if (filterVisibility === "public") {
      filtered = filtered.filter((item) => item.is_public);
    } else if (filterVisibility === "private") {
      filtered = filtered.filter((item) => !item.is_public);
    }

    // Sort by month and day
    filtered.sort((a, b) => {
      if (a.month !== b.month) return a.month - b.month;
      return a.day - b.day;
    });

    setFilteredDates(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filterType, filterCategory, filterVisibility, specialDates]);

  // Pagination logic
  const totalPages = Math.ceil(filteredDates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDates = filteredDates.slice(startIndex, endIndex);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterCategory("all");
    setFilterVisibility("all");
    setCurrentPage(1);
    toast.success("Đã đặt lại bộ lọc!");
  };

  // Handlers
  const handleDelete = async (id: string) => {
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
  };

  const handleEdit = (event: SpecialDate) => {
    setEditingEvent(event);
    setShowAddModal(true);
  };

  const handleModalSuccess = () => {
    fetchSpecialDates();
    setShowAddModal(false);
    setEditingEvent(null);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingEvent(null);
  };

  // Stats
  const stats = {
    total: specialDates.length,
    holidays: specialDates.filter((item) => item.is_holiday).length,
    events: specialDates.filter((item) => !item.is_holiday).length,
    lunar: specialDates.filter((item) => item.date_type === "lunar").length,
    solar: specialDates.filter((item) => item.date_type === "solar").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
              <Star className="h-6 w-6 text-white" />
            </div>
            Sự kiện & Ngày lễ
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý tất cả sự kiện và ngày lễ trong hệ thống
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingEvent(null);
            setShowAddModal(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm mới
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        {[
          {
            label: "Tổng số",
            value: stats.total,
            icon: Calendar,
            color: "from-blue-500 to-indigo-500",
            bgLight: "bg-blue-50 dark:bg-blue-900/20",
            textColor: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Ngày lễ",
            value: stats.holidays,
            icon: Star,
            color: "from-red-500 to-pink-500",
            bgLight: "bg-red-50 dark:bg-red-900/20",
            textColor: "text-red-600 dark:text-red-400",
          },
          {
            label: "Sự kiện",
            value: stats.events,
            icon: Calendar,
            color: "from-green-500 to-emerald-500",
            bgLight: "bg-green-50 dark:bg-green-900/20",
            textColor: "text-green-600 dark:text-green-400",
          },
          {
            label: "Âm lịch",
            value: stats.lunar,
            icon: Moon,
            color: "from-purple-500 to-pink-500",
            bgLight: "bg-purple-50 dark:bg-purple-900/20",
            textColor: "text-purple-600 dark:text-purple-400",
          },
          {
            label: "Dương lịch",
            value: stats.solar,
            icon: Sun,
            color: "from-amber-500 to-orange-500",
            bgLight: "bg-amber-50 dark:bg-amber-900/20",
            textColor: "text-amber-600 dark:text-amber-400",
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className={`rounded-xl border border-border/50 p-4 ${stat.bgLight}`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${stat.textColor}`} />
                <div className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sự kiện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filterType}
          onValueChange={(value) =>
            setFilterType(value as "all" | "solar" | "lunar")
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại lịch</SelectItem>
            <SelectItem value="solar">🌞 Dương lịch</SelectItem>
            <SelectItem value="lunar">🌙 Âm lịch</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filterCategory}
          onValueChange={(value) =>
            setFilterCategory(value as "all" | "holiday" | "event")
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="holiday">⭐ Ngày lễ</SelectItem>
            <SelectItem value="event">📅 Sự kiện</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filterVisibility}
          onValueChange={(value) =>
            setFilterVisibility(value as "all" | "public" | "private")
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả hiển thị</SelectItem>
            <SelectItem value="public">🌍 Công khai</SelectItem>
            <SelectItem value="private">🔒 Riêng tư</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={handleResetFilters}
          className="gap-2 hover:bg-accent"
        >
          <RotateCcw className="h-4 w-4" />
          Đặt lại
        </Button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border/50 bg-card overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">
              {searchTerm || filterType !== "all" || filterCategory !== "all"
                ? "Không tìm thấy sự kiện nào"
                : "Chưa có sự kiện nào"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border/50">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">
                    Tên sự kiện
                  </th>
                  <th className="text-left p-4 font-semibold text-sm">Ngày</th>
                  <th className="text-left p-4 font-semibold text-sm">
                    Loại lịch
                  </th>
                  <th className="text-left p-4 font-semibold text-sm">Loại</th>
                  <th className="text-left p-4 font-semibold text-sm">
                    Hiển thị
                  </th>
                  <th className="text-left p-4 font-semibold text-sm">
                    Lặp lại
                  </th>
                  <th className="text-right p-4 font-semibold text-sm">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedDates.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {item.name}
                        </div>
                        {item.description && (
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {item.day}/{item.month}
                          {item.year && `/${item.year}`}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={
                          item.date_type === "lunar"
                            ? "border-purple-500 text-purple-700 dark:text-purple-400"
                            : "border-amber-500 text-amber-700 dark:text-amber-400"
                        }
                      >
                        {item.date_type === "lunar" ? (
                          <>
                            <Moon className="h-3 w-3 mr-1" />
                            Âm lịch
                          </>
                        ) : (
                          <>
                            <Sun className="h-3 w-3 mr-1" />
                            Dương lịch
                          </>
                        )}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={item.is_holiday ? "destructive" : "default"}
                      >
                        {item.is_holiday ? (
                          <>
                            <Star className="h-3 w-3 mr-1" />
                            Ngày lễ
                          </>
                        ) : (
                          <>
                            <Calendar className="h-3 w-3 mr-1" />
                            Sự kiện
                          </>
                        )}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={item.is_public ? "default" : "secondary"}
                        className={
                          item.is_public
                            ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                        }
                      >
                        {item.is_public ? <>🌍 Công khai</> : <>🔒 Riêng tư</>}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {item.is_recurring ? (
                        <Badge variant="outline" className="border-green-500">
                          Hàng năm
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-gray-400">
                          Một lần
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="h-4 w-4 text-red-600 dark:text-red-400 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredDates.length > 0 && (
          <div className="border-t border-border/50 px-4 py-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {startIndex + 1} -{" "}
              {Math.min(endIndex, filteredDates.length)} trong tổng số{" "}
              {filteredDates.length} sự kiện
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="gap-1"
                  title="Trang đầu"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <ChevronLeft className="h-4 w-4 -ml-2" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={`min-w-[36px] ${
                              currentPage === page
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                : ""
                            }`}
                          >
                            {page}
                          </Button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span
                            key={page}
                            className="px-2 text-muted-foreground"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                  title="Trang cuối"
                >
                  <ChevronRight className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4 -ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <AddEventModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingEvent={editingEvent}
      />
    </div>
  );
}
