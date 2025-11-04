"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  CalendarDays,
  Clock,
  FileText,
  Home,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Star,
  Sun,
  TrendingUp,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const router = useRouter();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="p-1 border-0 border-gray-300 dark:border-gray-700"
    >
      <CommandInput placeholder="Tìm kiếm hoặc nhập lệnh..." />
      <CommandList>
        <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/dashboard"))}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Tổng quan</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => router.push("/dashboard/calendar"))
            }
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>Lịch</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => router.push("/dashboard/holidays"))
            }
          >
            <Star className="mr-2 h-4 w-4" />
            <span>Ngày lễ</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/dashboard/stats"))}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Thống kê</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/dashboard/history"))}
          >
            <Clock className="mr-2 h-4 w-4" />
            <span>Lịch sử</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/dashboard/users"))}
          >
            <Users className="mr-2 h-4 w-4" />
            <span>Người dùng</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => router.push("/dashboard/settings"))
            }
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Cài đặt</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Chế độ sáng</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Chế độ tối</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>Theo hệ thống</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => window.print())}>
            <FileText className="mr-2 h-4 w-4" />
            <span>In trang</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Account">
          <CommandItem
            onSelect={() => runCommand(() => signOut({ redirectTo: "/login" }))}
            className="text-red-600 dark:text-red-400"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Đăng xuất</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
