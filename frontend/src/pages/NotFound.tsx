import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-display font-bold text-foreground mb-2">404</h1>
      <p className="text-muted-foreground mb-6">Página no encontrada</p>
      <Button onClick={() => navigate("/")} variant="outline" className="rounded-full">
        Volver al inicio
      </Button>
    </div>
  );
};

export default NotFound;
