
import React from "react";
import { ChevronRight, User, AlertTriangle, Plus, Loader2, Clock } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  title: string;
  status: "active" | "completed" | "pending";
  time: string;
  staff: string;
}

interface ServicesListProps {
  services: Service[];
  isLoading?: boolean;
}

const ServicesList: React.FC<ServicesListProps> = ({ services = [], isLoading = false }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-primary text-xl">Today's Schedule</h2>
          <Button variant="ghost" className="text-primary text-sm flex items-center gap-1" disabled>
            Request Service <Plus size={16} />
          </Button>
        </div>
        
        <div className="luxury-card p-8 flex flex-col items-center justify-center text-center">
          <Loader2 className="text-primary mb-3 h-8 w-8 animate-spin" />
          <h3 className="text-foreground font-medium mb-2">Loading Schedule</h3>
          <p className="text-foreground/70 text-sm">Please wait while we fetch your schedule...</p>
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-primary text-xl">Today's Schedule</h2>
          <Button 
            variant="ghost" 
            className="text-primary text-sm flex items-center gap-1"
            onClick={() => navigate('/services')}
          >
            Request Service <Plus size={16} />
          </Button>
        </div>
        
        <div className="luxury-card p-6 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="text-primary mb-3 h-8 w-8" />
          <h3 className="text-foreground font-medium mb-2">No Activities Scheduled</h3>
          <p className="text-foreground/70 text-sm mb-4">You don't have any services scheduled today.</p>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate('/services')}
          >
            Request a Service
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-primary text-xl">Today's Schedule</h2>
        <Button 
          variant="ghost" 
          className="text-primary text-sm flex items-center gap-1"
          onClick={() => navigate('/services')}
        >
          View All <ChevronRight size={16} />
        </Button>
      </div>

      <div className="space-y-3">
        {services.map((service) => (
          <div 
            key={service.id}
            className={cn(
              "luxury-card border-l-2 border-l-primary hover:bg-primary/5 transition-colors duration-200 cursor-pointer p-3 shadow-sm",
              !isDarkMode && "service-card"
            )}
            onClick={() => navigate(`/services/requests/${service.id}`)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-foreground text-sm">{service.title}</h3>
                <div className="flex items-center gap-2 text-xs text-foreground/70 mt-1">
                  <Clock size={12} className="text-primary" />
                  <span>{service.time}</span>
                </div>
              </div>
              <StatusBadge status={service.status} />
            </div>
            <div className="mt-2 pt-2 border-t border-primary/10">
              <div className="flex items-center gap-2 text-xs text-foreground/70">
                <User size={12} className="text-primary" />
                <span>Staff: {service.staff}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesList;
