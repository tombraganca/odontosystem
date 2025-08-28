import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { sleep } from '@/lib/utils'
import { authService } from '@/services/auth'
import type { User } from '@/types'

export interface AuthContext {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  user: User | null
  token: string | null
}

const AuthContext = createContext<AuthContext | null>(null)

const userKey = 'tanstack.auth.user'
const tokenKey = 'tanstack.auth.token'

function getStoredUser() {
  return JSON.parse(localStorage.getItem(userKey) || 'null') as User | null
}

function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem(userKey, JSON.stringify(user))
  } else {
    localStorage.removeItem(userKey)
  }
}

function getStoredToken() {
  return localStorage.getItem(tokenKey)
}

function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(tokenKey, token)
  } else {
    localStorage.removeItem(tokenKey)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(getStoredToken())
  const isAuthenticated = !!token

  const logout = useCallback(async () => {
    await sleep()
    await authService.logout()
    setStoredUser(null)
    setStoredToken(null)
    setUser(null)
    setToken(null)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password)
      setStoredToken(response.access_token)
      setStoredUser(response.user ?? null)
    } catch {
      throw new Error('Credenciais inválidas')
    }
  }, [])

  useEffect(() => {
    const storedToken = getStoredToken()
    if (!storedToken) {
      return
    }
    const storedUser = getStoredUser()
    if (!storedUser) {
      return
    }
    setToken(storedToken)
    setUser(storedUser)
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
