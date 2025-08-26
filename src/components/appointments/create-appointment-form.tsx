import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState, useEffect } from 'react'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { appointmentService, userService, dentistService } from '@/services'
import type { User, Dentist, CreateAppointmentData } from '@/types'
import { toast } from 'sonner'

const createAppointmentSchema = z.object({
  userId: z.string().min(1, 'Selecione um paciente'),
  dentistId: z.string().min(1, 'Selecione um dentista'),
  scheduledDate: z.string().min(1, 'Selecione uma data'),
  scheduledTime: z.string().min(1, 'Selecione um horário'),
  treatmentType: z.string().min(1, 'Informe o tipo de tratamento'),
  notes: z.string().optional(),
})

type CreateAppointmentForm = z.infer<typeof createAppointmentSchema>

const treatmentTypes = [
  { value: 'limpeza', label: 'Limpeza' },
  { value: 'obturacao', label: 'Obturação' },
  { value: 'extracao', label: 'Extração' },
  { value: 'canal', label: 'Tratamento de Canal' },
  { value: 'protese', label: 'Prótese' },
  { value: 'ortodontia', label: 'Ortodontia' },
  { value: 'clareamento', label: 'Clareamento' },
  { value: 'consulta', label: 'Consulta' },
  { value: 'outros', label: 'Outros' },
]

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
]

interface CreateAppointmentFormProps {
  onAppointmentCreated?: () => void
  initialDate?: string
}

export function CreateAppointmentForm({ 
  onAppointmentCreated,
  initialDate 
}: CreateAppointmentFormProps) {
  const [users, setUsers] = useState<User[]>([])
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<CreateAppointmentForm>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      userId: '',
      dentistId: '',
      scheduledDate: initialDate || new Date().toISOString().split('T')[0],
      scheduledTime: '',
      treatmentType: '',
      notes: '',
    },
  })

  useEffect(() => {
    loadUsers()
    loadDentists()
  }, [])

  const loadUsers = async () => {
    try {
      const usersData = await userService.getUsers()
      setUsers(usersData)
    } catch (error) {
      toast.error('Erro ao carregar pacientes')
    }
  }

  const loadDentists = async () => {
    try {
      const dentistsData = await dentistService.getActiveDentists()
      setDentists(dentistsData)
    } catch (error) {
      toast.error('Erro ao carregar dentistas')
    }
  }

  const onSubmit = async (data: CreateAppointmentForm) => {
    setLoading(true)
    try {
      // Combina data e hora
      const scheduledDateTime = new Date(`${data.scheduledDate}T${data.scheduledTime}`)

      const appointmentData: CreateAppointmentData = {
        userId: data.userId,
        dentistId: data.dentistId,
        scheduledDate: scheduledDateTime.toISOString(),
        treatmentType: data.treatmentType,
        notes: data.notes || '',
      }

      await appointmentService.createAppointment(appointmentData)
      
      toast.success('Consulta agendada com sucesso!')
      form.reset()
      onAppointmentCreated?.()
    } catch (error) {
      toast.error('Erro ao agendar consulta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Agendar Nova Consulta
        </CardTitle>
        <CardDescription>
          Preencha os dados para agendar uma nova consulta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paciente</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="">Selecione um paciente</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} - {user.email}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dentistId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dentista</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="">Selecione um dentista</option>
                      {dentists.map((dentist) => (
                        <option key={dentist.id} value={dentist.id}>
                          Dr. {dentist.name} - {dentist.specialty}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="">Selecione um horário</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="treatmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Tratamento</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="">Selecione o tratamento</option>
                      {treatmentTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      placeholder="Observações adicionais (opcional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Agendando...' : 'Agendar Consulta'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
