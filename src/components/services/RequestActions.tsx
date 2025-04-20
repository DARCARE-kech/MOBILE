
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PenLine, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';

interface RequestActionsProps {
  onEdit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const RequestActions: React.FC<RequestActionsProps> = ({ 
  onEdit, 
  onCancel,
  isSubmitting = false 
}) => {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const { t } = useTranslation();

  const handleCancelRequest = () => {
    onCancel();
    setIsCancelDialogOpen(false);
  };

  return (
    <div className="flex gap-3">
      <Button 
        className="flex-1 bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
        onClick={onEdit}
        disabled={isSubmitting}
      >
        <PenLine className="mr-2 h-4 w-4" />
        {t('common.modify')}
      </Button>
      
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <Button 
          variant="outline" 
          className="flex-1 border-darcare-gold/50 text-darcare-gold hover:bg-darcare-gold/10"
          onClick={() => setIsCancelDialogOpen(true)}
          disabled={isSubmitting}
        >
          <X className="mr-2 h-4 w-4" />
          {t('common.cancel')}
        </Button>
        
        <DialogContent className="bg-darcare-navy border-darcare-gold/20">
          <DialogHeader>
            <DialogTitle className="text-darcare-gold">{t('services.cancelRequest')}</DialogTitle>
            <DialogDescription className="text-darcare-beige/80">
              {t('services.cancelRequestConfirmation')}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              className="border-darcare-gold/50 text-darcare-gold hover:bg-darcare-gold/10"
              onClick={() => setIsCancelDialogOpen(false)}
              disabled={isSubmitting}
            >
              {t('services.keepRequest')}
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleCancelRequest}
              disabled={isSubmitting}
            >
              {t('services.confirmCancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestActions;
