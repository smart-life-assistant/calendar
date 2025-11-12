import DashboardLayoutWrapper from "@/components/custom/dashboard/DashboardLayoutWrapper";
import { CommandPaletteProvider } from "@/components/custom/desktop/dashboard/CommandPaletteProvider";
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
    <CommandPaletteProvider>
      <DashboardLayoutWrapper session={session}>
        {children}
      </DashboardLayoutWrapper>
    </CommandPaletteProvider>
  );
}
