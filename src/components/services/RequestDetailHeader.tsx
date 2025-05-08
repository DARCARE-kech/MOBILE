
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
}

const RequestDetailHeader: React.FC<RequestDetailHeaderProps> = ({
  serviceName,
  status,
  preferredTime,
  createdAt,
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start mb-3">
        <h2 className="font-serif text-darcare-gold text-xl">
  {t(`services.${serviceName}`, formatFieldKey(serviceName))}
</h2>

        <span>{t(`services.status.${status}`, status)}</span>

      </div>
    </div>
  );
};

export default RequestDetailHeader;
