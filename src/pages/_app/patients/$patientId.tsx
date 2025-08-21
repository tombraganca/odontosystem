import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowLeft,
  Calendar,
  Edit,
  File,
  FileText,
  Image,
  Mail,
  MessageSquare,
  Phone,
  Upload,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/_app/patients/$patientId')({
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
  address?: string
  notes?: string
}

interface Appointment {
  id: string
  date: string
  type: string
  notes: string
  dentist: string
}

interface Document {
  id: string
  name: string
  type: 'xray' | 'document' | 'image'
  url: string
  uploadDate: string
}

const mockPatients: Record<string, Patient> = {
  '1': {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@email.com',
    phone: '(11) 99999-9999',
    birthDate: '1985-03-15',
    lastVisit: '2024-08-15',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    notes: 'Paciente com histórico de sensibilidade dentária',
  },
  '2': {
    id: '2',
    name: 'João Santos',
    email: 'joao@email.com',
    phone: '(11) 88888-8888',
    birthDate: '1990-07-22',
    lastVisit: '2024-08-10',
    address: 'Av. Paulista, 456 - São Paulo, SP',
  },
  '3': {
    id: '3',
    name: 'Ana Costa',
    email: 'ana@email.com',
    phone: '(11) 77777-7777',
    birthDate: '1978-11-08',
    lastVisit: '2024-08-20',
    address: 'Rua Augusta, 789 - São Paulo, SP',
  },
}

const mockAppointments: Record<string, Appointment[]> = {
  '1': [
    {
      id: '1',
      date: '2024-08-15',
      type: 'Limpeza',
      notes:
        'Limpeza preventiva realizada. Paciente apresenta boa higiene oral.',
      dentist: 'Dr. Carlos Silva',
    },
    {
      id: '2',
      date: '2024-06-20',
      type: 'Obturação',
      notes: 'Obturação no dente 16. Cárie pequena removida com sucesso.',
      dentist: 'Dr. Carlos Silva',
    },
    {
      id: '3',
      date: '2024-04-10',
      type: 'Consulta',
      notes: 'Avaliação inicial. Paciente relata sensibilidade.',
      dentist: 'Dr. Carlos Silva',
    },
  ],
  '2': [
    {
      id: '4',
      date: '2024-08-10',
      type: 'Extração',
      notes: 'Extração do siso superior direito.',
      dentist: 'Dra. Ana Souza',
    },
  ],
  '3': [
    {
      id: '5',
      date: '2024-08-20',
      type: 'Limpeza',
      notes: 'Limpeza de rotina.',
      dentist: 'Dr. Carlos Silva',
    },
  ],
}

const mockDocuments: Record<string, Document[]> = {
  '1': [
    {
      id: '1',
      name: 'Radiografia Panorâmica',
      type: 'xray',
      url: '#',
      uploadDate: '2024-08-15',
    },
    {
      id: '2',
      name: 'Plano de Tratamento',
      type: 'document',
      url: '#',
      uploadDate: '2024-08-10',
    },
    {
      id: '3',
      name: 'Foto Intraoral',
      type: 'image',
      url: '#',
      uploadDate: '2024-07-20',
    },
  ],
  '2': [
    {
      id: '4',
      name: 'Exame Pré-Cirúrgico',
      type: 'document',
      url: '#',
      uploadDate: '2024-08-05',
    },
  ],
  '3': [
    {
      id: '5',
      name: 'Radiografia Bitewing',
      type: 'xray',
      url: '#',
      uploadDate: '2024-08-20',
    },
  ],
}

