import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { patientService } from '@/services/patients'
import type { CreatePatientData } from '@/services/patients'
import { toast } from 'sonner'

const QUERY_KEYS = {
  patients: ['patients'] as const,
  patient: (id: string) => ['patients', id] as const,
}

export function usePatients() {
  return useQuery({
    queryKey: QUERY_KEYS.patients,
    queryFn: patientService.getPatients,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  })
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.patient(id),
    queryFn: () => patientService.getPatientById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export function useCreatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePatientData) => patientService.createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients })
      toast.success('Paciente criado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar paciente')
    },
  })
}

export function useUpdatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePatientData> }) =>
      patientService.updatePatient(id, data),
    onSuccess: (updatedPatient) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients })
      queryClient.setQueryData(
        QUERY_KEYS.patient(updatedPatient.id),
        updatedPatient
      )
      toast.success('Paciente atualizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar paciente')
    },
  })
}

export function useDeletePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => patientService.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients })
      toast.success('Paciente removido com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover paciente')
    },
  })
}
