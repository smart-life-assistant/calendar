"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import {
  Bell,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  Monitor,
  Moon,
  Save,
  Settings as SettingsIcon,
  Sun,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTopLoader } from "nextjs-toploader";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const loader = useTopLoader();

  // Profile settings
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notifications
  const [pushNotifications, setPushNotifications] = useState(false);
  const [eventReminders, setEventReminders] = useState(true);

  // Loading states
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (session?.user) {
      setFullName(session.user.name || "");
      setUsername(session.user.username || "");
    }
  }, [session]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    loader.start();
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          username: username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi cập nhật thông tin!",
      );
    } finally {
      setSavingProfile(false);
      loader.done();
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setChangingPassword(true);
    loader.start();
    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      toast.success("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi đổi mật khẩu!",
      );
    } finally {
      setChangingPassword(false);
      loader.done();
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600">
          <SettingsIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Cài đặt
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin cá nhân và tùy chỉnh hệ thống
          </p>
        </div>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border/50 bg-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ và tên"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
            />
          </div>

          <Button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {savingProfile ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border/50 bg-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
          <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại"
                className="pr-10"
                autoComplete="new-password"
                data-form-type="other"
                data-lpignore="true"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                className="pr-10"
                autoComplete="new-password"
                data-form-type="other"
                data-lpignore="true"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="pr-10"
                autoComplete="new-password"
                data-form-type="other"
                data-lpignore="true"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={
              changingPassword ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword
            }
            variant="destructive"
          >
            {changingPassword ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang đổi...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Đổi mật khẩu
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Theme Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border/50 bg-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-semibold">Giao diện</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.button
              onClick={() => setTheme("light")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                theme === "light"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950/20"
                  : "border-border hover:border-blue-300"
              }`}
            >
              <Sun className="h-8 w-8 mx-auto mb-2 text-amber-500" />
              <div className="font-semibold">Sáng</div>
              <div className="text-xs text-muted-foreground">Light mode</div>
            </motion.button>

            <motion.button
              onClick={() => setTheme("dark")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                theme === "dark"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950/20"
                  : "border-border hover:border-blue-300"
              }`}
            >
              <Moon className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
              <div className="font-semibold">Tối</div>
              <div className="text-xs text-muted-foreground">Dark mode</div>
            </motion.button>

            <motion.button
              onClick={() => setTheme("system")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                theme === "system"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950/20"
                  : "border-border hover:border-blue-300"
              }`}
            >
              <Monitor className="h-8 w-8 mx-auto mb-2 text-gray-500" />
              <div className="font-semibold">Hệ thống</div>
              <div className="text-xs text-muted-foreground">Auto</div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-border/50 bg-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
          <h2 className="text-xl font-semibold">Thông báo</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
            <div className="space-y-0.5">
              <div className="font-medium">Thông báo đẩy</div>
              <div className="text-sm text-muted-foreground">
                Nhận thông báo trên trình duyệt
              </div>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
            <div className="space-y-0.5">
              <div className="font-medium">Nhắc nhở sự kiện</div>
              <div className="text-sm text-muted-foreground">
                Nhắc nhở trước 1 ngày về các sự kiện sắp tới
              </div>
            </div>
            <Switch
              checked={eventReminders}
              onCheckedChange={setEventReminders}
            />
          </div>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border border-border/50 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6"
      >
        <div className="text-center space-y-2">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-bold">Lịch Việt Nam</h3>
          <p className="text-sm text-muted-foreground">
            Phiên bản 1.0.0 - © 2025
          </p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Ứng dụng quản lý lịch âm dương, sự kiện và ngày lễ Việt Nam
          </p>
        </div>
      </motion.div>
    </div>
  );
}
