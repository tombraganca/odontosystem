// Tipos relacionados a dentistas
export interface Dentist {
  id: string
  name: string
  crm: string
  specialty: string
  phone: string
  email: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateDentistData {
  name: string
  crm: string
  specialty: string
  phone: string
  email: string
}
