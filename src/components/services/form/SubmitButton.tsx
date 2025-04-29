
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isSubmitting: boolean;
  isValid: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, isValid }) => {
  const { t } = useTranslation();
  
  return (
    <div className="pt-4">
      <Button
        type="submit"
        disabled={isSubmitting || !isValid}
        className="w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
      >
        {isSubmitting ? t('common.submitting') : t('services.requestService')}
      </Button>
    </div>
  );
};

export default SubmitButton;
