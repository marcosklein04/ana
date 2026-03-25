import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CalendarHeart, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CycleRing } from "@/components/CycleRing";
import { EmptyState } from "@/components/EmptyState";
import { useProfile } from "@/hooks/use-profile";

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, periods, cycleInfo, isLoading, profileId } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profileId || !profile || periods.length === 0 || !cycleInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <EmptyState onAction={() => navigate("/register")} />
      </div>
    );
  }

  const nextDate = parseISO(cycleInfo.next_period_date);
  const lastDate = parseISO(periods[0].start_date);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-muted-foreground">Hola,</p>
          <h1 className="text-2xl font-display font-semibold text-foreground">
            {profile.name} 💐
          </h1>
        </motion.div>
      </div>

      {/* Cycle Ring */}
      <motion.div
        className="flex justify-center py-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <CycleRing
          daysElapsed={cycleInfo.days_elapsed}
          cycleLength={cycleInfo.cycle_length}
          phase={cycleInfo.current_phase}
          daysRemaining={cycleInfo.days_remaining}
        />
      </motion.div>

      {/* Info Cards */}
      <div className="px-5 space-y-4">
        {/* Next period card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-accent/60 border border-primary/10 p-5"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tu próxima fecha estimada es</p>
              <p className="text-lg font-display font-semibold text-foreground capitalize mt-0.5">
                {format(nextDate, "EEEE d 'de' MMMM", { locale: es })}
              </p>
              <p className="text-sm text-primary font-medium mt-1">
                Faltan {cycleInfo.days_remaining} días
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="rounded-2xl bg-card border border-border/50 p-4 shadow-sm">
            <p className="text-xs text-muted-foreground mb-1">Último período</p>
            <p className="text-sm font-medium text-foreground capitalize">
              {format(lastDate, "d MMM yyyy", { locale: es })}
            </p>
          </div>
          <div className="rounded-2xl bg-card border border-border/50 p-4 shadow-sm">
            <p className="text-xs text-muted-foreground mb-1">Duración del ciclo</p>
            <p className="text-sm font-medium text-foreground">{cycleInfo.cycle_length} días</p>
          </div>
        </motion.div>

        {/* Register button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={() => navigate("/register")}
            className="w-full rounded-full h-12 text-base gap-2"
            size="lg"
          >
            <CalendarHeart className="w-5 h-5" />
            Registrar nuevo período
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
