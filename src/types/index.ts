// Tipos globais da aplicação
export const UserRole = {
  ADMIN: 'ADMIN',
  COMMON: 'COMMON',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export interface User {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  birthDate: string
  role: UserRole
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
export type {
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentStatusData,
} from './appointment'
export type { CreateDentistData, Dentist } from './dentist'
