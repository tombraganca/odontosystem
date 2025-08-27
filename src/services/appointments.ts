// Serviços relacionados a consultas

import type {
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentStatusData,
} from '@/types/appointment'
import { api } from './api'

export const appointmentService = {
  async getAppointments(): Promise<Appointment[]> {
    try {
      const response = await api.get('/appointments')

      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido ao buscar consultas')
    }
  },

  async getAppointmentById(id: string): Promise<Appointment> {
    try {
      const response = await api.get(`/appointments/${id}`)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido ao buscar consulta')
    }
  },

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    try {
      const response = await api.post('/appointments', data)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido ao criar consulta')
    }
  },

  async updateAppointmentStatus(
    id: string,
    data: UpdateAppointmentStatusData
  ): Promise<Appointment> {
    try {
      const response = await api.patch(`/appointments/${id}/status`, data)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido ao atualizar status da consulta')
    }
  },

  async cancelAppointment(id: string): Promise<void> {
    try {
      await api.delete(`/appointments/${id}`)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error(`Erro desconhecido ao cancelar consulta ${id}`)
    }
  },

  // Buscar consultas por data
  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    try {
      const response = await api.get(`/appointments?date=${date}`)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido ao buscar consultas por data')
    }
  },

  // Buscar consultas por dentista
  async getAppointmentsByDentist(dentistId: string): Promise<Appointment[]> {
    try {
      const response = await api.get(`/appointments?dentistId=${dentistId}`)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error(
        `Erro desconhecido ao buscar consultas do dentista ${dentistId}`
      )
    }
  },

  // Buscar consultas por usuário
  async getAppointmentsByUser(userId: string): Promise<Appointment[]> {
    try {
      const response = await api.get(`/appointments?userId=${userId}`)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error(
        `Erro desconhecido ao buscar consultas do usuário ${userId}`
      )
    }
  },
}
