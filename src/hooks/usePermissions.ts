import { useAuth } from '@/context/AuthContext'
import { UserRole } from '@/types'

export function usePermissions() {
  const { user } = useAuth()

  const isAdmin = user?.role === UserRole.ADMIN
  const isCommon = user?.role === UserRole.COMMON

  const hasPermission = (requiredRole: UserRole) => {
    if (!user) {
      return false
    }

    // Admin tem acesso a tudo
    if (user.role === UserRole.ADMIN) {
      return true
    }

    // Verifica se o usuário tem o role específico
    return user.role === requiredRole
  }

  return {
    isAdmin,
    isCommon,
    hasPermission,
    userRole: user?.role,
  }
}
