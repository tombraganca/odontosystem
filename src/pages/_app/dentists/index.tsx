import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/data-table'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useDentists } from '@/hooks/useDentists'
import { UserRole } from '@/types'
import type { Dentist } from '@/types/dentist'
import { CreateDentistDialog } from '@/components/dentists/create-dentist-dialog'

export const Route = createFileRoute('/_app/dentists/')({
  component: DentistsPage,
})

const columns: ColumnDef<Dentist>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'crm',
    header: 'CRM',
  },
  {
    accessorKey: 'specialty',
    header: 'Especialidade',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Telefone',
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
        {row.original.isActive ? 'Ativo' : 'Inativo'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function DentistsPage() {
  const { data: dentists, isLoading, error } = useDentists()

  if (error) {
    return (
      <ProtectedRoute requiredRole={UserRole.ADMIN}>
        <div className="flex h-full flex-1 flex-col space-y-2 p-8 pt-6">
          <div className="flex items-center justify-center">
            <p className="text-destructive">
              Erro ao carregar dentistas: {error.message}
            </p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <div className="flex h-full flex-1 flex-col space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-2xl tracking-tight">Dentistas</h2>
            <p className="text-muted-foreground">
              Gerencie os dentistas da clínica
            </p>
          </div>
          <CreateDentistDialog />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <DataTable columns={columns} data={dentists || []} />
        )}
      </div>
    </ProtectedRoute>
  )
}
