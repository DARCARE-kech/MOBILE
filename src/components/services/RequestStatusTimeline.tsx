
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Check, Clock } from 'lucide-react';

interface StatusHistoryItem {
  id: string;
  status: string;
  changed_at: string;
  request_id: string;
  changed_by?: string | null;
}

interface RequestStatusTimelineProps {
  statusHistory: StatusHistoryItem[];
  currentStatus: string;
}

const RequestStatusTimeline: React.FC<RequestStatusTimelineProps> = ({ statusHistory, currentStatus }) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  
  // Define standard statuses and their order
  const standardStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
  
  // Sort history by date
  const sortedHistory = [...statusHistory].sort((a, b) => 
    new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime()
  );
  
  // Create a status map to track which statuses have been visited and when
  const statusMap = sortedHistory.reduce((acc, item) => {
    acc[item.status] = item.changed_at;
    return acc;
  }, {} as Record<string, string>);
  
  // Function to get status display name
  const getStatusDisplayName = (status: string): string => {
    switch (status) {
      case 'pending':
        return t('services.pending', 'Pending');
      case 'in_progress':
        return t('services.inProgress', 'In Progress');
      case 'completed':
        return t('services.completed', 'Completed');
      case 'cancelled':
        return t('services.cancelled', 'Cancelled');
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="w-full">
      <h3 className={cn(
        "text-lg mb-4 font-serif",
        isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
      )}>
        {t('services.statusTimeline', 'Request Timeline')}
      </h3>
      
      <div className="relative flex items-start pb-4">
        {/* Line connecting all steps */}
        <div className={cn(
          "absolute top-4 left-6 right-6 h-0.5",
          isDarkMode ? "bg-darcare-gold/20" : "bg-darcare-deepGold/20"
        )} />
        
        {/* Status steps */}
        <div className="relative z-10 flex justify-between w-full px-2">
          {standardStatuses.map((status, index) => {
            const isVisited = statusMap[status] || status === currentStatus;
            const isCurrent = status === currentStatus;
            const isLast = index === standardStatuses.length - 1;
            
            // Skip cancelled if the current status is completed
            if (status === 'cancelled' && currentStatus === 'completed') return null;
            // Skip completed if the current status is cancelled
            if (status === 'completed' && currentStatus === 'cancelled') return null;
            
            return (
              <div 
                key={status} 
                className={cn(
                  "flex flex-col items-center",
                  isLast ? "flex-1" : "flex-1"
                )}
              >
                <div className={cn(
                  "rounded-full w-8 h-8 flex items-center justify-center",
                  isVisited 
                    ? isDarkMode 
                      ? "bg-darcare-gold text-darcare-navy" 
                      : "bg-darcare-deepGold text-white"
                    : isDarkMode 
                      ? "bg-darcare-navy border border-darcare-gold/30 text-darcare-beige/50" 
                      : "bg-white border border-darcare-deepGold/30 text-darcare-deepGold/50"
                )}>
                  {isVisited ? <Check size={16} /> : <Clock size={16} />}
                </div>
                
                <div className="mt-2 text-center">
                  <p className={cn(
                    "text-xs font-medium",
                    isVisited 
                      ? isCurrent 
                        ? isDarkMode 
                          ? "text-darcare-gold" 
                          : "text-darcare-deepGold" 
                        : isDarkMode 
                          ? "text-darcare-beige" 
                          : "text-foreground"
                      : isDarkMode 
                        ? "text-darcare-beige/50" 
                        : "text-foreground/50"
                  )}>
                    {getStatusDisplayName(status)}
                  </p>
                  
                  {statusMap[status] && (
                    <p className={cn(
                      "text-[10px] mt-1",
                      isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
                    )}>
                      {format(new Date(statusMap[status]), 'MMM d, p')}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RequestStatusTimeline;
