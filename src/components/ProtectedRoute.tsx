import { Navigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { ROUTES } from '@/constants/routes'
import { usePermissions } from '@/hooks/usePermissions'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole
  fallbackPath?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallbackPath = ROUTES.HOME,
}: ProtectedRouteProps) {
  const { hasPermission } = usePermissions()

  if (requiredRole && !hasPermission(requiredRole)) {
    return <Navigate replace to={fallbackPath} />
  }

  return <>{children}</>
}

interface AdminOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { isAdmin } = usePermissions()

  if (!isAdmin) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
