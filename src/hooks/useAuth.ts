import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'

export function useAuthGuard() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const requireAuth = () => {
    if (!isAuthenticated) {
      navigate({ to: '/signin' })
      return false
    }
    return true
  }

  return { requireAuth, isAuthenticated }
}

// Hook para redirecionamento após login
export function useAuthRedirect() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const redirectAfterLogin = (redirectTo = '/') => {
    if (isAuthenticated) {
      navigate({ to: redirectTo })
    }
  }

  return { redirectAfterLogin, isAuthenticated }
}
