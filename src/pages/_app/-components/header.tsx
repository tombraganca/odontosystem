import { useNavigate } from '@tanstack/react-router'
import {
  Bell,
  CreditCard,
  LogOut,
  Settings,
  Shield,
  UserCircle,
} from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useAuth } from '@/context/AuthContext'

export function AppHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/signin' })
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b p-1 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          className="mx-2 data-[orientation=vertical]:h-4"
          orientation="vertical"
        />
        <h1 className="font-medium text-base">Odonto Gávea</h1>

        <div className="ml-auto flex items-center gap-2">
          {/* Botão de Notificações */}
          <Button className="relative" size="sm" variant="ghost">
            <Bell className="h-4 w-4" />
            <span className="-top-1 -right-1 absolute h-2 w-2 rounded-full bg-red-500" />
          </Button>

          <ModeToggle />

          {/* Menu do Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="relative h-8 w-8 rounded-full" variant="ghost">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    alt={user?.name || 'Usuário'}
                    src="/avatars/user.jpg"
                  />
                  <AvatarFallback>
                    {user?.name ? getUserInitials(user.name) : 'US'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium text-sm leading-none">
                    {user?.name || 'Usuário'}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {user?.email || 'email@exemplo.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Faturamento</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                <span>Segurança</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
