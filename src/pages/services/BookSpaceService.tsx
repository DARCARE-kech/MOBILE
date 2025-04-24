
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import BottomNavigation from '@/components/BottomNavigation';
import Header from '@/components/services/space-booking/Header';
import LoadingState from '@/components/services/space-booking/LoadingState';
import SpaceInfoCard from '@/components/services/space-booking/SpaceInfoCard';
import { SpaceBookingForm } from '@/components/services/space-booking/SpaceBookingForm';

const BookSpaceService = () => {
  const navigate = useNavigate();
  const { id: spaceId } = useParams();
  
  const { data: spaces, isLoading } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spaces')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const selectedSpace = spaces?.find(space => space.id === spaceId) || spaces?.[0];

  if (isLoading || !selectedSpace) {
    return <LoadingState onBack={() => navigate('/services/spaces')} />;
  }

  return (
    <div className="bg-darcare-navy min-h-screen pb-20">
      <Header 
        title={selectedSpace.name}
        onBack={() => navigate('/services/spaces')} 
      />

      <div className="p-4 space-y-4 pb-24">
        <SpaceInfoCard space={selectedSpace} />
        <SpaceBookingForm 
          space={selectedSpace}
          onSuccess={() => navigate('/services')}
        />
      </div>
      
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default BookSpaceService;
