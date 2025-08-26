// Serviços relacionados a consultas
import api from './api'
import type { Appointment, CreateAppointmentData, UpdateAppointmentStatusData } from '@/types/appointment'

export const appointmentService = {
  async getAppointments(): Promise<Appointment[]> {
    const response = await api.get('/appointments')
    return response.data
  },

  async getAppointmentById(id: string): Promise<Appointment> {
    const response = await api.get(`/appointments/${id}`)
    return response.data
  },

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    const response = await api.post('/appointments', data)
    return response.data
  },

  async updateAppointmentStatus(id: string, data: UpdateAppointmentStatusData): Promise<Appointment> {
    const response = await api.patch(`/appointments/${id}/status`, data)
    return response.data
  },

  async cancelAppointment(id: string): Promise<void> {
    await api.delete(`/appointments/${id}`)
  },

  // Buscar consultas por data
  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const response = await api.get(`/appointments?date=${date}`)
    return response.data
  },

  // Buscar consultas por dentista
  async getAppointmentsByDentist(dentistId: string): Promise<Appointment[]> {
    const response = await api.get(`/appointments?dentistId=${dentistId}`)
    return response.data
  },

  // Buscar consultas por usuário
  async getAppointmentsByUser(userId: string): Promise<Appointment[]> {
    const response = await api.get(`/appointments?userId=${userId}`)
    return response.data
  },
}
