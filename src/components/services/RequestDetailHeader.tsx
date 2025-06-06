
import React from 'react';
import { format } from 'date-fns';
import StatusBadge from '@/components/StatusBadge';
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
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h1 className="text-darcare-gold font-serif text-xl sm:text-2xl mb-2">{serviceName}</h1>
        <StatusBadge status={status} />
      </div>
      
      {!hideStatusBar && (
        <StatusTimeline status={status} />
      )}
      
      <div className="grid grid-cols-1 gap-3 sm:gap-4 text-sm">
        <div className="flex items-center gap-2 text-darcare-beige/80">
          <Clock size={16} className="text-darcare-gold flex-shrink-0" />
          <div>
            <span className="block text-xs text-darcare-beige/60">{t('services.scheduledFor', 'Scheduled for')}</span>
            <span className="text-darcare-beige">{formatDateTime(preferredTime)}</span>
          </div>
        </div>
        
        {createdAt && (
          <div className="flex items-center gap-2 text-darcare-beige/80">
            <Calendar size={16} className="text-darcare-gold flex-shrink-0" />
            <div>
              <span className="block text-xs text-darcare-beige/60">{t('services.submittedOn', 'Submitted on')}</span>
              <span className="text-darcare-beige">{formatDateTime(createdAt)}</span>
            </div>
          </div>
        )}
        
        {staffName && (
          <div className="flex items-center gap-2 text-darcare-beige/80">
            <User size={16} className="text-darcare-gold flex-shrink-0" />
            <div>
              <span className="block text-xs text-darcare-beige/60">{t('services.assignedStaff', 'Assigned Staff')}</span>
              <span className="text-darcare-beige">{staffName}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetailHeader;
