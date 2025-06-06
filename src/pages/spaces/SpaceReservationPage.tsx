
import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import BottomNavigation from '@/components/BottomNavigation';
import SpaceReservationForm from '@/components/spaces/SpaceReservationForm';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { translateSpaceName } from '@/utils/spaceTranslations';

const SpaceReservationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { editMode, reservationId } = location.state || {};

  // Fetch space details to get the space name
  const { data: spaceData } = useQuery({
    queryKey: ['space', id],
    queryFn: async () => {
      if (!id) throw new Error("Space ID is required");
      
      const { data, error } = await supabase
        .from('spaces')
        .select('name')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const getPageTitle = () => {
    if (spaceData?.name) {
      return translateSpaceName(spaceData.name, t);
    }
    return editMode ? t('services.editReservation', 'Edit Reservation') : t('services.newReservation', 'New Reservation');
  };

  const handleSuccess = () => {
    navigate('/services', { state: { activeTab: 'requests' } });
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-background mobile-safe-area">
        <AppHeader 
          title={t('common.error')}
          showBack={true}
          onBack={() => navigate(-1)}
        />
        <div className="mobile-content-padding p-4">
          <p className="text-center text-foreground/70">
            {t('common.invalidSpace', 'Invalid space ID')}
          </p>
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mobile-safe-area">
      <AppHeader 
        title={getPageTitle()}
        showBack={true}
        onBack={() => navigate(-1)}
      />
      
      <div className="mobile-content-padding">
        <SpaceReservationForm 
          spaceId={id}
          existingReservationId={editMode ? reservationId : undefined}
          onSuccess={handleSuccess}
        />
      </div>
      
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default SpaceReservationPage;
