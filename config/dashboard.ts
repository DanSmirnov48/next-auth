import { type SidebarNavItem } from "@/types"

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[]
}

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Account",
      href: "/dashboard/account",
      icon: "settings",
      items: [],
    },
    {
      title: "Admin",
      href: "/dashboard/admin",
      icon: "admin",
      disabled: false,
      items: [],
    },
    {
      title: "Client",
      href: "/dashboard/client",
      icon: "client",
      disabled: false,
      items: [],
    },
    {
      title: "Server",
      href: "/dashboard/server",
      icon: "server",
      disabled: false,
      items: [],
    }
  ],
}