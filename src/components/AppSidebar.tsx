import {
  Shield, LayoutDashboard, Users, AlertTriangle, Brain, Search, Settings, LogOut, ChevronLeft
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "User Activity", url: "/activity", icon: Users },
  { title: "Threat Alerts", url: "/alerts", icon: AlertTriangle },
  { title: "AI Risk Analysis", url: "/risk-analysis", icon: Brain },
  { title: "Investigation", url: "/investigation", icon: Search },
];

const adminItems = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut, user } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent>
        {/* Brand */}
        <div className={`p-4 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center neon-glow shrink-0">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-sm gradient-text">VigilantAI</h1>
              <p className="text-[10px] text-muted-foreground">Threat Detection</p>
            </div>
          )}
        </div>

        {/* Main Nav */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">
            {!collapsed && "Monitoring"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">
            {!collapsed && "Admin"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && user && (
          <div className="text-xs text-muted-foreground truncate mb-2 px-2">
            {user.email}
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          onClick={signOut}
          className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
