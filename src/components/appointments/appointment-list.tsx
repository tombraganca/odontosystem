import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { appointmentService } from "@/services";
import type { Appointment } from "@/types";
import { toast } from "sonner";

const statusColors = {
  SCHEDULED: "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-green-100 text-green-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
  NO_SHOW: "bg-orange-100 text-orange-800",
};

const statusLabels = {
  SCHEDULED: "Agendado",
  CONFIRMED: "Confirmado",
  IN_PROGRESS: "Em Andamento",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
  NO_SHOW: "Não Compareceu",
};

interface AppointmentListProps {
  onAppointmentUpdated?: () => void;
}

export function AppointmentList({
  onAppointmentUpdated,
}: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (error) {
      toast.error("Erro ao carregar consultas");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    id: string,
    status: Appointment["status"]
  ) => {
    try {
      await appointmentService.updateAppointmentStatus(id, { status });
      toast.success("Status da consulta atualizado");
      loadAppointments();
      onAppointmentUpdated?.();
    } catch (error) {
      toast.error("Erro ao atualizar status da consulta");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await appointmentService.cancelAppointment(id);
      toast.success("Consulta cancelada");
      loadAppointments();
      onAppointmentUpdated?.();
    } catch (error) {
      toast.error("Erro ao cancelar consulta");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma consulta encontrada
            </h3>
            <p className="text-gray-500 mb-4">
              Você ainda não tem consultas agendadas.
            </p>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Agendar Primeira Consulta
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-4 w-4" />
                  {appointment.user?.name || "Paciente não informado"}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(appointment.scheduledDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(appointment.scheduledDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Stethoscope className="h-3 w-3" />
                    {appointment.dentist?.name || "Dentista não informado"}
                  </span>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={statusColors[appointment.status]}>
                  {statusLabels[appointment.status]}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {appointment.status === "SCHEDULED" && (
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusUpdate(appointment.id, "CONFIRMED")
                        }
                      >
                        Confirmar
                      </DropdownMenuItem>
                    )}
                    {appointment.status === "CONFIRMED" && (
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusUpdate(appointment.id, "IN_PROGRESS")
                        }
                      >
                        Iniciar Atendimento
                      </DropdownMenuItem>
                    )}
                    {appointment.status === "IN_PROGRESS" && (
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusUpdate(appointment.id, "COMPLETED")
                        }
                      >
                        Finalizar
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusUpdate(appointment.id, "NO_SHOW")
                      }
                    >
                      Marcar como Faltou
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleCancel(appointment.id)}
                      className="text-red-600"
                    >
                      Cancelar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Tratamento:</span>{" "}
                {appointment.treatmentType}
              </div>
              {appointment.notes && (
                <div>
                  <span className="font-medium">Observações:</span>{" "}
                  {appointment.notes}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
