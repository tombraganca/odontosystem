// Serviços relacionados a dentistas
import api from './api'
import type { Dentist, CreateDentistData } from '@/types/dentist'

export const dentistService = {
  async getDentists(): Promise<Dentist[]> {
    const response = await api.get('/dentists')
    return response.data
  },

  async getDentistById(id: string): Promise<Dentist> {
    const response = await api.get(`/dentists/${id}`)
    return response.data
  },

  async createDentist(data: CreateDentistData): Promise<Dentist> {
    const response = await api.post('/dentists', data)
    return response.data
  },

  async updateDentist(id: string, data: Partial<CreateDentistData>): Promise<Dentist> {
    const response = await api.put(`/dentists/${id}`, data)
    return response.data
  },

  async deleteDentist(id: string): Promise<void> {
    await api.delete(`/dentists/${id}`)
  },

  // Buscar dentistas ativos
  async getActiveDentists(): Promise<Dentist[]> {
    const response = await api.get('/dentists?active=true')
    return response.data
  },
}
