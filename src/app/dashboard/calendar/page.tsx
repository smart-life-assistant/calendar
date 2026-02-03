import CalendarPageWrapper from "@/components/custom/calendar/CalendarPageWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản Lý Lịch - Dashboard",
  description:
    "Quản lý lịch cá nhân, thêm sự kiện, ngày lễ riêng. Trang quản trị lịch Việt Nam.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardCalendarPage() {
  return <CalendarPageWrapper />;
}
