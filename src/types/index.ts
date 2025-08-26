// Tipos globais da aplicação
export interface User {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  birthDate: string
}

export interface LoginResponse {
  access_token: string
  user?: User
}

export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

// Re-exporta tipos específicos
export type { Appointment, CreateAppointmentData, UpdateAppointmentStatusData } from './appointment'
export type { Dentist, CreateDentistData } from './dentist'
