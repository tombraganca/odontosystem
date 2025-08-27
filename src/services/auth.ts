import type { LoginResponse, User } from '@/types'
import { api } from './api'

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  async register(userData: {
    name: string
    email: string
    phone: string
    cpf: string
    birthDate: string
    password: string
  }): Promise<User> {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  async logout(): Promise<void> {
    // Se houver endpoint de logout no backend
    // await api.post('/auth/logout')

    // Limpa dados locais
    localStorage.removeItem('tanstack.auth.token')
    localStorage.removeItem('tanstack.auth.user')
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile')
    return response.data
  },
}
