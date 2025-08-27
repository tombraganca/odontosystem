import { createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { AppointmentList } from '@/components/appointments/appointment-list'
import { CreateAppointmentDialog } from '@/components/appointments/create-appointment-dialog'
import { Button } from '@/components/ui/button'
import { appointmentService } from '@/services'
import type { Appointment } from '@/types'
import { WeeklySchedule } from '../-components/weekly-schedule'

export const Route = createFileRoute('/_app/agenda/')({
  component: RouteComponent,
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

const mockAppointments: WeeklyAppointment[] = [
  {
    id: '1',
    patientName: 'Maria Silva',
    type: 'Limpeza',
    startTime: '09:00',
    endTime: '09:30',
    date: '2024-08-26',
    status: 'scheduled',
  },
  {
    id: '2',
    patientName: 'João Santos',
    type: 'Obturação',
    startTime: '10:00',
    endTime: '11:00',
    date: '2024-08-26',
    status: 'scheduled',
  },
  {
    id: '3',
    patientName: 'Ana Costa',
    type: 'Consulta',
    startTime: '14:00',
    endTime: '14:30',
    date: '2024-08-27',
    status: 'scheduled',
  },
]

// Função para converter consultas da API para o formato do WeeklySchedule
const convertApiAppointmentsToWeekly = (
  apiAppointments: Appointment[]
): WeeklyAppointment[] => {
  return apiAppointments.map((appointment) => {
    const scheduledDate = new Date(appointment.scheduledDate)
    const startTime = format(scheduledDate, 'HH:mm')

    // Estima duração baseada no tipo de tratamento (por enquanto padrão de 30 min)
    const endDate = new Date(scheduledDate.getTime() + 30 * 60_000) // +30 minutos
    const endTime = format(endDate, 'HH:mm')

    // Mapeia status da API para o formato local
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
      status: statusMap[appointment.status] || 'scheduled',
    }
  })
}

function RouteComponent() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    date: string
    time: string
  } | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [appointments, setAppointments] = useState<WeeklyAppointment[]>([])
  const [loading, setLoading] = useState(true)

  // Carrega consultas da API
  useEffect(() => {
    loadAppointments()
  }, [refreshKey])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const apiAppointments = await appointmentService.getAppointments()
      const weeklyAppointments = convertApiAppointmentsToWeekly(apiAppointments)
      setAppointments(weeklyAppointments)
    } catch (error) {
      let errorMessage = 'Erro ao carregar consultas'
      if (error.statusCode) {
        switch (error.statusCode) {
          case 401:
            errorMessage = 'Sessão expirada. Faça login novamente.'
            break
          case 403:
            errorMessage = 'Você não tem permissão para ver as consultas.'
            break
          case 404:
            errorMessage = 'Serviço de consultas não encontrado.'
            break
          case 500:
            errorMessage =
              'Erro interno do servidor. Tente novamente mais tarde.'
            break
          default:
            errorMessage = error.message || 'Erro ao carregar consultas'
        }
      }

      // Toast com erro específico
      console.warn(
        `API Error (${error.statusCode || 'unknown'}): ${errorMessage}. Using mock data.`
      )

      // Em caso de erro, usa dados mock
      setAppointments(mockAppointments)
    } finally {
      setLoading(false)
    }
  }

  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
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

  const handleAppointmentCreated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const weekStart = getWeekStart(currentWeek)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
          <p className="text-muted-foreground">Carregando agenda...</p>
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
            onAppointmentCreated={handleAppointmentCreated}
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
          <WeeklySchedule
            appointments={appointments}
            currentWeek={currentWeek}
            onTimeSlotSelect={setSelectedTimeSlot}
            onWeekChange={setCurrentWeek}
            selectedTimeSlot={selectedTimeSlot}
          />
        </div>
        <div className="space-y-4">
          <h2 className="font-semibold text-xl">Próximas Consultas</h2>
          <AppointmentList key={refreshKey} />
        </div>
      </div>
    </div>
  )
}
