
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ServiceDetail } from '@/hooks/services/types';
import { cn } from '@/lib/utils';
import { formatFieldKey } from '@/utils/formattingUtils';

interface ServiceHeaderProps {
  serviceName: string;
  serviceDetail?: ServiceDetail;
}

const ServiceHeader: React.FC<ServiceHeaderProps> = ({ serviceName, serviceDetail }) => {
  const { t } = useTranslation();
  
  // Extract instructions and estimated duration
  const instructions = serviceDetail?.instructions || '';
  const estimatedDuration = serviceDetail?.default_duration || '';
  
  // Format duration from interval to readable format if needed
  const formatDuration = (duration: string) => {
    if (!duration) return '';
    
    // If it's already a readable string, return it
    if (!duration.includes(':')) return duration;
    
    // Try to format PostgreSQL interval format
    try {
      // Simple formatting for common cases like "01:00:00" (1 hour)
      const parts = duration.split(':');
      if (parts.length === 3) {
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        
        if (hours > 0 && minutes > 0) {
          return `${hours} ${t('common.hour', 'hour')}${hours > 1 ? 's' : ''} ${minutes} ${t('common.minute', 'minute')}${minutes > 1 ? 's' : ''}`;
        } else if (hours > 0) {
          return `${hours} ${t('common.hour', 'hour')}${hours > 1 ? 's' : ''}`;
        } else if (minutes > 0) {
          return `${minutes} ${t('common.minute', 'minute')}${minutes > 1 ? 's' : ''}`;
        }
      }
      
      return duration;
    } catch (e) {
      return duration;
    }
  };
  
  const displayDuration = formatDuration(estimatedDuration);
  
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-serif text-darcare-gold mb-4">
  {t(`services.labels.${serviceName}`, formatFieldKey(serviceName))}
</h1>
      
      {instructions && (
        <Card className={cn(
          "mb-4 border-darcare-gold/20 bg-gradient-to-r from-darcare-navy to-darcare-navy/80 p-4 text-darcare-beige",
        )}>
          <p className="text-sm">
  {t(`services.instructions.${serviceName}`, instructions)}
</p>

        </Card>
      )}
      
      {displayDuration && (
        <div className="flex items-center gap-2 text-sm text-darcare-beige/70 mb-4">
          <Clock size={16} className="text-darcare-gold" />
          <span>{t('services.estimatedDuration', 'Estimated Duration')}: {displayDuration}</span>
        </div>
      )}
    </div>
  );
};

export default ServiceHeader;
