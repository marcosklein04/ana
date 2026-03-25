import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Phone, CalendarClock, Bell, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { EmptyState } from "@/components/EmptyState";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <EmptyState onAction={() => navigate("/register")} />
      </div>
    );
  }

  const items = [
    { icon: User, label: "Nombre", value: profile.name },
    { icon: Phone, label: "WhatsApp", value: profile.whatsapp },
    { icon: CalendarClock, label: "Duración del ciclo", value: `${profile.cycle_length} días` },
    { icon: Bell, label: "Recordatorios", value: profile.reminders_enabled ? "Activados" : "Desactivados" },
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
        {items.map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
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
