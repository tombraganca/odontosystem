import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { appointmentService, dentistService, userService } from '@/services'
import type { CreateAppointmentData, Dentist, User } from '@/types'

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
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
]

interface CreateAppointmentDialogProps {
  onAppointmentCreated?: () => void
  initialDate?: string
  children?: React.ReactNode
}

export function CreateAppointmentDialog({
  onAppointmentCreated,
  initialDate,
  children,
}: CreateAppointmentDialogProps) {
  const [open, setOpen] = useState(false)
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

  const loadUsers = async () => {
    try {
      const usersData = await userService.getUsers()
      setUsers(usersData)
    } catch (error: any) {
      console.error('Error loading users:', error)
      const errorMessage =
        error.statusCode === 403
          ? 'Sem permissão para ver pacientes'
          : error.message || 'Erro ao carregar pacientes'
      toast.error(errorMessage)
    }
  }

  const loadDentists = async () => {
    try {
      const dentistsData = await dentistService.getActiveDentists()
      setDentists(dentistsData)
    } catch (error: any) {
      console.error('Error loading dentists:', error)
      const errorMessage =
        error.statusCode === 403
          ? 'Sem permissão para ver dentistas'
          : error.message || 'Erro ao carregar dentistas'
      toast.error(errorMessage)
    }
  }

  const onSubmit = async (data: CreateAppointmentForm) => {
    setLoading(true)
    try {
      console.log('Creating appointment with data:', data)

      // Combina data e hora
      const scheduledDateTime = new Date(
        `${data.scheduledDate}T${data.scheduledTime}`
      )

      const appointmentData: CreateAppointmentData = {
        userId: data.userId,
        dentistId: data.dentistId,
        scheduledDate: scheduledDateTime.toISOString(),
        treatmentType: data.treatmentType,
        notes: data.notes || '',
      }

      console.log('Appointment data to be sent:', appointmentData)
      await appointmentService.createAppointment(appointmentData)

      toast.success('Consulta agendada com sucesso!')
      setOpen(false)
      form.reset()
      onAppointmentCreated?.()
    } catch (error: any) {
      console.error('Error creating appointment:', error)

      let errorMessage = 'Erro ao agendar consulta'
      if (error.statusCode) {
        switch (error.statusCode) {
          case 400:
            errorMessage = 'Dados inválidos. Verifique os campos preenchidos.'
            break
          case 404:
            errorMessage = 'Paciente ou dentista não encontrado.'
            break
          case 409:
            errorMessage = 'Conflito de horário. Este horário já está ocupado.'
            break
          case 422:
            errorMessage = 'Dados de entrada inválidos.'
            break
          default:
            errorMessage = error.message || 'Erro ao agendar consulta'
        }
      }

      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      loadUsers()
      loadDentists()
    }
  }, [open])

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Consulta
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Agendar Nova Consulta
          </DialogTitle>
          <DialogDescription>
            Preencha os dados para agendar uma nova consulta.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paciente</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                      className="flex min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Observações adicionais (opcional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                onClick={() => setOpen(false)}
                type="button"
                variant="outline"
              >
                Cancelar
              </Button>
              <Button disabled={loading} type="submit">
                {loading ? 'Agendando...' : 'Agendar Consulta'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
