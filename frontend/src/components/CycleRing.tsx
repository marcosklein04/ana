import { motion } from "framer-motion";

interface CycleRingProps {
  daysElapsed: number;
  cycleLength: number;
  phase: string;
  daysRemaining: number;
}

const phaseColors: Record<string, string> = {
  menstrual: "hsl(340, 45%, 65%)",
  follicular: "hsl(270, 30%, 78%)",
  ovulation: "hsl(35, 50%, 70%)",
  luteal: "hsl(340, 35%, 80%)",
};

const phaseLabels: Record<string, string> = {
  menstrual: "Menstruación",
  follicular: "Folicular",
  ovulation: "Ovulación",
  luteal: "Lútea",
};

export function CycleRing({ daysElapsed, cycleLength, phase, daysRemaining }: CycleRingProps) {
  const progress = Math.min(daysElapsed / cycleLength, 1);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const color = phaseColors[phase] || phaseColors.follicular;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-56 h-56">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="8"
          />
          <motion.circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-display font-bold text-foreground"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            {daysRemaining}
          </motion.span>
          <span className="text-sm text-muted-foreground mt-1">
            {daysRemaining === 1 ? "día restante" : "días restantes"}
          </span>
        </div>
      </div>
      <div
        className="px-4 py-1.5 rounded-full text-sm font-medium"
        style={{ backgroundColor: `${color}22`, color }}
      >
        Fase {phaseLabels[phase] || phase}
      </div>
    </div>
  );
}
