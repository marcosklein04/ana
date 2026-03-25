import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { Home, CalendarPlus, Clock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", icon: Home, label: "Inicio" },
  { to: "/register", icon: CalendarPlus, label: "Registrar" },
  { to: "/history", icon: Clock, label: "Historial" },
  { to: "/profile", icon: Settings, label: "Perfil" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-t border-border/50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {links.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <RouterNavLink
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{label}</span>
            </RouterNavLink>
          );
        })}
      </div>
    </nav>
  );
}
