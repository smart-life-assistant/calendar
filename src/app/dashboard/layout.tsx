import DashboardHeader from "@/components/custom/dashboard/DashboardHeader";
import Sidebar from "@/components/custom/dashboard/Sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    // add css to differentiate dashboard layout
    <div className="flex-1 flex bg-gray-50 border-t border-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader session={session} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
