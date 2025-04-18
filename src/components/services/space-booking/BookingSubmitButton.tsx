
import React from 'react';
import { Send } from 'lucide-react';
import IconButton from '@/components/services/IconButton';
import { cn } from '@/lib/utils';

interface BookingSubmitButtonProps {
  isSubmitting: boolean;
}

export const BookingSubmitButton: React.FC<BookingSubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <div className="fixed bottom-4 right-4 z-10">
      <IconButton
        type="submit"
        icon={<Send className="w-5 h-5" />}
        variant="primary"
        size="lg"
        className={cn(
          "shadow-lg",
          isSubmitting && "opacity-70 cursor-not-allowed"
        )}
        disabled={isSubmitting}
      />
      {isSubmitting && (
        <div className="absolute -left-12 top-1/2 -translate-y-1/2">
          <div className="animate-spin w-5 h-5 border-2 border-darcare-gold border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
};
