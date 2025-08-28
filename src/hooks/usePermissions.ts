import { useAuth } from '@/context/AuthContext'
import { UserRole } from '@/types'

export function usePermissions() {
  const { user } = useAuth()

  const hasPermission = (requiredRole: UserRole) => {
    if (!user) {
      return false
    }

    if (user.role === UserRole.ADMIN) {
      return true
    }

    return user.role === requiredRole
  }

  return {
    isAdmin: user?.role === UserRole.ADMIN,
    hasPermission,
  }
}
