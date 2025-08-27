// Constantes relacionadas às rotas da aplicação
export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  AGENDA: '/agenda',
  PATIENTS: '/patients',
  PATIENT_DETAIL: '/patients/$patientId',
  DENTISTS: '/dentists',
  NOT_FOUND: '/404',
} as const

export const API_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
  USERS: '/users',
  APPOINTMENTS: '/appointments',
} as const
