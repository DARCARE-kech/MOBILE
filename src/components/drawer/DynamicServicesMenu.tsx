
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Service {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
}

interface DynamicServicesMenuProps {
  onClose?: () => void;
  expanded?: boolean;
}

const DynamicServicesMenu: React.FC<DynamicServicesMenuProps> = ({ onClose, expanded = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (expanded) {
      fetchServices();
    }
  }, [expanded]);
  
  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) {
        console.error("Error fetching services:", error);
        throw error;
      }
      
      setServices(data || []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  // If not expanded, don't render the menu
  if (!expanded) {
    return null;
  }
  
  const handleServiceClick = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
    if (onClose) onClose();
  };

  const menuItemClass = 
    "flex items-center w-full justify-between p-2 rounded-md transition-colors";

  return (
    <div className="space-y-2 pl-8 pr-4 mt-1 mb-3">
      <div className="text-sm font-medium text-darcare-beige/60 mb-2">
        {t('navigation.availableServices')}
      </div>

      {loading ? (
        // Loading skeletons
        <>
          <Skeleton className="h-8 w-full bg-darcare-gold/5" />
          <Skeleton className="h-8 w-full bg-darcare-gold/5" />
          <Skeleton className="h-8 w-full bg-darcare-gold/5" />
        </>
      ) : services.length > 0 ? (
        // Services list
        services.map((service) => (
          <button 
            key={service.id}
            className={cn(menuItemClass, "text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold")} 
            onClick={() => handleServiceClick(service.id)}
          >
            <span className="text-left truncate">{service.name}</span>
            <ChevronRight size={16} className="text-darcare-beige/60" />
          </button>
        ))
      ) : (
        // No services found
        <div className="text-sm text-darcare-beige/40 py-2">
          {t('services.noServicesAvailable')}
        </div>
      )}
    </div>
  );
};

export default DynamicServicesMenu;
