import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { dentistService } from '@/services/dentists'
import type { CreateDentistData } from '@/types/dentist'

const QUERY_KEYS = {
  dentists: ['dentists'] as const,
  dentist: (id: string) => ['dentists', id] as const,
  activeDentists: ['dentists', 'active'] as const,
}

export function useDentists() {
  return useQuery({
    queryKey: QUERY_KEYS.dentists,
    queryFn: dentistService.getDentists,
  })
}

export function useDentist(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.dentist(id),
    queryFn: () => dentistService.getDentistById(id),
    enabled: !!id,
  })
}

export function useActiveDentists() {
  return useQuery({
    queryKey: QUERY_KEYS.activeDentists,
    queryFn: dentistService.getActiveDentists,
  })
}

export function useCreateDentist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDentistData) => dentistService.createDentist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dentists })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activeDentists })
      toast.success('Dentista criado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar dentista')
    },
  })
}

export function useUpdateDentist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<CreateDentistData>
    }) => dentistService.updateDentist(id, data),
    onSuccess: (updatedDentist) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dentists })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activeDentists })
      queryClient.setQueryData(
        QUERY_KEYS.dentist(updatedDentist.id),
        updatedDentist
      )
      toast.success('Dentista atualizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar dentista')
    },
  })
}

export function useDeleteDentist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => dentistService.deleteDentist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dentists })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activeDentists })
      toast.success('Dentista removido com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover dentista')
    },
  })
}
