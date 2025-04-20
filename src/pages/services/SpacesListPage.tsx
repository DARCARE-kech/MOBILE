
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getFallbackImage } from '@/utils/imageUtils';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';

const SpacesListPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: spaces, isLoading, error } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spaces')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="bg-darcare-navy min-h-screen">
        <MainHeader title="Book a Space" onBack={() => navigate('/services')} />
        <div className="flex justify-center items-center h-64 pt-16">
          <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }

  if (error || !spaces) {
    return (
      <div className="bg-darcare-navy min-h-screen">
        <MainHeader title="Book a Space" onBack={() => navigate('/services')} />
        <div className="p-4 text-destructive pt-16">
          Error loading spaces. Please try again later.
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }

  return (
    <div className="bg-darcare-navy min-h-screen pb-24">
      <MainHeader title="Book a Space" onBack={() => navigate('/services')} />
      
      <div className="p-4 pt-16">
        <div className="mb-4">
          <h2 className="text-darcare-gold font-serif text-xl">Available Spaces</h2>
          <p className="text-darcare-beige/70">Select a space to reserve</p>
        </div>
        
        <div className="space-y-4">
          {spaces.map((space, index) => (
            <Card 
              key={space.id}
              className="bg-darcare-navy border border-darcare-gold/20 overflow-hidden cursor-pointer"
              onClick={() => navigate(`/services/space/${space.id}`)}
            >
              <AspectRatio ratio={16/9}>
                <img 
                  src={space.image_url || getFallbackImage(space.name, index)}
                  alt={space.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getFallbackImage(space.name, index);
                  }}
                />
              </AspectRatio>
              <div className="p-4">
                <h3 className="text-darcare-white text-lg font-semibold mb-1">
                  {space.name}
                </h3>
                <p className="text-darcare-beige/70 text-sm mb-2">
                  Capacity: {space.capacity || "Not specified"} people
                </p>
                <p className="text-darcare-beige line-clamp-2">
                  {space.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default SpacesListPage;
