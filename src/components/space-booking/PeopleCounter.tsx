
import React from 'react';
import { Users } from 'lucide-react';
import FormSectionTitle from '@/components/services/FormSectionTitle';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface PeopleCounterProps {
  count: number;
  maxCapacity?: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const PeopleCounter: React.FC<PeopleCounterProps> = ({
  count,
  maxCapacity,
  onIncrement,
  onDecrement
}) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="mt-2">
      <FormSectionTitle 
        title={t('services.numberOfPeople', 'Number of People')} 
        icon={<Users className="w-5 h-5" />}
        rawKeys={true}
      />
      
      <div className={cn(
        "flex items-center justify-between rounded-md p-3 mt-2",
        isDarkMode ? "bg-darcare-navy/60" : "bg-gray-50"
      )}>
        <button
          type="button"
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center border text-lg font-medium transition-all",
            isDarkMode 
              ? "border-darcare-gold/30 text-darcare-gold hover:bg-darcare-gold/10" 
              : "border-darcare-deepGold/30 text-darcare-deepGold hover:bg-darcare-deepGold/10"
          )}
          onClick={onDecrement}
          aria-label={t('common.decrease', 'Decrease')}
        >
          -
        </button>
        
        <div className={cn(
          "text-lg font-serif",
          isDarkMode ? "text-darcare-beige" : "text-darcare-charcoal"
        )}>
          {count} {count === 1 
            ? t('services.person', 'Person') 
            : t('services.people', 'People')
          }
        </div>
        
        <button
          type="button"
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center border text-lg font-medium transition-all",
            isDarkMode 
              ? "border-darcare-gold/30 text-darcare-gold hover:bg-darcare-gold/10" 
              : "border-darcare-deepGold/30 text-darcare-deepGold hover:bg-darcare-deepGold/10"
          )}
          onClick={onIncrement}
          aria-label={t('common.increase', 'Increase')}
        >
          +
        </button>
      </div>
      
      {maxCapacity && count > maxCapacity && (
        <p className="text-red-400 text-sm mt-2">
          {t('services.capacityExceeded', 'This exceeds the maximum capacity of {{capacity}} people.', { capacity: maxCapacity })}
        </p>
      )}
    </div>
  );
};
