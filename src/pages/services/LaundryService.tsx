
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { Laundry, Clock } from 'lucide-react';
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
      
      <div className="p-4 space-y-4 pb-24 pt-16">
        <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Laundry className="text-darcare-gold" />
            <h2 className="text-darcare-gold font-serif text-xl">
              {t('services.laundryDescription')}
            </h2>
          </div>
          <p className="text-darcare-beige">
            {t('services.laundryDetails')}
          </p>
        </Card>

        <div className="grid gap-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-darcare-gold border-t-transparent rounded-full"></div>
            </div>
          ) : (
            laundryOptions?.map((option) => (
              <Card 
                key={option.id}
                className="bg-darcare-navy border-darcare-gold/20 p-4 cursor-pointer hover:border-darcare-gold/40 transition-colors"
                onClick={() => navigate(`/services/requests/new`, { state: { serviceId: option.id } })}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-darcare-gold font-serif text-lg mb-2">{option.name}</h3>
                    <p className="text-darcare-beige text-sm mb-2">{option.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-darcare-beige/70">
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
