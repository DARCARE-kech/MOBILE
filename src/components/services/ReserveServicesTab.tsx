
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Loader2, DoorOpen, ShoppingBag } from 'lucide-react';
import IconButton from './IconButton';
import { AspectRatio } from '@/components/ui/aspect-ratio';

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

  // Filter out the "Book Space" service since we'll add it manually
  const filteredServices = services.filter(service => !service.name.toLowerCase().includes('space'));

  return (
    <div className="space-y-4 mt-4">
      {filteredServices.map(service => (
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
              <IconButton 
                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>}
                variant="primary"
                onClick={() => navigate(`/services/${service.id}`)}
              />
            </div>
          </div>
        </Card>
      ))}
      
      <Card 
        className="bg-darcare-navy border border-darcare-gold/20 overflow-hidden cursor-pointer"
        onClick={() => navigate('/services/space')}
      >
        <AspectRatio ratio={16/9}>
          <img 
            src="https://xhsjtgezcrgyypumzkra.supabase.co/storage/v1/object/public/spaces/pool.jpg"
            alt="Book a Space" 
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        <div className="p-4">
          <h2 className="text-darcare-white text-lg font-semibold mb-2">
            Book a Space
          </h2>
          <p className="text-darcare-beige mb-4">
            Reserve our exclusive facilities including the pool, padel court, and fitness center.
          </p>
          <div className="flex items-center justify-end">
            <IconButton 
              icon={<DoorOpen className="w-5 h-5" />}
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/services/space');
              }}
            />
          </div>
        </div>
      </Card>
      
      <Card 
        className="bg-darcare-navy border border-darcare-gold/20 overflow-hidden"
      >
        <AspectRatio ratio={16/9}>
          <img 
            src="https://images.unsplash.com/photo-1580913428735-bd3c269d6a82?auto=format&fit=crop&q=80&w=1770&ixlib=rb-4.0.3"
            alt="Shop" 
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        <div className="p-4">
          <h2 className="text-darcare-white text-lg font-semibold mb-2">
            Shop
          </h2>
          <p className="text-darcare-beige mb-4">
            Browse our exclusive selection of luxury items, local delicacies, and essentials.
          </p>
          <div className="flex items-center justify-end">
            <IconButton 
              icon={<ShoppingBag className="w-5 h-5" />}
              variant="primary"
              onClick={() => navigate(`/services/shop`)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReserveServicesTab;
