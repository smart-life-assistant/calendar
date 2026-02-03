import CalendarPageWrapper from "@/components/custom/calendar/CalendarPageWrapper";
import { CURRENT_YEAR } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Xem Lịch Vạn Niên ${CURRENT_YEAR} - Tra Cứu Âm Dương Lịch Việt Nam Online`,
  description: `Xem lịch vạn niên Việt Nam ${CURRENT_YEAR} online miễn phí. Tra cứu lịch âm dương chính xác, xem ngày tốt xấu theo âm lịch, can chi, giờ hoàng đạo, ngày lễ tết Việt Nam. Công cụ xem lịch vạn niên online chính xác nhất, cập nhật liên tục.`,
  keywords: [
    "xem lịch vạn niên",
    `lịch vạn niên ${CURRENT_YEAR}`,
    "lịch vạn niên việt nam",
    "tra cứu lịch vạn niên",
    "xem lịch âm",
    "lịch âm dương",
    "âm dương lịch",
    "can chi",
    "ngày tốt xấu",
    "giờ hoàng đạo",
    "xem lịch online",
    "lịch việt nam",
    "lịch vạn sự",
  ],
  openGraph: {
    title: `Xem Lịch Vạn Niên ${CURRENT_YEAR} - Tra Cứu Âm Dương Lịch Việt Nam Online`,
    description: `Xem lịch vạn niên Việt Nam ${CURRENT_YEAR} online miễn phí. Tra cứu lịch âm dương, can chi, ngày tốt xấu, giờ hoàng đạo, ngày lễ tết.`,
    url: "/calendar",
  },
};

export default function MainCalendarPage() {
  return <CalendarPageWrapper />;
}
