import { CommandPaletteProvider } from "@/components/custom/dashboard/CommandPaletteProvider";
import DashboardLayoutClient from "@/components/custom/dashboard/DashboardLayoutClient";
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
      <DashboardLayoutClient session={session}>
        {children}
      </DashboardLayoutClient>
    </CommandPaletteProvider>
  );
}
