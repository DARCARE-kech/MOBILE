
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Loader2, Users } from 'lucide-react';
import { getFallbackImage } from '@/utils/imageUtils';
import AppHeader from '@/components/AppHeader';
import BottomNavigation from '@/components/BottomNavigation';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const SpacesListPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

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
        <AppHeader title={t('services.bookSpace', 'Book a Space')} onBack={() => navigate('/services')} />
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
        <AppHeader title={t('services.bookSpace', 'Book a Space')} onBack={() => navigate('/services')} />
        <div className="p-4 text-destructive pt-16">
          {t('common.errorLoading', 'Error loading spaces. Please try again later.')}
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }

  return (
    <div className="bg-darcare-navy min-h-screen pb-24">
      <AppHeader title={t('services.bookSpace', 'Book a Space')} onBack={() => navigate('/services')} />
      
      <div className="p-4 pt-16">
        <div className="mb-6">
          <h2 className="text-darcare-gold font-serif text-xl">
            {t('services.availableSpaces', 'Available Spaces')}
          </h2>
          <p className="text-darcare-beige/70">
            {t('services.selectSpaceToReserve', 'Select a space to reserve')}
          </p>
        </div>
        
        <div className="space-y-4">
          {spaces.map((space, index) => (
            <div 
              key={space.id}
              className={cn(
                "flex border border-darcare-gold/20 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200",
                isDarkMode 
                  ? "bg-[#1C1F2A] hover:shadow-darcare-gold/10" 
                  : "bg-white hover:shadow-darcare-deepGold/10"
              )}
              onClick={() => navigate(`/services/space/${space.id}`)}
            >
              {/* Image on the left */}
              <div className="w-1/3 min-w-[100px] h-32">
                <img 
                  src={space.image_url || getFallbackImage(space.name, index)}
                  alt={space.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getFallbackImage(space.name, index);
                  }}
                />
              </div>
              
              {/* Content on the right */}
              <div className="p-3 flex flex-col justify-between w-2/3">
                <div>
                  <h3 className={cn(
                    "font-serif text-lg mb-1 line-clamp-1",
                    isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
                  )}>
                    {space.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-sm mb-1">
                    <Users size={14} className={isDarkMode ? "text-darcare-gold/70" : "text-darcare-deepGold/70"} />
                    <span className={isDarkMode ? "text-darcare-beige/80" : "text-darcare-charcoal/80"}>
                      {t('services.capacity', 'Capacity')}: {space.capacity || t('common.notSpecified', 'Not specified')}
                    </span>
                  </div>
                  
                  <p className={cn(
                    "text-xs line-clamp-2",
                    isDarkMode ? "text-darcare-beige/70" : "text-darcare-charcoal/70"
                  )}>
                    {space.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default SpacesListPage;
