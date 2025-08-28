import { createFileRoute, Outlet } from '@tanstack/react-router'
import {
  CalendarDays,
  CircleGauge,
  HelpCircle,
  LayoutList,
  Search,
  Settings,
  Stethoscope,
  Users,
} from 'lucide-react'
import { AppSidebar } from '@/components/layout/side-bar/app-side-bar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '../../context/AuthContext'
import { UserRole } from '../../types'
import { AppHeader } from './-components/header'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()

  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
      {
        title: 'Agenda',
        url: ROUTES.AGENDA,
        icon: CalendarDays,
      },
      {
        title: 'Pacientes',
        url: ROUTES.PATIENTS,
        icon: Users,
      },
      {
        title: 'Dashboard',
        url: ROUTES.HOME,
        icon: CircleGauge,
      },
      ...(user?.role === UserRole.ADMIN
        ? [
            {
              title: 'Dentistas',
              url: ROUTES.DENTISTS,
              icon: Stethoscope,
            },
          ]
        : []),
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
