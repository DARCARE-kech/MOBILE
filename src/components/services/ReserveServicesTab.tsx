
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ReserveServicesTab: React.FC = () => {
  const navigate = useNavigate();

  const { data: services, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
      </div>
    );
  }

  if (error || !services) {
    return (
      <div className="p-4 text-destructive">
        Error loading services. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {services.map(service => (
        <Card 
          key={service.id} 
          className="bg-darcare-navy border border-darcare-gold/20 overflow-hidden"
        >
          <AspectRatio ratio={16/9}>
            <img 
              src={service.image_url || '/placeholder.svg'} 
              alt={service.name} 
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          <div className="p-4">
            <h2 className="text-darcare-white text-lg font-semibold mb-2">
              {service.name}
            </h2>
            <p className="text-darcare-beige mb-4">
              {service.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-darcare-beige/70">
                {service.estimated_duration}
              </span>
              <Button 
                onClick={() => navigate(`/services/${service.id}`)}
                className="bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
              >
                Book Service
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReserveServicesTab;
