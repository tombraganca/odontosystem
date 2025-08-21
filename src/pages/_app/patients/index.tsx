import { createFileRoute, Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Calendar, Eye, Plus, User } from 'lucide-react'
import { useState } from 'react'
import { DataTable } from '@/components/data-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_app/patients/')({
  component: RouteComponent,
})

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  birthDate: string
  lastVisit: string
  avatar?: string
}

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@email.com',
    phone: '(11) 99999-9999',
    birthDate: '1985-03-15',
    lastVisit: '2024-08-15',
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@email.com',
    phone: '(11) 88888-8888',
    birthDate: '1990-07-22',
    lastVisit: '2024-08-10',
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana@email.com',
    phone: '(11) 77777-7777',
    birthDate: '1978-11-08',
    lastVisit: '2024-08-20',
  },
  {
    id: '4',
    name: 'Carlos Oliveira',
    email: 'carlos@email.com',
    phone: '(11) 66666-6666',
    birthDate: '1982-12-05',
    lastVisit: '2024-08-18',
  },
  {
    id: '5',
    name: 'Patricia Lima',
    email: 'patricia@email.com',
    phone: '(11) 55555-5555',
    birthDate: '1995-04-30',
    lastVisit: '2024-08-12',
  },
  {
    id: '6',
    name: 'Roberto Ferreira',
    email: 'roberto@email.com',
    phone: '(11) 44444-4444',
    birthDate: '1970-09-18',
    lastVisit: '2024-08-08',
  },
]

function RouteComponent() {
  const [showAddModal, setShowAddModal] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--
    }

    return age
  }

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="ghost"
          >
            Paciente
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const patient = row.original
        return (
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={patient.avatar} />
              <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{patient.name}</div>
              <div className="text-muted-foreground text-sm">
                {calculateAge(patient.birthDate)} anos
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="ghost"
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'phone',
      header: 'Telefone',
    },
    {
      accessorKey: 'lastVisit',
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="ghost"
          >
            Última Visita
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return formatDate(row.getValue('lastVisit'))
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const patient = row.original

        return (
          <Link params={{ patientId: patient.id }} to="/patients/$patientId">
            <Button size="sm" variant="ghost">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        )
      },
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Pacientes</h1>
          <p className="text-muted-foreground">Gerencie seus pacientes</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Paciente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total de Pacientes
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{mockPatients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Consultas Hoje
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Novos Este Mês
            </CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">8</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={mockPatients} />
        </CardContent>
      </Card>

      {/* Modal para adicionar paciente */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Novo Paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Modal de cadastro será implementado em breve...
              </p>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="outline"
                >
                  Fechar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
