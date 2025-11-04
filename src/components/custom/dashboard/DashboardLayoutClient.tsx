"use client";

import ClientOnly from "@/components/custom/ClientOnly";
import { Session } from "next-auth";
import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  session: Session;
}

export default function DashboardLayoutClient({
  children,
  session,
}: DashboardLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-1 bg-gray-50 dark:bg-gray-900">
      <ClientOnly>
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </ClientOnly>
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          session={session}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
