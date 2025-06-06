
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Pencil, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RequestActionsProps {
  onEdit?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  request?: any;
  serviceId?: string;
  requestType?: 'service' | 'space';
  requestStatus?: string | null;
}

const RequestActions: React.FC<RequestActionsProps> = ({
  onEdit,
  onCancel,
  isSubmitting = false,
  request,
  serviceId,
  requestType,
  requestStatus
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

  // Determine if Modify button should be shown based on type and status
  let showModifyButton = true;
  if (requestType === 'service') {
    // For services: hide if in_progress, completed, or cancelled
    showModifyButton = requestStatus !== 'in_progress' && 
                     requestStatus !== 'completed' && 
                     requestStatus !== 'cancelled';
  } else if (requestType === 'space') {
    // For spaces: show only if pending
    showModifyButton = requestStatus === 'pending';
  }
  
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
