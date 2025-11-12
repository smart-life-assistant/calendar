"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { memo, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function SettingsPageMobile() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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

  const handleSaveProfile = useCallback(async () => {
    setSavingProfile(true);
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
          : "Có lỗi xảy ra khi cập nhật thông tin!"
      );
    } finally {
      setSavingProfile(false);
    }
  }, [fullName, username]);

  const handleChangePassword = useCallback(async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
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
          : "Có lỗi xảy ra khi đổi mật khẩu!"
      );
    } finally {
      setChangingPassword(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  return (
    <div className="space-y-4 p-3">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
            <SettingsIcon className="h-4 w-4 text-white" />
          </div>
          Cài đặt
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Quản lý thông tin cá nhân và tùy chọn hệ thống
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900">
            <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="font-semibold text-sm">Thông tin cá nhân</h2>
        </div>

        <div className="space-y-2">
          <div>
            <Label htmlFor="fullname" className="text-xs">
              Họ và tên
            </Label>
            <Input
              id="fullname"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-9 text-sm mt-1"
              placeholder="Nhập họ và tên"
            />
          </div>
          <div>
            <Label htmlFor="username" className="text-xs">
              Tên đăng nhập
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-9 text-sm mt-1"
              placeholder="Nhập tên đăng nhập"
            />
          </div>
        </div>

        <Button
          onClick={handleSaveProfile}
          disabled={savingProfile}
          className="w-full h-9 bg-gradient-to-r from-blue-600 to-indigo-600 active:scale-95 transition-transform"
        >
          {savingProfile ? (
            <>
              <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5 mr-2" />
              Lưu thay đổi
            </>
          )}
        </Button>
      </div>

      {/* Password Section */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900">
            <Lock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="font-semibold text-sm">Đổi mật khẩu</h2>
        </div>

        <div className="space-y-2">
          <div>
            <Label htmlFor="current-password" className="text-xs">
              Mật khẩu hiện tại
            </Label>
            <div className="relative mt-1">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-9 text-sm pr-9"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 active:scale-95 transition-transform"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="new-password" className="text-xs">
              Mật khẩu mới
            </Label>
            <div className="relative mt-1">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-9 text-sm pr-9"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 active:scale-95 transition-transform"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirm-password" className="text-xs">
              Xác nhận mật khẩu
            </Label>
            <div className="relative mt-1">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-9 text-sm pr-9"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 active:scale-95 transition-transform"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
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
          className="w-full h-9 bg-gradient-to-r from-indigo-600 to-purple-600 active:scale-95 transition-transform"
        >
          {changingPassword ? (
            <>
              <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
              Đang đổi...
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5 mr-2" />
              Đổi mật khẩu
            </>
          )}
        </Button>
      </div>

      {/* Appearance Section */}
      {mounted && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900">
              <Monitor className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="font-semibold text-sm">Giao diện</h2>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Chế độ hiển thị
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all active:scale-95 ${
                  theme === "light"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Sun
                  className={`h-4 w-4 ${
                    theme === "light"
                      ? "text-blue-600"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                />
                <span className="text-xs font-medium">Sáng</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all active:scale-95 ${
                  theme === "dark"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Moon
                  className={`h-4 w-4 ${
                    theme === "dark"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                />
                <span className="text-xs font-medium">Tối</span>
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all active:scale-95 ${
                  theme === "system"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Monitor
                  className={`h-4 w-4 ${
                    theme === "system"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                />
                <span className="text-xs font-medium">Hệ thống</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Section */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900">
            <Bell className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="font-semibold text-sm">Thông báo</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="push-notif" className="text-xs font-medium">
                Thông báo đẩy
              </Label>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Nhận thông báo trên thiết bị
              </p>
            </div>
            <Switch
              id="push-notif"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="event-remind" className="text-xs font-medium">
                Nhắc nhở sự kiện
              </Label>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Nhận nhắc về sự kiện sắp tới
              </p>
            </div>
            <Switch
              id="event-remind"
              checked={eventReminders}
              onCheckedChange={setEventReminders}
            />
          </div>
        </div>
      </div>

      {/* Language Section */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900">
            <Globe className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="font-semibold text-sm">Ngôn ngữ</h2>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div>
            <p className="text-sm font-medium">🇻🇳 Tiếng Việt</p>
            <p className="text-[10px] text-muted-foreground">
              Ngôn ngữ mặc định
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(SettingsPageMobile);
