import CalendarPageWrapper from "@/components/custom/calendar/CalendarPageWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xem Lịch Âm Dương - Lịch Vạn Niên Việt Nam",
  description:
    "Xem lịch âm dương Việt Nam, tra cứu lịch vạn niên, can chi, ngày tốt xấu, ngày lễ tết Việt Nam. Công cụ xem lịch online chính xác và dễ sử dụng nhất.",
  keywords: [
    "xem lịch âm",
    "lịch âm dương",
    "lịch vạn niên",
    "can chi",
    "ngày tốt xấu",
    "xem lịch online",
    "lịch việt nam",
  ],
  openGraph: {
    title: "Xem Lịch Âm Dương - Lịch Vạn Niên Việt Nam",
    description:
      "Xem lịch âm dương Việt Nam, tra cứu lịch vạn niên, can chi, ngày tốt xấu, ngày lễ tết Việt Nam.",
    url: "/calendar",
  },
};

export default function MainCalendarPage() {
  return <CalendarPageWrapper />;
}
