import { createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { CreateAppointmentDialog } from '@/components/appointments/create-appointment-dialog-new'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppointmentsByWeek, useUpcomingAppointments, usePrefetchAppointments } from '@/hooks/useAppointments'
import type { Appointment } from '@/types'
import { WeeklySchedule } from '../-components/weekly-schedule'

export const Route = createFileRoute('/_app/agenda/')({
  component: AgendaPage,
})

// Interface para o WeeklySchedule (formato local)
interface WeeklyAppointment {
  id: string
  patientName: string
  type: string
  startTime: string
  endTime: string
  date: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

const convertApiAppointmentsToWeekly = (
  apiAppointments: Appointment[]
): WeeklyAppointment[] => {
  return apiAppointments.map((appointment) => {
    const scheduledDate = new Date(appointment.scheduledDate)
    const startTime = format(scheduledDate, 'HH:mm')

    const endDate = new Date(scheduledDate.getTime() + 30 * 60_000) // +30 minutos
    const endTime = format(endDate, 'HH:mm')

    const statusMap = {
      SCHEDULED: 'scheduled' as const,
      CONFIRMED: 'scheduled' as const,
      IN_PROGRESS: 'scheduled' as const,
      COMPLETED: 'completed' as const,
      CANCELLED: 'cancelled' as const,
      NO_SHOW: 'cancelled' as const,
    }

    return {
      id: appointment.id,
      patientName: appointment.user?.name || 'Paciente não informado',
      type: appointment.treatmentType,
      startTime,
      endTime,
      date: format(scheduledDate, 'yyyy-MM-dd'),
      status: statusMap[appointment.status],
    }
  })
}

const getStatusColor = (status: Appointment['status']) => {
  switch (status) {
    case 'SCHEDULED':
      return 'secondary'
    case 'CONFIRMED':
      return 'default'
    case 'IN_PROGRESS':
      return 'default'
    case 'COMPLETED':
      return 'outline'
    case 'CANCELLED':
    case 'NO_SHOW':
      return 'destructive'
    default:
      return 'secondary'
  }
}

const getStatusText = (status: Appointment['status']) => {
  switch (status) {
    case 'SCHEDULED':
      return 'Agendado'
    case 'CONFIRMED':
      return 'Confirmado'
    case 'IN_PROGRESS':
      return 'Em Andamento'
    case 'COMPLETED':
      return 'Concluído'
    case 'CANCELLED':
      return 'Cancelado'
    case 'NO_SHOW':
      return 'Falta'
    default:
      return status
  }
}

function AgendaPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    date: string
    time: string
  } | null>(null)

  // Usando os novos hooks do TanStack Query
  const {
    data: weekAppointments = [],
    isLoading: isLoadingWeek,
    error: weekError,
  } = useAppointmentsByWeek(currentWeek)

  const {
    data: upcomingAppointments = [],
    isLoading: isLoadingUpcoming,
  } = useUpcomingAppointments(7)

  const { prefetchWeek } = usePrefetchAppointments()

  // Prefetch da próxima e semana anterior para melhor UX
  useEffect(() => {
    const nextWeek = new Date(currentWeek)
    nextWeek.setDate(currentWeek.getDate() + 7)
    const prevWeek = new Date(currentWeek)
    prevWeek.setDate(currentWeek.getDate() - 7)

    prefetchWeek(nextWeek)
    prefetchWeek(prevWeek)
  }, [currentWeek, prefetchWeek])

  const getWeekStart = (date: Date) => {
    const start = new Date(date)
    const day = start.getDay()
    const diff = start.getDate() - day
    return new Date(start.setDate(diff))
  }

  const navigateWeek = (direction: 'next' | 'prev') => {
    const newDate = new Date(currentWeek)
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentWeek(newDate)
  }

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const weekStart = getWeekStart(currentWeek)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  // Converte appointments da API para o formato do WeeklySchedule
  const weeklyAppointments = convertApiAppointmentsToWeekly(weekAppointments)

  if (weekError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Erro ao carregar agenda: {weekError.message}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-4"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Agenda</h1>
          <p className="text-muted-foreground">
            {formatFullDate(weekStart)} - {formatFullDate(weekEnd)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => navigateWeek('prev')}
            size="sm"
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button onClick={() => setCurrentWeek(new Date())} variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Hoje
          </Button>
          <Button
            onClick={() => navigateWeek('next')}
            size="sm"
            variant="outline"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <CreateAppointmentDialog
            initialDate={selectedTimeSlot?.date}
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Consulta
            </Button>
          </CreateAppointmentDialog>
        </div>
      </div>

      {/* Agenda Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {isLoadingWeek ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <WeeklySchedule
              appointments={weeklyAppointments}
              currentWeek={currentWeek}
              onTimeSlotSelect={setSelectedTimeSlot}
              onWeekChange={setCurrentWeek}
              selectedTimeSlot={selectedTimeSlot}
            />
          )}
        </div>

        {/* Sidebar com próximas consultas */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Próximas Consultas</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingUpcoming ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <div>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingAppointments.slice(0, 5).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">
                                {appointment.user?.name || 'Paciente não informado'}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {appointment.treatmentType}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {format(new Date(appointment.scheduledDate), 'dd/MM - HH:mm')}
                              </p>
                            </div>
                            <Badge variant={getStatusColor(appointment.status)}>
                              {getStatusText(appointment.status)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {upcomingAppointments.length > 5 && (
                        <p className="text-center text-muted-foreground text-sm">
                          +{upcomingAppointments.length - 5} mais consultas...
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground text-sm">
                      Nenhuma consulta próxima encontrada
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
