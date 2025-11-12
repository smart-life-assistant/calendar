"use client";

import ClientOnly from "@/components/custom/ClientOnly";
import { Session } from "next-auth";
import { memo, useState } from "react";
import DashboardHeaderMobile from "./DashboardHeader";
import SidebarMobile from "./Sidebar";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  session: Session;
}

function DashboardLayoutClientMobile({
  children,
  session,
}: DashboardLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-1 bg-gray-50 dark:bg-gray-900">
      <ClientOnly>
        <SidebarMobile mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </ClientOnly>
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeaderMobile
          session={session}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}

export default memo(DashboardLayoutClientMobile);
