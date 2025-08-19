import { createFileRoute, Outlet } from '@tanstack/react-router'
import {
  CircleGauge,
  HelpCircle,
  LayoutList,
  Search,
  Settings,
} from 'lucide-react'
import { AppSidebar } from '@/components/side-bar/app-side-bar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppHeader } from './-components/header'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: CircleGauge,
    },
    {
      title: 'Lifecycle',
      url: '#',
      icon: LayoutList,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: Settings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: HelpCircle,
    },
    {
      title: 'Search',
      url: '#',
      icon: Search,
    },
  ],
}

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar
        navMain={data.navMain}
        navSecondary={data.navSecondary}
        user={data.user}
      />
      <SidebarInset>
        <AppHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
