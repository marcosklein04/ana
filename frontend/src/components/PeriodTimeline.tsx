import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import type { Period } from "@/types";
import { CalendarDays } from "lucide-react";

interface PeriodTimelineProps {
  periods: Period[];
}

export function PeriodTimeline({ periods }: PeriodTimelineProps) {
  if (periods.length === 0) return null;

  return (
    <div className="space-y-3">
      {periods.map((period, i) => (
        <motion.div
          key={period.id}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground capitalize">
              {format(parseISO(period.start_date), "EEEE d 'de' MMMM, yyyy", { locale: es })}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Inicio del período
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
