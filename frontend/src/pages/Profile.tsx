import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Phone, CalendarClock, Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { useProfile } from "@/hooks/use-profile";
import { EmptyState } from "@/components/EmptyState";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { profile, profileId, isLoading } = useProfile();

  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setEmail(profile.email ?? "");
  }, [profile?.email]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile || !profileId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <EmptyState onAction={() => navigate("/register")} />
      </div>
    );
  }

  const emailChanged = email.trim() !== (profile.email ?? "");

  const handleSaveEmail = async () => {
    if (!EMAIL_RE.test(email.trim())) {
      toast.error("Ingresá un email válido (ahí llega el recordatorio)");
      return;
    }
    setSaving(true);
    try {
      await api.updateProfile(profileId, { email: email.trim() });
      await queryClient.invalidateQueries();
      toast.success("Email guardado", {
        description: "Vas a recibir el recordatorio 5 días antes",
      });
    } catch (err) {
      toast.error("No se pudo guardar. Intentá de nuevo.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const items = [
    { icon: User, label: "Nombre", value: profile.name },
    { icon: Phone, label: "WhatsApp", value: profile.whatsapp },
    { icon: CalendarClock, label: "Duración del ciclo", value: `${profile.cycle_length} días` },
    {
      icon: Bell,
      label: "Recordatorios",
      value: profile.reminders_enabled ? "Activados" : "Desactivados",
    },
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-xl font-display font-semibold text-foreground">Perfil</h1>
      </div>

      <div className="px-5 space-y-3">
        {/* Email — editable */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-card border border-border/50 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs text-muted-foreground">
                Email
              </Label>
              <p className="text-xs text-muted-foreground">
                Acá te llega el aviso antes de tu período
              </p>
            </div>
          </div>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vos@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl h-11"
          />
          <Button
            onClick={handleSaveEmail}
            disabled={saving || !emailChanged}
            className="w-full rounded-full h-11"
          >
            {saving ? "Guardando..." : "Guardar email"}
          </Button>
        </motion.div>

        {/* Resto — solo lectura */}
        {items.map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i + 1) * 0.08 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-medium text-foreground">{value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
