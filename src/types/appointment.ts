// Tipos relacionados a consultas
export interface Appointment {
  id: string
  userId: string
  dentistId: string
  scheduledDate: string
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  notes: string
  treatmentType: string
  createdAt: string
  updatedAt: string
  // Relacionamentos
  user?: {
    id: string
    name: string
    email: string
    phone: string
  }
  dentist?: {
    id: string
    name: string
    specialty: string
  }
}

export interface CreateAppointmentData {
  userId: string
  dentistId: string
  scheduledDate: string
  treatmentType: string
  notes?: string
}

export interface UpdateAppointmentStatusData {
  status: Appointment['status']
}
