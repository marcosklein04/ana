import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PeriodTimeline } from "@/components/PeriodTimeline";
import { EmptyState } from "@/components/EmptyState";
import { useProfile } from "@/hooks/use-profile";

export default function History() {
  const navigate = useNavigate();
  const { periods, isLoading } = useProfile();

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-xl font-display font-semibold text-foreground">Historial</h1>
      </div>

      <div className="px-5">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : periods.length === 0 ? (
          <EmptyState onAction={() => navigate("/register")} />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <p className="text-sm text-muted-foreground mb-4">
              {periods.length} {periods.length === 1 ? "período registrado" : "períodos registrados"}
            </p>
            <PeriodTimeline periods={periods} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
