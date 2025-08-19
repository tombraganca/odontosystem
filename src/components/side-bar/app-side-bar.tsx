import { Link } from '@tanstack/react-router'
import { AlarmCheck, type LucideIcon } from 'lucide-react'
import type * as React from 'react'
import { NavMain } from '@/components/side-bar/nav-main'
import { NavSecondary } from '@/components/side-bar/nav-secondary'
import { NavUser } from '@/components/side-bar/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

type SideBarProps = {
  user: {
    name: string
    email: string
    avatar: string
  }
  navMain: Array<{
    title: string
    url: string
    icon: LucideIcon
  }>
  navSecondary: Array<{
    title: string
    url: string
    icon: LucideIcon
  }>
}

export function AppSidebar({
  navMain,
  navSecondary,
  user,
  ...props
}: SideBarProps & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/agenda">
                <AlarmCheck className="!size-5" />
                <span className="font-semibold text-base">Odonto System</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary className="mt-auto" items={navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
