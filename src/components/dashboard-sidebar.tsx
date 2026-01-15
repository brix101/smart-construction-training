import { Link } from '@tanstack/react-router'
import { ArrowLeft, ChevronLeftIcon } from 'lucide-react'

import { Icons } from '@/components/icons'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { dashboardConfig } from '@/config/site'

export function DashboardSideBar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              asChild
            >
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <ArrowLeft />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Go to App</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {dashboardConfig.navItems.map((item, idx) => {
              const Icon = item.icon ? Icons[item.icon] : ChevronLeftIcon

              return (
                <SidebarMenuItem key={idx}>
                  <SidebarMenuButton asChild>
                    <Link
                      aria-label={item.title}
                      to={item.href ?? '/'}
                      activeProps={{
                        className:
                          'bg-sidebar-accent font-medium text-sidebar-accent-foreground',
                      }}
                    >
                      {Icon && <Icon />}
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
