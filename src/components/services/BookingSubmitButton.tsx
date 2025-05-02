
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface BookingSubmitButtonProps {
  isSubmitting: boolean;
  isEditing?: boolean;
}

export const BookingSubmitButton: React.FC<BookingSubmitButtonProps> = ({
  isSubmitting,
  isEditing = false
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className={cn(
        "w-full text-base py-6",
        isDarkMode
          ? "bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('common.processing', 'Processing...')}
        </>
      ) : isEditing ? (
        t('services.updateBooking', 'Update Booking')
      ) : (
        t('services.confirmBooking', 'Confirm Booking')
      )}
    </Button>
  );
};
