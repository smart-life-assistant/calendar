"use client";

import { useDeviceType } from "@/hooks/useDeviceType";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamic imports
const DashboardLayoutDesktop = dynamic(
  () => import("@/components/custom/desktop/dashboard/DashboardLayoutClient"),
  { ssr: true }
);

const DashboardLayoutMobile = dynamic(
  () => import("@/components/custom/mobile/dashboard/DashboardLayoutClient"),
  { ssr: true }
);

const DashboardLayoutTablet = DashboardLayoutMobile;

function LoadingSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-pulse" />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

interface DashboardLayoutWrapperProps {
  children: React.ReactNode;
  session: any;
}

export default function DashboardLayoutWrapper({
  children,
  session,
}: DashboardLayoutWrapperProps) {
  const deviceType = useDeviceType();

  return (
    <Suspense fallback={<LoadingSkeleton>{children}</LoadingSkeleton>}>
      {deviceType === "mobile" && (
        <DashboardLayoutMobile session={session}>
          {children}
        </DashboardLayoutMobile>
      )}
      {deviceType === "tablet" && (
        <DashboardLayoutTablet session={session}>
          {children}
        </DashboardLayoutTablet>
      )}
      {deviceType === "desktop" && (
        <DashboardLayoutDesktop session={session}>
          {children}
        </DashboardLayoutDesktop>
      )}
    </Suspense>
  );
}
