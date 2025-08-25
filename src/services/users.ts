// Serviços relacionados a usuários
import api from './api'
import type { User } from '@/types'

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get('/users')
    return response.data
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const response = await api.post('/users', userData)
    return response.data
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`)
  },
}
