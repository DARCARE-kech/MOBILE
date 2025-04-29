
import React from "react";
import { ChevronRight, User, AlertTriangle, Plus, Loader2, Clock } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
  
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-darcare-gold text-xl">Today's Schedule</h2>
          <Button variant="ghost" className="text-darcare-gold text-sm flex items-center gap-1" disabled>
            Request Service <Plus size={16} />
          </Button>
        </div>
        
        <div className="luxury-card p-8 flex flex-col items-center justify-center text-center">
          <Loader2 className="text-darcare-gold mb-3 h-8 w-8 animate-spin" />
          <h3 className="text-darcare-white font-medium mb-2">Loading Schedule</h3>
          <p className="text-darcare-beige/70 text-sm">Please wait while we fetch your schedule...</p>
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-darcare-gold text-xl">Today's Schedule</h2>
          <Button 
            variant="ghost" 
            className="text-darcare-gold text-sm flex items-center gap-1"
            onClick={() => navigate('/services')}
          >
            Request Service <Plus size={16} />
          </Button>
        </div>
        
        <div className="luxury-card p-6 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="text-darcare-gold mb-3 h-8 w-8" />
          <h3 className="text-darcare-white font-medium mb-2">No Activities Scheduled</h3>
          <p className="text-darcare-beige/70 text-sm mb-4">You don't have any services scheduled today.</p>
          <Button 
            className="bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
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
        <h2 className="font-serif text-darcare-gold text-xl">Today's Schedule</h2>
        <Button 
          variant="ghost" 
          className="text-darcare-gold text-sm flex items-center gap-1"
          onClick={() => navigate('/services')}
        >
          View All <ChevronRight size={16} />
        </Button>
      </div>

      <div className="space-y-3">
        {services.map((service) => (
          <div 
            key={service.id}
            className="luxury-card border-l-2 border-l-darcare-gold hover:bg-darcare-gold/5 transition-colors duration-200 cursor-pointer p-3 shadow-sm"
            onClick={() => navigate(`/services/requests/${service.id}`)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-darcare-white text-sm">{service.title}</h3>
                <div className="flex items-center gap-2 text-xs text-darcare-beige/70 mt-1">
                  <Clock size={12} className="text-darcare-gold" />
                  <span>{service.time}</span>
                </div>
              </div>
              <StatusBadge status={service.status} />
            </div>
            <div className="mt-2 pt-2 border-t border-darcare-gold/10">
              <div className="flex items-center gap-2 text-xs text-darcare-beige/70">
                <User size={12} className="text-darcare-gold" />
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
