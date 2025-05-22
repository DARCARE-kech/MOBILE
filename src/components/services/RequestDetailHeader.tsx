
import React from 'react';
import { format } from 'date-fns';
import StatusBadge from '@/components/StatusBadge';
import { useTranslation } from 'react-i18next';
import { formatFieldKey } from '@/utils/formattingUtils';

interface RequestDetailHeaderProps {
  serviceName: string;
  status: string | null;
  preferredTime: string | null;
  createdAt: string | null;
  staffName?: string | null;
}

const RequestDetailHeader: React.FC<RequestDetailHeaderProps> = ({
  serviceName,
  status,
  preferredTime,
  createdAt,
  staffName,
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start mb-3">
        <h2 className="font-serif text-darcare-gold text-xl">
          {t(`services.${serviceName.toLowerCase()}`, formatFieldKey(serviceName))}
        </h2>
        <StatusBadge status={status || 'pending'} />
      </div>
      
      {preferredTime && (
        <div className="text-sm text-darcare-beige/80">
          <p>
            {t('services.scheduledFor')}: {format(new Date(preferredTime), 'PPp')}
          </p>
        </div>
      )}
      
      {staffName && (
        <div className="text-sm text-darcare-beige/80">
          <p>
            {t('services.assignedTo')}: {staffName}
          </p>
        </div>
      )}
      
      {createdAt && (
        <div className="text-xs text-darcare-beige/60 mt-2">
          <p>
            {t('services.requestedOn')}: {format(new Date(createdAt), 'PPp')}
          </p>
        </div>
      )}
    </div>
  );
};

export default RequestDetailHeader;
