import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { treatmentService } from '@/services/treatments'
import type { CreateTreatmentData } from '@/services/treatments'
import { toast } from 'sonner'

const QUERY_KEYS = {
  treatments: ['treatments'] as const,
  treatment: (id: string) => ['treatments', id] as const,
  activeTreatments: ['treatments', 'active'] as const,
}

export function useTreatments() {
  return useQuery({
    queryKey: QUERY_KEYS.treatments,
    queryFn: treatmentService.getTreatments,
    staleTime: 5 * 60 * 1000, // 5 minutos - tratamentos mudam pouco
    gcTime: 10 * 60 * 1000, // 10 minutos
  })
}

export function useTreatment(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.treatment(id),
    queryFn: () => treatmentService.getTreatmentById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useActiveTreatments() {
  return useQuery({
    queryKey: QUERY_KEYS.activeTreatments,
    queryFn: treatmentService.getActiveTreatments,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateTreatment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTreatmentData) => treatmentService.createTreatment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.treatments })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activeTreatments })
      toast.success('Tratamento criado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar tratamento')
    },
  })
}

export function useUpdateTreatment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTreatmentData> }) =>
      treatmentService.updateTreatment(id, data),
    onSuccess: (updatedTreatment) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.treatments })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activeTreatments })
      queryClient.setQueryData(
        QUERY_KEYS.treatment(updatedTreatment.id),
        updatedTreatment
      )
      toast.success('Tratamento atualizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar tratamento')
    },
  })
}

export function useDeleteTreatment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => treatmentService.deleteTreatment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.treatments })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activeTreatments })
      toast.success('Tratamento removido com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover tratamento')
    },
  })
}
