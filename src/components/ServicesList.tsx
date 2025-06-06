
import React from "react";
import { ChevronRight, User, Plus, Loader2, Clock } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface Service {
  id: string;
  type?: 'service' | 'space';
  title?: string;
  status: "pending" | "active" | "completed" | "cancelled" | string;
  preferred_time?: string | null;
  staff_assignments?: { 
    staff_id?: string | null;
    staff_name?: string | null;
  }[] | null;
  services?: {
    name?: string;
    category?: string;
  } | null;
  space_id?: string | null;
  service_id?: string | null;
  name?: string;
}

interface ServicesListProps {
  services: Service[];
  isLoading?: boolean;
}

const ServicesList: React.FC<ServicesListProps> = ({ services = [], isLoading = false }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-primary text-xl">{t('services.todaysSchedule')}</h2>
          <Button 
            variant="ghost" 
            className="text-primary text-sm flex items-center gap-1"
            onClick={() => navigate('/services')}
          >
            {t('services.viewAll')} <ChevronRight size={16} />
          </Button>
        </div>
        <div className="luxury-card p-8 flex flex-col items-center justify-center text-center">
          <Loader2 className="text-primary mb-3 h-8 w-8 animate-spin" />
          <h3 className="text-foreground font-medium mb-2">{t('services.loading')}</h3>
          <p className="text-foreground/70 text-sm">{t('services.loadingDescription')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-primary text-xl">{t('services.todaysSchedule')}</h2>
        <Button 
          variant="ghost" 
          className="text-primary text-sm flex items-center gap-1"
          onClick={() => navigate('/services')}
        >
          {t('services.viewAll')} <ChevronRight size={16} />
        </Button>
      </div>

      {!services || services.length === 0 ? (
        <div className={cn(
          "relative overflow-hidden rounded-xl p-6 flex flex-col items-center justify-center text-center",
          isDarkMode 
            ? "bg-gradient-to-b from-darcare-navy/80 to-[#1C1F2A] border border-darcare-gold/10" 
            : "bg-white border border-darcare-deepGold/10 shadow-sm"
        )}>
          <div className={cn(
            "absolute inset-0 opacity-10 pointer-events-none",
            isDarkMode ? "bg-[url('/placeholder.svg')] bg-center bg-no-repeat bg-contain" : ""
          )} />
          
          <h3 className={cn(
            "font-serif text-lg mb-2",
            isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
          )}>
            {t('services.noScheduledActivityToday')}
          </h3>
          
          <p className={cn(
            "text-sm mb-4 max-w-md",
            isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
          )}>
            {t('services.bookServiceOrSpace')}
          </p>
          
          <Button 
            className={cn(
              "flex items-center gap-2",
              isDarkMode 
                ? "bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90" 
                : "bg-darcare-deepGold text-white hover:bg-darcare-deepGold/90"
            )}
            onClick={() => navigate('/services')}
          >
            <Plus size={16} />
            {t('services.scheduleNow')}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => {
            // Get service name
            let serviceName = '';
            if (service.services?.name) {
              serviceName = t(`services.${service.services.name}`, service.services.name);
            } else if (service.name) {
              serviceName = t(`services.${service.name}`, service.name);
            } else if (service.title) {
              serviceName = t(`services.${service.title}`, service.title);
            } else {
              serviceName = t('services.untitled');
            }
            
            console.log("Rendering unified request:", service.id, "Name:", serviceName, "Type:", service.type);
            
            // Format time or use placeholder
            const formattedTime = service.preferred_time 
              ? new Date(service.preferred_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : t('services.noTimeSpecified');
            
            // Extract staff name (only for services)
            let staffName = null;
            if (service.type === 'service' && service.staff_assignments && service.staff_assignments.length > 0) {
              const assignment = service.staff_assignments[0];
              if (assignment.staff_name) {
                staffName = assignment.staff_name;
              }
            }

            return (
              <div 
                key={service.id}
                className={cn(
                  "rounded-2xl border transition-all duration-200 cursor-pointer p-3 hover:shadow-md",
                  isDarkMode 
                    ? "bg-[#1C1F2A] border-darcare-gold/10 hover:border-darcare-gold/20" 
                    : "bg-white border-darcare-deepGold/10 hover:border-darcare-deepGold/20"
                )}
                onClick={() => navigate(`/services/requests/${service.id}`)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className={cn(
                      "font-serif font-medium",
                      isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
                    )}>
                      {serviceName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-foreground/70 mt-1">
                      <Clock size={12} className="text-primary" />
                      <span>{formattedTime}</span>
                    </div>
                  </div>
                  <StatusBadge status={service.status} />
                </div>
                
                {service.type === 'service' && (
                  <div className={cn(
                    "mt-2 pt-2 border-t",
                    isDarkMode ? "border-darcare-gold/10" : "border-darcare-deepGold/10"
                  )}>
                    <div className="flex items-center gap-2 text-xs text-foreground/70">
                      <User size={12} className="text-primary" />
                      <span>
                        {t('services.staffLabel')}: {staffName || t('services.notYetAssigned')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServicesList;
