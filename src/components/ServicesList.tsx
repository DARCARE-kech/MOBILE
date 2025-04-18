
import React from "react";
import { ChevronRight, User } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

interface Service {
  id: string;
  title: string;
  status: "active" | "completed" | "pending";
  time: string;
  staff: string;
}

interface ServicesListProps {
  services: Service[];
}

const ServicesList: React.FC<ServicesListProps> = ({ services }) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">Your Services</h2>
        <button className="text-darcare-gold text-sm flex items-center">
          View All <ChevronRight size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.id} className="luxury-card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-darcare-white mb-1">{service.title}</h3>
                <p className="text-sm text-darcare-beige/70">{service.time}</p>
              </div>
              <StatusBadge status={service.status} />
            </div>
            <div className="mt-3 pt-3 border-t border-darcare-gold/10 flex items-center gap-2 text-sm text-darcare-beige/70">
              <User size={14} className="text-darcare-gold" />
              <span>Staff: {service.staff}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesList;
