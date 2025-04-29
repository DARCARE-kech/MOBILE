
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CleaningServiceProps {
  serviceData?: any;
}

const CleaningService: React.FC<CleaningServiceProps> = ({ serviceData }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Get cleaning options from optional_fields if available, otherwise use defaults
  const cleaningOptions = serviceData?.optional_fields?.options || [
    'Standard Cleaning', 
    'Deep Cleaning', 
    'Window Cleaning'
  ];
  
  const getDuration = (index: number) => {
    if (serviceData?.optional_fields?.durations && serviceData.optional_fields.durations[index]) {
      return serviceData.optional_fields.durations[index];
    }
    return index === 0 ? '1-2h' : index === 1 ? '3-4h' : '1h';
  };

  const getDescription = (index: number) => {
    if (serviceData?.optional_fields?.descriptions && serviceData.optional_fields.descriptions[index]) {
      return serviceData.optional_fields.descriptions[index];
    }
    return index === 0 ? t('services.standardCleaningDesc') : 
           index === 1 ? t('services.deepCleaningDesc') : t('services.windowCleaningDesc');
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <Card className="bg-darcare-navy border-darcare-gold/20 p-5 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-darcare-gold/10 p-3 rounded-full">
            <Sprout className="text-darcare-gold" size={24} />
          </div>
          <h2 className="text-darcare-gold font-serif text-xl">
            {t('services.cleaningDescription')}
          </h2>
        </div>
        
        <p className="text-darcare-beige/80 mb-4">
          {serviceData?.instructions || t('services.cleaningDefaultInstructions')}
        </p>
        
        {serviceData?.price_range && (
          <p className="text-darcare-gold font-medium mt-2">
            {t('services.pricing')}: {serviceData.price_range}
          </p>
        )}
        
        <Button 
          className="w-full mt-4 bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
          onClick={() => navigate('/services/requests/new', { state: { serviceType: 'cleaning' } })}
        >
          {t('services.requestService')}
        </Button>
      </Card>
      
      <h3 className="font-serif text-xl text-darcare-gold mt-6">{t('services.cleaningOptions')}</h3>
      
      <div className="grid gap-4">
        {cleaningOptions.map((option: string, index: number) => (
          <Card 
            key={index}
            className="bg-darcare-navy/50 border-darcare-gold/20 p-4 rounded-lg cursor-pointer hover:border-darcare-gold/40 transition-colors"
            onClick={() => navigate('/services/requests/new', { state: { serviceType: 'cleaning', option } })}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-darcare-gold font-serif text-lg">{option}</h3>
                <p className="text-darcare-beige/70 text-sm my-2">
                  {getDescription(index)}
                </p>
              </div>
              
              <div className="flex items-center gap-1 text-darcare-beige/70">
                <Clock size={16} className="text-darcare-gold" />
                <span>{getDuration(index)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CleaningService;
