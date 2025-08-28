import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { appointmentService } from '@/services/appointments'
import type { CreateAppointmentData, UpdateAppointmentStatusData } from '@/types/appointment'
import { toast } from 'sonner'
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns'

// Query Keys para organização e invalidação
const QUERY_KEYS = {
  appointments: ['appointments'] as const,
  appointment: (id: string) => ['appointments', id] as const,
  appointmentsByDate: (date: string) => ['appointments', 'date', date] as const,
  appointmentsByDateRange: (startDate: string, endDate: string) => 
    ['appointments', 'date-range', startDate, endDate] as const,
  appointmentsByDentist: (dentistId: string) => ['appointments', 'dentist', dentistId] as const,
  appointmentsByUser: (userId: string) => ['appointments', 'user', userId] as const,
  upcomingAppointments: ['appointments', 'upcoming'] as const,
}

// Hook para buscar todos os appointments
export function useAppointments() {
  return useQuery({
    queryKey: QUERY_KEYS.appointments,
    queryFn: appointmentService.getAppointments,
    staleTime: 2 * 60 * 1000, // 2 minutos - dados ficam frescos
    gcTime: 5 * 60 * 1000, // 5 minutos - tempo em cache
  })
}

// Hook para buscar appointment específico
export function useAppointment(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.appointment(id),
    queryFn: () => appointmentService.getAppointmentById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para appointments por data específica
export function useAppointmentsByDate(date: Date | string) {
  const dateStr = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd')
  
  return useQuery({
    queryKey: QUERY_KEYS.appointmentsByDate(dateStr),
    queryFn: () => appointmentService.getAppointmentsByDate(dateStr),
    enabled: !!date,
    staleTime: 1 * 60 * 1000, // 1 minuto - agenda muda frequentemente
  })
}

// Hook para appointments de uma semana (mais eficiente para agenda semanal)
export function useAppointmentsByWeek(weekDate: Date) {
  const startDate = format(startOfWeek(weekDate, { weekStartsOn: 0 }), 'yyyy-MM-dd')
  const endDate = format(endOfWeek(weekDate, { weekStartsOn: 0 }), 'yyyy-MM-dd')
  
  return useQuery({
    queryKey: QUERY_KEYS.appointmentsByDateRange(startDate, endDate),
    queryFn: async () => {
      // Busca todos os appointments e filtra pela semana no frontend
      // Em produção, seria ideal ter um endpoint que aceite range de datas
      const allAppointments = await appointmentService.getAppointments()
      const weekStart = startOfDay(startOfWeek(weekDate, { weekStartsOn: 0 }))
      const weekEnd = endOfDay(endOfWeek(weekDate, { weekStartsOn: 0 }))
      
      return allAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.scheduledDate)
        return appointmentDate >= weekStart && appointmentDate <= weekEnd
      })
    },
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000,
  })
}

// Hook para appointments por dentista
export function useAppointmentsByDentist(dentistId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.appointmentsByDentist(dentistId),
    queryFn: () => appointmentService.getAppointmentsByDentist(dentistId),
    enabled: !!dentistId,
    staleTime: 2 * 60 * 1000,
  })
}

// Hook para appointments por usuário
export function useAppointmentsByUser(userId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.appointmentsByUser(userId),
    queryFn: () => appointmentService.getAppointmentsByUser(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  })
}

// Hook para próximos appointments (hoje e próximos dias)
export function useUpcomingAppointments(days = 7) {
  return useQuery({
    queryKey: [...QUERY_KEYS.upcomingAppointments, days],
    queryFn: async () => {
      const allAppointments = await appointmentService.getAppointments()
      const now = new Date()
      const futureLimit = new Date()
      futureLimit.setDate(now.getDate() + days)
      
      return allAppointments
        .filter(appointment => {
          const appointmentDate = new Date(appointment.scheduledDate)
          return appointmentDate >= now && appointmentDate <= futureLimit
        })
        .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
        .slice(0, 10) // Limita a 10 próximos
    },
    staleTime: 1 * 60 * 1000, // 1 minuto
    refetchInterval: 5 * 60 * 1000, // Atualiza a cada 5 minutos
  })
}

// Mutation para criar appointment
export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAppointmentData) => appointmentService.createAppointment(data),
    onSuccess: (newAppointment) => {
      // Invalida todas as queries relacionadas
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appointments })
      
      // Invalida queries específicas baseadas na data do novo appointment
      const appointmentDate = format(new Date(newAppointment.scheduledDate), 'yyyy-MM-dd')
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.appointmentsByDate(appointmentDate) 
      })
      
      // Invalida queries de range que podem incluir esta data
      queryClient.invalidateQueries({ 
        queryKey: ['appointments', 'date-range'] 
      })
      
      // Invalida appointments por dentista e usuário
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.appointmentsByDentist(newAppointment.dentistId) 
      })
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.appointmentsByUser(newAppointment.userId) 
      })
      
      // Invalida próximos appointments
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.upcomingAppointments 
      })
      
      toast.success('Consulta criada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar consulta')
    },
  })
}

// Mutation para atualizar status do appointment
export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentStatusData }) =>
      appointmentService.updateAppointmentStatus(id, data),
    onSuccess: (updatedAppointment) => {
      // Atualiza o cache do appointment específico
      queryClient.setQueryData(
        QUERY_KEYS.appointment(updatedAppointment.id),
        updatedAppointment
      )
      
      // Invalida listas que podem conter este appointment
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appointments })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.upcomingAppointments })
      
      // Invalida queries por data
      const appointmentDate = format(new Date(updatedAppointment.scheduledDate), 'yyyy-MM-dd')
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.appointmentsByDate(appointmentDate) 
      })
      
      toast.success('Status da consulta atualizado!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar status da consulta')
    },
  })
}

// Mutation para cancelar appointment
export function useCancelAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => appointmentService.cancelAppointment(id),
    onSuccess: (_, appointmentId) => {
      // Remove o appointment específico do cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.appointment(appointmentId) })
      
      // Invalida todas as listas
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appointments })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.upcomingAppointments })
      queryClient.invalidateQueries({ queryKey: ['appointments', 'date'] })
      queryClient.invalidateQueries({ queryKey: ['appointments', 'date-range'] })
      queryClient.invalidateQueries({ queryKey: ['appointments', 'dentist'] })
      queryClient.invalidateQueries({ queryKey: ['appointments', 'user'] })
      
      toast.success('Consulta cancelada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao cancelar consulta')
    },
  })
}

// Hook para prefetch de dados (otimização)
export function usePrefetchAppointments() {
  const queryClient = useQueryClient()

  const prefetchWeek = (weekDate: Date) => {
    const startDate = format(startOfWeek(weekDate, { weekStartsOn: 0 }), 'yyyy-MM-dd')
    const endDate = format(endOfWeek(weekDate, { weekStartsOn: 0 }), 'yyyy-MM-dd')
    
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.appointmentsByDateRange(startDate, endDate),
      queryFn: async () => {
        const allAppointments = await appointmentService.getAppointments()
        const weekStart = startOfDay(startOfWeek(weekDate, { weekStartsOn: 0 }))
        const weekEnd = endOfDay(endOfWeek(weekDate, { weekStartsOn: 0 }))
        
        return allAppointments.filter(appointment => {
          const appointmentDate = new Date(appointment.scheduledDate)
          return appointmentDate >= weekStart && appointmentDate <= weekEnd
        })
      },
      staleTime: 1 * 60 * 1000,
    })
  }

  return { prefetchWeek }
}
