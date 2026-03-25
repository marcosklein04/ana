import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAction: () => void;
}

export function EmptyState({ onAction }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6 animate-pulse-soft">
        <Heart className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
        ¡Bienvenida!
      </h2>
      <p className="text-muted-foreground max-w-xs mb-8 leading-relaxed">
        Comencemos registrando la fecha de tu último período para calcular tu próximo ciclo.
      </p>
      <Button onClick={onAction} size="lg" className="rounded-full px-8">
        Registrar primera fecha
      </Button>
    </motion.div>
  );
}