function RouteComponent() {
  const { patientId } = Route.useParams()
  const navigate = Route.useNavigate()
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([])
  const [newMessage, setNewMessage] = useState('')

  const patient = mockPatients[patientId]
  const appointments = mockAppointments[patientId] || []
  const documents = mockDocuments[patientId] || []

  if (!patient) {
    return (
      <div className="p-6">
        <div className="py-12 text-center">
          <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="font-medium text-lg">Paciente não encontrado</h3>
          <p className="text-muted-foreground">
            O paciente solicitado não existe ou foi removido
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate({ to: '/patients' })}
          >
            Voltar para Pacientes
          </Button>
        </div>
      </div>
    )
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    setChatMessages((prev) => [...prev, { role: 'user', content: newMessage }])

    // Simulação de resposta da LLM (será substituído por integração real)
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Com base no histórico de ${patient.name}, posso ajudar com informações sobre os atendimentos realizados. Esta funcionalidade será integrada com uma LLM em breve para responder perguntas específicas sobre o paciente.`,
        },
      ])
    }, 1000)

    setNewMessage('')
  }

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

  return (
    <div className="space-y-6 p-6">
      {/* Header com botão voltar */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => navigate({ to: '/patients' })}
          size="sm"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="font-bold text-3xl">{patient.name}</h1>
          <p className="text-muted-foreground">
            {calculateAge(patient.birthDate)} anos • Última visita:{' '}
            {formatDate(patient.lastVisit)}
          </p>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Coluna principal com informações do paciente */}
        <div className="space-y-6 lg:col-span-2">
          {/* Informações Principais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informações do Paciente</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={patient.avatar} />
                  <AvatarFallback className="text-xl">
                    {getInitials(patient.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <h2 className="font-bold text-2xl">{patient.name}</h2>
                  <p className="text-muted-foreground">
                    Nascimento: {formatDate(patient.birthDate)} (
                    {calculateAge(patient.birthDate)} anos)
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.phone}</span>
                  </div>
                </div>
              </div>

              {patient.address && (
                <div className="space-y-2">
                  <Label>Endereço</Label>
                  <p className="text-sm">{patient.address}</p>
                </div>
              )}

              {patient.notes && (
                <div className="space-y-2">
                  <Label>Observações</Label>
                  <p className="rounded-lg bg-muted p-3 text-sm">
                    {patient.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Histórico de Atendimentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Histórico de Atendimentos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      className="border-primary border-l-2 pb-4 pl-4"
                      key={appointment.id}
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{appointment.type}</h4>
                          <p className="text-muted-foreground text-sm">
                            {formatDate(appointment.date)} -{' '}
                            {appointment.dentist}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm">{appointment.notes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-muted-foreground">
                  Nenhum atendimento registrado ainda
                </p>
              )}
            </CardContent>
          </Card>

          {/* Documentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Documentos</span>
                </div>
                <Button size="sm" variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      className="flex items-center justify-between rounded-lg border p-3"
                      key={doc.id}
                    >
                      <div className="flex items-center space-x-3">
                        {doc.type === 'xray' && (
                          <Image className="h-5 w-5 text-blue-500" />
                        )}
                        {doc.type === 'document' && (
                          <File className="h-5 w-5 text-green-500" />
                        )}
                        {doc.type === 'image' && (
                          <Image className="h-5 w-5 text-purple-500" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {formatDate(doc.uploadDate)}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        Ver
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-muted-foreground">
                  Nenhum documento anexado ainda
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat LLM na lateral */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Chat IA</span>
              </CardTitle>
              <CardDescription>
                Faça perguntas sobre {patient.name.split(' ')[0]}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-full flex-col">
              <div className="mb-4 min-h-96 flex-1 overflow-y-auto rounded-lg border bg-muted/30 p-3">
                {chatMessages.length === 0 ? (
                  <div className="mt-20 text-center text-muted-foreground text-sm">
                    <MessageSquare className="mx-auto mb-2 h-8 w-8" />
                    <p>Comece uma conversa sobre este paciente...</p>
                    <p className="mt-2 text-xs">
                      Ex: "Qual foi o último procedimento?"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatMessages.map((message, index) => (
                      <div
                        className={`rounded-lg p-3 text-sm ${
                          message.role === 'user'
                            ? 'ml-4 bg-primary text-primary-foreground'
                            : 'mr-4 border bg-background'
                        }`}
                        key={index}
                      >
                        {message.content}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    disabled
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Digite sua pergunta..."
                    value={newMessage}
                  />
                  <Button disabled onClick={handleSendMessage}>
                    Enviar
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs">
                  * Funcionalidade será habilitada em breve com integração LLM
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
