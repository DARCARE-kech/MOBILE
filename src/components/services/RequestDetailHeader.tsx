
import React from 'react';
import { format } from 'date-fns';
import { Clock, Calendar, User } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import StatusTimeline from '@/components/services/StatusTimeline';
import { useTranslation } from 'react-i18next';
import { formatFieldKey } from '@/utils/formattingUtils';

interface RequestDetailHeaderProps {
  serviceName: string;
  status: string;
  preferredTime?: string | null;
  createdAt?: string | null;
  staffName?: string | null;
  hideStatusBar?: boolean;
}

const RequestDetailHeader: React.FC<RequestDetailHeaderProps> = ({
  serviceName,
  status,
  preferredTime,
  createdAt,
  staffName,
  hideStatusBar = false
}) => {
  const { t } = useTranslation();
  
  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return t('services.noTimeSpecified', 'Time not specified');
    return format(new Date(dateTime), 'MMM dd, yyyy - HH:mm');
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-darcare-gold font-serif text-lg sm:text-xl">{serviceName}</h1>
        <StatusBadge status={status} />
      </div>
      
      {!hideStatusBar && (
        <StatusTimeline currentStatus={status} />
      )}
      
      <div className="grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm">
        
        {createdAt && (
          <div className="flex items-center gap-2 text-darcare-beige/80">
            <Calendar size={14} className="text-darcare-gold flex-shrink-0" />
            <div>
              <span className="block text-xs text-darcare-beige/60">{t('services.submittedOn', 'Submitted on')}</span>
              <span className="text-darcare-beige text-xs sm:text-sm">{formatDateTime(createdAt)}</span>
            </div>
          </div>
        )}
        
        {staffName && (
          <div className="flex items-center gap-2 text-darcare-beige/80">
            <User size={14} className="text-darcare-gold flex-shrink-0" />
            <div>
              <span className="block text-xs text-darcare-beige/60">{t('services.assignedStaff', 'Assigned Agent')}</span>
              <span className="text-darcare-beige text-xs sm:text-sm">{staffName}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetailHeader;
