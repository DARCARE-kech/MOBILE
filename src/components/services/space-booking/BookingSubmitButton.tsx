
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface BookingSubmitButtonProps {
  isSubmitting: boolean;
}

export const BookingSubmitButton: React.FC<BookingSubmitButtonProps> = ({ isSubmitting }) => {
  const { t } = useTranslation();
  
  return (
    <Button
      type="submit"
      className="w-full bg-darcare-gold hover:bg-darcare-gold/90 text-darcare-navy font-medium text-base py-6"
      disabled={isSubmitting}
    >
      {isSubmitting 
        ? t('common.submitting', 'Submitting...') 
        : t('services.sendRequest', 'Send Request')}
    </Button>
  );
};
