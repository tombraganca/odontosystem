import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
import { useCreateAppointment } from '@/hooks/useAppointments'
import { useDentists } from '@/hooks/useDentists'
import { usePatients } from '@/hooks/usePatients'
import { useTreatments } from '@/hooks/useTreatments'
import type { CreateAppointmentData } from '@/types'

const createAppointmentSchema = z.object({
  userId: z.string().min(1, 'Selecione um paciente'),
  dentistId: z.string().min(1, 'Selecione um dentista'),
  scheduledDate: z.string().min(1, 'Selecione uma data'),
  scheduledTime: z.string().min(1, 'Selecione um horário'),
  treatmentType: z.string().min(1, 'Informe o tipo de tratamento'),
  notes: z.string().optional(),
})

type CreateAppointmentForm = z.infer<typeof createAppointmentSchema>

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
  initialDate?: string
  children?: React.ReactNode
}

export function CreateAppointmentDialog({
  initialDate,
  children,
}: CreateAppointmentDialogProps) {
  const [open, setOpen] = useState(false)
  
  // Hooks do TanStack Query
  const { data: dentists = [], isLoading: dentistsLoading } = useDentists()
  const { data: patients = [], isLoading: patientsLoading } = usePatients()
  const { data: treatments = [], isLoading: treatmentsLoading } = useTreatments()
  const createAppointment = useCreateAppointment()

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

  const onSubmit = async (data: CreateAppointmentForm) => {
    try {
      const appointmentData: CreateAppointmentData = {
        userId: data.userId,
        dentistId: data.dentistId,
        scheduledDate: `${data.scheduledDate}T${data.scheduledTime}`,
        treatmentType: data.treatmentType,
        notes: data.notes,
      }

      await createAppointment.mutateAsync(appointmentData)
      form.reset()
      setOpen(false)
    } catch {
      // Error is handled by the mutation hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Consulta
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agendar Nova Consulta</DialogTitle>
          <DialogDescription>
            Preencha os dados para agendar uma nova consulta.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paciente</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={patientsLoading}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">
                        {patientsLoading ? 'Carregando...' : 'Selecione um paciente'}
                      </option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} - {patient.phone}
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
                      {...field}
                      disabled={dentistsLoading}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">
                        {dentistsLoading ? 'Carregando...' : 'Selecione um dentista'}
                      </option>
                      {dentists.map((dentist) => (
                        <option key={dentist.id} value={dentist.id}>
                          {dentist.name} - {dentist.specialty}
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
              name="treatmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Tratamento</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={treatmentsLoading}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">
                        {treatmentsLoading ? 'Carregando...' : 'Selecione o tipo de tratamento'}
                      </option>
                      {treatments.map((treatment) => (
                        <option key={treatment.id} value={treatment.name}>
                          {treatment.name} - R$ {treatment.price.toFixed(2)}
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
                  <FormLabel>Observações (opcional)</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Observações sobre a consulta..."
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createAppointment.isPending}
              >
                {createAppointment.isPending ? 'Agendando...' : 'Agendar Consulta'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
