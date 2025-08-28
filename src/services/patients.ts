// Serviços relacionados a pacientes

import { api } from './api'

export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  birthDate: string
  address?: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreatePatientData {
  name: string
  email: string
  phone: string
  cpf: string
  birthDate: string
  address?: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
}

export const patientService = {
  async getPatients(): Promise<Patient[]> {
    try {
      const response = await api.get('/patients')
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido ao buscar pacientes')
    }
  },

  async getPatientById(id: string): Promise<Patient> {
    try {
      const response = await api.get(`/patients/${id}`)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido ao buscar paciente')
    }
  },

  async createPatient(data: CreatePatientData): Promise<Patient> {
    try {
      const response = await api.post('/patients', data)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido ao criar paciente')
    }
  },

  async updatePatient(id: string, data: Partial<CreatePatientData>): Promise<Patient> {
    try {
      const response = await api.put(`/patients/${id}`, data)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido ao atualizar paciente')
    }
  },

  async deletePatient(id: string): Promise<void> {
    try {
      await api.delete(`/patients/${id}`)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido ao deletar paciente')
    }
  },
}
