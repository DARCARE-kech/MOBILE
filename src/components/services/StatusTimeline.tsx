
import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface StatusTimelineProps {
  currentStatus: string | null;
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus }) => {
  const { t } = useTranslation();
  
  // Skip rendering for cancelled requests
  if (currentStatus === 'cancelled') {
    return null;
  }
  
  const statuses = [
    { key: 'pending', label: t('services.status.pending') },
    { key: 'in_progress', label: t('services.status.in_progress') },
    { key: 'completed', label: t('services.status.completed') }
  ];

  // Find the current status index
  const currentIndex = statuses.findIndex(status => 
    status.key === currentStatus || 
    (status.key === 'in_progress' && currentStatus === 'active')
  );
  
  return (
    <div className="space-y-2 mt-4">
      <h3 className="text-sm font-medium text-darcare-gold uppercase">
        {t('services.requestProgress', 'Request Progress')}
      </h3>
      
      <div className="flex items-center w-full">
        {statuses.map((status, index) => (
          <React.Fragment key={status.key}>
            {/* Status circle */}
            <div className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-4 h-4 rounded-full border",
                  index <= currentIndex 
                    ? "bg-darcare-gold border-darcare-gold" 
                    : "bg-transparent border-darcare-beige/30"
                )}
              />
              <span 
                className={cn(
                  "text-xs mt-1",
                  index <= currentIndex 
                    ? "text-darcare-beige" 
                    : "text-darcare-beige/40"
                )}
              >
                {status.label}
              </span>
            </div>
            
            {/* Connecting line (except after last item) */}
            {index < statuses.length - 1 && (
              <div 
                className={cn(
                  "flex-1 h-0.5 mx-1",
                  index < currentIndex 
                    ? "bg-darcare-gold" 
                    : "bg-darcare-beige/30"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StatusTimeline;
