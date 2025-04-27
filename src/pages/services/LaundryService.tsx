
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { Shirt, Clock, Loader2 } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LaundryService = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: laundryOptions, isLoading } = useQuery({
    queryKey: ['laundry-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('name', 'Laundry')
        .or('category.eq.service_option,category.eq.laundry_option');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader 
        title={t('services.laundry')} 
        onBack={() => navigate('/services')} 
      />
      
      <div className="p-4 space-y-5 pb-24 pt-16">
        <Card className="bg-darcare-navy border-darcare-gold/20 p-5 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-darcare-gold/10 p-3 rounded-full">
              <Shirt className="text-darcare-gold" size={24} />
            </div>
            <h2 className="text-darcare-gold font-serif text-xl">
              {t('services.laundryDescription')}
            </h2>
          </div>
          <p className="text-darcare-beige/80">
            {t('services.laundryDetails')}
          </p>
        </Card>

        <h3 className="font-serif text-xl text-darcare-gold mt-6">{t('services.availableOptions')}</h3>

        <div className="grid gap-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin w-8 h-8 border-4 border-darcare-gold border-t-transparent rounded-full" />
            </div>
          ) : (
            laundryOptions?.map((option) => (
              <Card 
                key={option.id}
                className="bg-darcare-navy/50 border-darcare-gold/20 p-4 rounded-lg cursor-pointer hover:border-darcare-gold/40 transition-colors group"
                onClick={() => navigate(`/services/requests/new`, { state: { serviceId: option.id } })}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-darcare-gold font-serif text-lg mb-2 group-hover:text-darcare-gold/90">{option.name}</h3>
                    <p className="text-darcare-beige/80 text-sm mb-3">{option.description}</p>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-transparent border-darcare-gold/30 text-darcare-gold hover:bg-darcare-gold hover:text-darcare-navy"
                    >
                      {t('services.select')}
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-1 text-darcare-beige/70 bg-darcare-gold/5 px-3 py-2 rounded">
                    <Clock size={16} />
                    <span className="text-sm">{option.estimated_duration}</span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default LaundryService;
