// Constantes relacionadas às rotas da aplicação
export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  AGENDA: '/agenda',
  PATIENTS: '/patients',
  PATIENT_DETAIL: '/patients/$patientId',
} as const

export const API_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
  USERS: '/users',
  APPOINTMENTS: '/appointments',
} as const
