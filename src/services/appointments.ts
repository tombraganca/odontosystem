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

  // Métodos de filtro (usando query params no frontend)
  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    try {
      const appointments = await this.getAppointments()
      return appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.scheduledDate).toISOString().split('T')[0]
        return appointmentDate === date
      })
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido ao buscar consultas por data')
    }
  },

  async getAppointmentsByDentist(dentistId: string): Promise<Appointment[]> {
    try {
      const appointments = await this.getAppointments()
      return appointments.filter(appointment => appointment.dentistId === dentistId)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error(`Erro desconhecido ao buscar consultas do dentista ${dentistId}`)
    }
  },

  async getAppointmentsByUser(userId: string): Promise<Appointment[]> {
    try {
      const appointments = await this.getAppointments()
      return appointments.filter(appointment => appointment.userId === userId)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error(`Erro desconhecido ao buscar consultas do usuário ${userId}`)
    }
  },
}
