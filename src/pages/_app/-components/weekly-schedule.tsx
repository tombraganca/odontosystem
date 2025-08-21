import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  startOfWeek,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Fragment, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Appointment {
  id: string
  patientName: string
  type: string
  startTime: string
  endTime: string
  date: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

interface WeeklyScheduleProps {
  appointments?: Appointment[]
  currentWeek?: Date
  onWeekChange?: (date: Date) => void
  selectedTimeSlot?: { date: string; time: string } | null
  onTimeSlotSelect?: (timeSlot: { date: string; time: string } | null) => void
}

// Gera horários das 8h às 18h com intervalos de 30 minutos
const generateTimeSlots = (): string[] => {
  const slots: string[] = []
  for (let hour = 8; hour < 18; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    slots.push(`${hour.toString().padStart(2, '0')}:30`)
  }
  return slots
}

const timeSlots = generateTimeSlots()

export function WeeklySchedule({
  appointments = [],
  currentWeek: propCurrentWeek,
  onWeekChange,
  selectedTimeSlot,
  onTimeSlotSelect,
}: WeeklyScheduleProps) {
  const [internalCurrentDate, setInternalCurrentDate] = useState(new Date())

  // Use prop values if provided, otherwise use internal state
  const currentDate = propCurrentWeek || internalCurrentDate
  const setCurrentDate = onWeekChange || setInternalCurrentDate

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const goToPreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7))
  }

  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7))
  }

  const handleSlotClick = (day: Date, time: string) => {
    const slotData = {
      date: format(day, 'yyyy-MM-dd'),
      time,
    }

    if (onTimeSlotSelect) {
      onTimeSlotSelect(slotData)
    }
  }

  // Function to get appointments for a specific day and time
  const getAppointmentAtTime = (
    day: Date,
    time: string
  ): Appointment | null => {
    const dayString = format(day, 'yyyy-MM-dd')
    return (
      appointments.find(
        (appointment) =>
          appointment.date === dayString && appointment.startTime === time
      ) || null
    )
  }

  // Function to check if a time slot is selected
  const isTimeSlotSelected = (day: Date, time: string): boolean => {
    if (!selectedTimeSlot) {
      return false
    }
    const dayString = format(day, 'yyyy-MM-dd')
    return selectedTimeSlot.date === dayString && selectedTimeSlot.time === time
  }

  return (
    <div className="space-y-4">
      {/* Navegação da Semana */}
      <div className="flex items-center justify-between">
        <Button onClick={goToPreviousWeek} size="icon" variant="outline">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="px-2 text-center font-semibold text-sm sm:text-base md:text-lg">
          {format(weekStart, "d 'de' MMM", { locale: ptBR })} -{' '}
          {format(weekEnd, "d 'de' MMM 'de' yyyy", { locale: ptBR })}
        </h2>
        <Button onClick={goToNextWeek} size="icon" variant="outline">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Grade de Horários - Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <div className="grid min-w-[600px] grid-cols-[80px_repeat(7,1fr)] overflow-hidden rounded-lg border border-gray-200">
          {/* Cabeçalho vazio */}
          <div className="border-r bg-gray-50 p-3 dark:bg-gray-800" />

          {/* Cabeçalho dos dias */}
          {days.map((day) => (
            <div
              className="border-r bg-gray-50 p-3 text-center last:border-r-0 dark:bg-gray-800"
              key={day.toString()}
            >
              <p className="font-semibold text-sm capitalize">
                {format(day, 'eee', { locale: ptBR })}
              </p>
              <p className="text-gray-500 text-xs">{format(day, 'dd/MM')}</p>
            </div>
          ))}

          {/* Linhas de horários */}
          {timeSlots.map((time) => (
            <Fragment key={time}>
              {/* Rótulo do horário */}
              <div className="border-t border-r bg-gray-50 p-3 text-center font-medium text-sm dark:bg-gray-800">
                {time}
              </div>
              {/* Células de disponibilidade */}
              {days.map((day) => {
                const appointment = getAppointmentAtTime(day, time)
                const isSelected = isTimeSlotSelected(day, time)

                return (
                  <button
                    className={cn(
                      'relative min-h-[48px] w-full cursor-pointer border-t border-r p-1 text-center transition-colors last:border-r-0 hover:bg-primary/10',
                      isSelected && 'bg-primary text-primary-foreground'
                    )}
                    key={`${format(day, 'yyyy-MM-dd')}-${time}`}
                    onClick={() => handleSlotClick(day, time)}
                    type="button"
                  >
                    {appointment ? (
                      <div className="h-full rounded-sm border border-blue-200 bg-blue-100 p-2 text-left text-xs">
                        <div className="truncate font-medium text-blue-800">
                          {appointment.patientName}
                        </div>
                        <div className="truncate text-blue-600">
                          {appointment.type}
                        </div>
                        <div className="text-blue-500 text-xs">
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="h-2 w-2 rounded-full opacity-20 hover:opacity-50" />
                      </div>
                    )}
                  </button>
                )
              })}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Layout Mobile - Cards por dia */}
      <div className="space-y-4 md:hidden">
        {days.map((day) => (
          <div className="space-y-3 rounded-lg border p-4" key={day.toString()}>
            <h3 className="text-center font-semibold">
              {format(day, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {timeSlots.map((time) => {
                const appointment = getAppointmentAtTime(day, time)
                const isSelected = isTimeSlotSelected(day, time)

                return (
                  <Button
                    className="text-xs"
                    key={`${format(day, 'yyyy-MM-dd')}-${time}`}
                    onClick={() => handleSlotClick(day, time)}
                    size="sm"
                    variant={isSelected ? 'default' : 'outline'}
                  >
                    {appointment ? (
                      <div className="truncate">
                        <div className="font-semibold">{time}</div>
                        <div className="text-xs">{appointment.patientName}</div>
                      </div>
                    ) : (
                      time
                    )}
                  </Button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Botão de confirmação */}
      {selectedTimeSlot && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => {
              /* TODO: Implement appointment confirmation */
            }}
          >
            Confirmar Agendamento
          </Button>
        </div>
      )}
    </div>
  )
}
