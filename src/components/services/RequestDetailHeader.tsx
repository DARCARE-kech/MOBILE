
import React from 'react';
import { format } from 'date-fns';
import StatusBadge from '@/components/StatusBadge';
import { useTranslation } from 'react-i18next';
import { formatFieldKey } from '@/utils/formattingUtils';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

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
  const { isDarkMode } = useTheme();
  
  // Format the preferred time if available
  const formattedPreferredTime = preferredTime
    ? format(new Date(preferredTime), "PPP 'at' p")
    : t('services.notSpecified', 'Not specified');
    
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start mb-3">
        <h2 className={cn(
          "font-serif text-xl",
          isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
        )}>
          {formatFieldKey(serviceName)}
        </h2>
        <StatusBadge status={status || 'pending'} />
      </div>
      
      <div className="flex items-center gap-2">
        <Clock className={cn(
          "h-4 w-4",
          isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
        )} />
        <span className={cn(
          "text-sm",
          isDarkMode ? "text-darcare-beige" : "text-foreground"
        )}>
          {formattedPreferredTime}
        </span>
      </div>
    </div>
  );
};

export default RequestDetailHeader;
