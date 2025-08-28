// Serviços relacionados a tratamentos

import { api } from './api'

export interface Treatment {
  id: string
  name: string
  description: string
  duration: number // em minutos
  price: number
  category: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTreatmentData {
  name: string
  description: string
  duration: number
  price: number
  category: string
}

export const treatmentService = {
  async getTreatments(): Promise<Treatment[]> {
    try {
      const response = await api.get('/treatments')
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido ao buscar tratamentos')
    }
  },

  async getTreatmentById(id: string): Promise<Treatment> {
    try {
      const response = await api.get(`/treatments/${id}`)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido ao buscar tratamento')
    }
  },

  async createTreatment(data: CreateTreatmentData): Promise<Treatment> {
    try {
      const response = await api.post('/treatments', data)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido ao criar tratamento')
    }
  },

  async updateTreatment(id: string, data: Partial<CreateTreatmentData>): Promise<Treatment> {
    try {
      const response = await api.put(`/treatments/${id}`, data)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido ao atualizar tratamento')
    }
  },

  async deleteTreatment(id: string): Promise<void> {
    try {
      await api.delete(`/treatments/${id}`)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido ao deletar tratamento')
    }
  },

  // Buscar tratamentos ativos
  async getActiveTreatments(): Promise<Treatment[]> {
    try {
      const response = await api.get('/treatments?active=true')
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido ao buscar tratamentos ativos')
    }
  },
}
