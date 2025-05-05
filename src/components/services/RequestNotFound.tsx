
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RequestNotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <div className="p-4 text-center text-darcare-beige">
      <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-darcare-gold" />
      <h2 className="text-xl font-medium text-darcare-white mb-2">{t('common.notFound')}</h2>
      <p>{t('services.requestErrorDesc')}</p>
      <Button 
        className="mt-8 bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
        onClick={() => navigate('/services')}
      >
        {t('navigation.services')}
      </Button>
    </div>
  );
};

export default RequestNotFound;
