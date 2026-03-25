import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { getStoredProfileId, setStoredProfileId } from "@/hooks/use-profile";

export default function Register() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const existingProfileId = getStoredProfileId();

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [date, setDate] = useState<Date>();
  const [cycleLength, setCycleLength] = useState(28);
  const [reminders, setReminders] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!date) {
      toast.error("Por favor seleccioná la fecha");
      return;
    }

    setSaving(true);
    const startDate = format(date, "yyyy-MM-dd");

    try {
      if (existingProfileId) {
        // Ya existe perfil — solo registrar nuevo período
        await api.addPeriod(existingProfileId, startDate);
      } else {
        // Primer registro — crear perfil + período
        if (!name.trim()) {
          toast.error("Por favor completá el nombre");
          setSaving(false);
          return;
        }
        const profile = await api.createProfile({
          name: name.trim(),
          whatsapp: whatsapp.trim(),
          last_period_start: startDate,
          cycle_length: cycleLength,
          reminders_enabled: reminders,
        });
        setStoredProfileId(profile.id);
        await api.addPeriod(profile.id, startDate);
      }

      await queryClient.invalidateQueries();
      toast.success("¡Datos guardados correctamente!", {
        description: "Tu ciclo ha sido registrado",
        icon: <Check className="w-4 h-4" />,
      });
      navigate("/");
    } catch (err) {
      toast.error("Error al guardar. Intentá de nuevo.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-xl font-display font-semibold text-foreground">
          {existingProfileId ? "Registrar período" : "Registrar datos"}
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-5 space-y-6"
      >
        {/* Name — only for first registration */}
        {!existingProfileId && (
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Nombre</Label>
            <Input
              id="name"
              placeholder="Ej: Valentina"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl h-12"
            />
          </div>
        )}

        {/* WhatsApp — only for first registration */}
        {!existingProfileId && (
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp</Label>
            <Input
              id="whatsapp"
              placeholder="+54 9 11 5544 3322"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="rounded-xl h-12"
              type="tel"
            />
          </div>
        )}

        {/* Date picker */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Fecha del último período</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal rounded-xl h-12",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: es }) : "Seleccioná una fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d > new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Cycle Length — only for first registration */}
        {!existingProfileId && (
          <div className="space-y-2">
            <Label htmlFor="cycle" className="text-sm font-medium">Duración del ciclo (días)</Label>
            <Input
              id="cycle"
              type="number"
              min={20}
              max={45}
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="rounded-xl h-12"
            />
            <p className="text-xs text-muted-foreground">El promedio es de 28 días</p>
          </div>
        )}

        {/* Reminders — only for first registration */}
        {!existingProfileId && (
          <div className="flex items-center justify-between rounded-xl bg-card border border-border/50 p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Recordatorios</p>
              <p className="text-xs text-muted-foreground mt-0.5">Recibir aviso antes del próximo período</p>
            </div>
            <Switch checked={reminders} onCheckedChange={setReminders} />
          </div>
        )}

        {/* Save */}
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-full h-12 text-base"
          size="lg"
        >
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </motion.div>
    </div>
  );
}
