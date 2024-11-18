import { Outlet } from "@tanstack/react-router";
import { PrincipalSidebarFooter } from "@/entities/principal";
import { AppSidebar } from "@/shared/components/app-sidebar.tsx";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar.tsx";

export const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar principalSlot={<PrincipalSidebarFooter />} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
