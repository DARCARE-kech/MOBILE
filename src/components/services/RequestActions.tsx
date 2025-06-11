
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Pencil, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { shouldShowRequestActions } from '@/utils/reservationUtils';

interface RequestActionsProps {
  onEdit?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  request?: any;
  serviceId?: string;
  requestType?: 'service' | 'space';
  requestStatus?: string | null;
  preferredTime?: string | null;
}

const RequestActions: React.FC<RequestActionsProps> = ({
  onEdit,
  onCancel,
  isSubmitting = false,
  request,
  serviceId,
  requestType,
  requestStatus,
  preferredTime
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else if (request && serviceId) {
      // Navigate to service form with edit state
      navigate(`/services/${serviceId}`, { 
        state: { 
          editMode: true,
          requestId: request.id
        }
      });
    }
  };

  // Use the new utility function to determine if actions should be shown
  const showModifyButton = shouldShowRequestActions(
    requestType || 'service',
    requestStatus,
    preferredTime
  );
  
  return (
    <div className="grid grid-cols-2 gap-3">
      {showModifyButton && (
        <Button
          variant="outline"
          className="bg-transparent border-darcare-gold/30 text-darcare-gold hover:border-darcare-gold hover:text-darcare-gold/90 hover:bg-transparent"
          onClick={handleEdit}
        >
          <Pencil className="h-4 w-4 mr-2" />
          {t('common.modify', 'Modify')}
        </Button>
      )}
      
      <Button
        variant="destructive"
        className="bg-darcare-red/10 text-darcare-red hover:bg-darcare-red/20"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        <X className="h-4 w-4 mr-2" />
        {isSubmitting ? t('common.processing', 'Processing...') : t('common.cancel', 'Cancel')}
      </Button>
    </div>
  );
};

export default RequestActions;
