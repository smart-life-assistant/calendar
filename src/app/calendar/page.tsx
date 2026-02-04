import CalendarPageWrapper from "@/components/custom/calendar/CalendarPageWrapper";
import { getCalendarMetadata } from "@/lib/metadata";

export const metadata = getCalendarMetadata();

export default function MainCalendarPage() {
  return <CalendarPageWrapper />;
}
