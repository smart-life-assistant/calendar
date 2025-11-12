"use client";

import { useDeviceType } from "@/hooks/useDeviceType";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamic imports for code splitting
const HolidaysManagementDesktop = dynamic(
  () => import("@/components/custom/desktop/dashboard/HolidaysManagement"),
  { loading: () => <LoadingSkeleton /> }
);

const HolidaysManagementMobile = dynamic(
  () => import("@/components/custom/mobile/dashboard/HolidaysManagement"),
  { loading: () => <LoadingSkeleton /> }
);

// Tablet uses mobile version for now
const HolidaysManagementTablet = HolidaysManagementMobile;

function LoadingSkeleton() {
  return (
    <div className="space-y-4 p-3 md:p-6">
      <div className="flex items-center justify-between animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl"
          />
        ))}
      </div>

      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    </div>
  );
}

export default function HolidaysManagementWrapper() {
  const deviceType = useDeviceType();

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      {deviceType === "mobile" && <HolidaysManagementMobile />}
      {deviceType === "tablet" && <HolidaysManagementTablet />}
      {deviceType === "desktop" && <HolidaysManagementDesktop />}
    </Suspense>
  );
}
