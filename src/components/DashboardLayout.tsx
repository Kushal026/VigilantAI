import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Shield } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-14 flex items-center border-b border-border/50 bg-card/30 backdrop-blur-sm px-4 gap-4 shrink-0">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            {title && (
              <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            )}
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse-neon" />
                <span>System Active</span>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
