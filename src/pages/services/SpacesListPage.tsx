
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import BottomNavigation from '@/components/BottomNavigation';
import { Card } from '@/components/ui/card';
import { Loader2, Users, Clock } from 'lucide-react';
import { getFallbackImage } from '@/utils/imageUtils';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface Space {
  id: string;
  name: string;
  description: string;
  capacity?: number;
  image_url?: string;
  rules?: string;
}

const SpacesListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  // Get the service ID from location state if present
  const serviceId = location.state?.serviceId;
  
  const { data: spaces, isLoading, error } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as Space[];
    },
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader
          title={t('services.clubAccess', 'Club Access')}
          showBack={true}
          onBack={() => navigate('/services')}
        />
        
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className={cn(
            "h-8 w-8 animate-spin",
            isDarkMode ? "text-darcare-gold" : "text-secondary"
          )} />
        </div>
        
        <BottomNavigation activeTab="services" />
      </div>
    );
  }
  
  if (error || !spaces) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader
          title={t('services.clubAccess', 'Club Access')}
          onBack={() => navigate('/services')}
        />
        
        <div className="p-4 pt-24 pb-24 text-destructive">
          {t('common.error', 'Error')}: {t('common.fetchDataError', 'Failed to fetch data')}
        </div>
        
        <BottomNavigation activeTab="services" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title={t('services.clubAccess', 'Club Access')}
        onBack={() => navigate('/services')}
      />
      
      <div className="p-4 pt-24 pb-24">
        <h1 className={cn(
          "text-xl font-serif mb-4",
          isDarkMode ? "text-darcare-gold" : "text-primary"
        )}>
          {t('services.availableSpaces', 'Available Spaces')}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {spaces.map((space) => (
            <Card 
              key={space.id}
              className={cn(
                "overflow-hidden cursor-pointer transition-all hover:shadow-md",
                isDarkMode 
                  ? "bg-darcare-navy border-darcare-gold/10 hover:border-darcare-gold/30" 
                  : "bg-white border-primary/10 hover:border-primary/30"
              )}
              onClick={() => navigate(`/services/space/${space.id}`, {
                state: { serviceId: serviceId }
              })}
            >
              <div className="w-full h-40 overflow-hidden">
                <img
                  src={space.image_url || getFallbackImage(space.name, 0)}
                  alt={space.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getFallbackImage(space.name, 0);
                  }}
                />
              </div>
              
              <div className="p-4">
                <h3 className={cn(
                  "font-serif text-lg mb-2",
                  isDarkMode ? "text-darcare-gold" : "text-primary"
                )}>
                  {space.name}
                </h3>
                
                <div className="flex items-center justify-between gap-2 mb-2">
                  {space.capacity && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <Users size={14} className={isDarkMode ? "text-darcare-gold/70" : "text-secondary/70"} />
                      <span className={isDarkMode ? "text-darcare-beige/80" : "text-foreground/80"}>
                        {t('services.capacity')}: {space.capacity}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1.5 text-sm ml-auto">
                    <Clock size={14} className={isDarkMode ? "text-darcare-gold/70" : "text-secondary/70"} />
                    <span className={isDarkMode ? "text-darcare-beige/80" : "text-foreground/80"}>
                      {t('services.available', 'Available')}
                    </span>
                  </div>
                </div>
                
                <p className={cn(
                  "text-sm line-clamp-2",
                  isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
                )}>
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
