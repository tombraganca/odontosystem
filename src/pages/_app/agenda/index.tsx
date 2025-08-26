import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WeeklySchedule } from "../-components/weekly-schedule";
import { AppointmentList } from "@/components/appointments/appointment-list";
import { CreateAppointmentDialog } from "@/components/appointments/create-appointment-dialog";

export const Route = createFileRoute("/_app/agenda/")({
  component: RouteComponent,
});

interface Appointment {
  id: string;
  patientName: string;
  type: string;
  startTime: string;
  endTime: string;
  date: string;
  status: "scheduled" | "completed" | "cancelled";
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Maria Silva",
    type: "Limpeza",
    startTime: "09:00",
    endTime: "09:30",
    date: "2024-08-26",
    status: "scheduled",
  },
  {
    id: "2",
    patientName: "João Santos",
    type: "Obturação",
    startTime: "10:00",
    endTime: "11:00",
    date: "2024-08-26",
    status: "scheduled",
  },
  {
    id: "3",
    patientName: "Ana Costa",
    type: "Consulta",
    startTime: "14:00",
    endTime: "14:30",
    date: "2024-08-27",
    status: "scheduled",
  },
];

function RouteComponent() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleAppointmentCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const weekStart = getWeekStart(currentWeek);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Agenda</h1>
          <p className="text-muted-foreground">
            {formatFullDate(weekStart)} - {formatFullDate(weekEnd)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => navigateWeek("prev")}
            size="sm"
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button onClick={() => setCurrentWeek(new Date())} variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Hoje
          </Button>
          <Button
            onClick={() => navigateWeek("next")}
            size="sm"
            variant="outline"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <CreateAppointmentDialog 
            onAppointmentCreated={handleAppointmentCreated}
            initialDate={selectedTimeSlot?.date}
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Consulta
            </Button>
          </CreateAppointmentDialog>
        </div>
      </div>
      {/* Agenda Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklySchedule
            appointments={mockAppointments}
            currentWeek={currentWeek}
            onTimeSlotSelect={setSelectedTimeSlot}
            onWeekChange={setCurrentWeek}
            selectedTimeSlot={selectedTimeSlot}
          />
        </div>
        <div className="space-y-4">
          <h2 className="font-semibold text-xl">Próximas Consultas</h2>
          <AppointmentList key={refreshKey} />
        </div>
      </div>
    </div>
  );
}
