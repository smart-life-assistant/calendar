"use client";

import { useDeviceType } from "@/hooks/useDeviceType";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamic imports
const SettingsPageDesktop = dynamic(
  () => import("@/components/custom/desktop/dashboard/SettingsPage"),
  { loading: () => <LoadingSkeleton /> }
);

const SettingsPageMobile = dynamic(
  () => import("@/components/custom/mobile/dashboard/SettingsPage"),
  { loading: () => <LoadingSkeleton /> }
);

const SettingsPageTablet = SettingsPageMobile;

function LoadingSkeleton() {
  return (
    <div className="space-y-4 p-3 md:p-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>

      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-lg p-4 space-y-3"
        >
          <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="space-y-2">
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        </div>
      ))}

      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    </div>
  );
}

export default function SettingsPageWrapper() {
  const deviceType = useDeviceType();

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      {deviceType === "mobile" && <SettingsPageMobile />}
      {deviceType === "tablet" && <SettingsPageTablet />}
      {deviceType === "desktop" && <SettingsPageDesktop />}
    </Suspense>
  );
}
