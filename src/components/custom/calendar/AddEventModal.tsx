"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  getLunarMonthDays,
  getSolarMonthDays,
  getYearCanChiString,
} from "@/lib/lunar-calendar";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Loader2, Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface SpecialDate {
  id?: string;
  name: string;
  description?: string;
  date_type: "lunar" | "solar";
  day: number;
  month: number;
  year?: number | null;
  is_holiday: boolean;
  is_recurring: boolean;
}

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedDate?: Date | null;
  editingEvent?: SpecialDate | null;
}

export default function AddEventModal({
  isOpen,
  onClose,
  onSuccess,
  selectedDate,
  editingEvent,
}: AddEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SpecialDate>({
    name: "",
    description: "",
    date_type: "solar",
    day: 1,
    month: 1,
    year: null,
    is_holiday: false,
    is_recurring: true,
  });

  // Reset form when modal opens/closes or editing event changes
  useEffect(() => {
    if (editingEvent) {
      setFormData({
        ...editingEvent,
        year: editingEvent.year || null,
      });
    } else if (selectedDate) {
      setFormData({
        name: "",
        description: "",
        date_type: "solar",
        day: selectedDate.getDate(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
        is_holiday: false,
        is_recurring: false,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        date_type: "solar",
        day: 1,
        month: 1,
        year: null,
        is_holiday: false,
        is_recurring: true,
      });
    }
  }, [editingEvent, selectedDate, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = "/api/special-dates";
      const method = editingEvent ? "PUT" : "POST";

      const dataToSend = {
        ...formData,
        year: formData.is_recurring ? null : formData.year,
        ...(editingEvent && { id: editingEvent.id }),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success(
          editingEvent
            ? "Cập nhật sự kiện thành công!"
            : "Thêm sự kiện thành công!"
        );
        onSuccess();
        onClose();
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Calculate max days based on month, year, and calendar type
  const maxDays = useMemo(() => {
    if (formData.date_type === "lunar") {
      if (!formData.year) {
        // When no year selected, default to 30 days
        return 30;
      }

      try {
        // Use the accurate library function
        const days = getLunarMonthDays(formData.month, formData.year, 7);
        console.log(
          `[Lunar ${formData.month}/${formData.year}] Month has ${days} days (from library)`
        );
        return days;
      } catch (error) {
        console.error("Error getting lunar month days:", error);
        // Fallback: most lunar months have 29-30 days
        return 30;
      }
    } else {
      // Solar calendar - use library function
      return getSolarMonthDays(formData.month, formData.year || undefined);
    }
  }, [formData.month, formData.year, formData.date_type]);

  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  // Auto-adjust day if it exceeds max days
  useEffect(() => {
    if (formData.day > maxDays) {
      setFormData((prev) => ({ ...prev, day: maxDays }));
    }
  }, [maxDays, formData.day]);

  // Get Can Chi for selected year using library function
  const yearCanChi = formData.year ? getYearCanChiString(formData.year) : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <Calendar className="h-5 w-5" />
                  </div>
                  {editingEvent ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới"}
                </DialogTitle>
                <DialogDescription>
                  {editingEvent
                    ? "Cập nhật thông tin sự kiện trong lịch"
                    : "Thêm sự kiện hoặc ngày lễ vào lịch của bạn"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 py-4">
                {/* Event Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold">
                    Tên sự kiện <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="VD: Tết Nguyên Đán, Sinh nhật..."
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="h-11"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-base font-semibold"
                  >
                    Mô tả
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Thêm mô tả cho sự kiện..."
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                {/* Date Type */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">
                    Loại lịch <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, date_type: "solar" })
                      }
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.date_type === "solar"
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-950/20"
                          : "border-gray-200 dark:border-gray-800 hover:border-blue-300"
                      }`}
                    >
                      <Sun className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                      <div className="font-semibold">Dương lịch</div>
                      <div className="text-xs text-muted-foreground">
                        Lịch thông thường
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, date_type: "lunar" })
                      }
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.date_type === "lunar"
                          ? "border-purple-600 bg-purple-50 dark:bg-purple-950/20"
                          : "border-gray-200 dark:border-gray-800 hover:border-purple-300"
                      }`}
                    >
                      <Moon className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                      <div className="font-semibold">Âm lịch</div>
                      <div className="text-xs text-muted-foreground">
                        Lịch truyền thống
                      </div>
                    </button>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="day" className="text-sm font-semibold">
                      Ngày <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.day.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, day: parseInt(value) })
                      }
                    >
                      <SelectTrigger id="day" className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {days.map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="month" className="text-sm font-semibold">
                      Tháng <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.month.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, month: parseInt(value) })
                      }
                    >
                      <SelectTrigger id="month" className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <SelectItem key={month} value={month.toString()}>
                              Tháng {month}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-sm font-semibold">
                      Năm
                    </Label>
                    <Select
                      value={formData.year?.toString() || ""}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          year: value ? parseInt(value) : null,
                        })
                      }
                      disabled={formData.is_recurring}
                    >
                      <SelectTrigger id="year" className="h-11">
                        <SelectValue placeholder="---" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.year && yearCanChi && (
                      <div className="text-xs text-muted-foreground font-medium mt-1 px-1">
                        🐉 Năm {yearCanChi}
                      </div>
                    )}
                  </div>
                </div>

                {/* Switches */}
                <div className="space-y-4 rounded-xl border border-border/50 p-4 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="is_holiday"
                        className="text-sm font-semibold"
                      >
                        Ngày lễ / Ngày đặc biệt
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Đánh dấu là ngày lễ quan trọng
                      </p>
                    </div>
                    <Switch
                      id="is_holiday"
                      checked={formData.is_holiday}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_holiday: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="is_recurring"
                        className="text-sm font-semibold"
                      >
                        Lặp lại hàng năm
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Sự kiện xuất hiện mỗi năm
                      </p>
                    </div>
                    <Switch
                      id="is_recurring"
                      checked={formData.is_recurring}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          is_recurring: checked,
                          year: checked ? null : formData.year,
                        })
                      }
                    />
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingEvent ? "Cập nhật" : "Thêm sự kiện"}
                  </Button>
                </DialogFooter>
              </form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
