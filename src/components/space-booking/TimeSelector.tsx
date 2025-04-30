
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface TimeSelectorProps {
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  selectedTime,
  onTimeSelect,
  isOpen,
  onOpenChange,
}) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  // More elegant time slots with morning and afternoon grouping
  const timeSlots = [
    // Morning
    { time: '09:00', period: 'morning' },
    { time: '10:00', period: 'morning' },
    { time: '11:00', period: 'morning' },
    // Afternoon
    { time: '12:00', period: 'afternoon' },
    { time: '13:00', period: 'afternoon' },
    { time: '14:00', period: 'afternoon' },
    { time: '15:00', period: 'afternoon' },
    { time: '16:00', period: 'afternoon' },
    { time: '17:00', period: 'afternoon' },
    // Evening
    { time: '18:00', period: 'evening' }
  ];

  // Group time slots by period
  const morningSlots = timeSlots.filter(slot => slot.period === 'morning');
  const afternoonSlots = timeSlots.filter(slot => slot.period === 'afternoon');
  const eveningSlots = timeSlots.filter(slot => slot.period === 'evening');

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between border",
            isDarkMode 
              ? "bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige hover:bg-darcare-gold/10" 
              : "bg-white border-darcare-deepGold/20 text-darcare-charcoal hover:bg-darcare-deepGold/10"
          )}
        >
          <div className="flex items-center">
            <Clock className={cn(
              "mr-2 h-4 w-4",
              isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
            )} />
            {selectedTime ? selectedTime : t('services.selectTime', 'Select Time')}
          </div>
          <span className={cn(
            "transform transition-transform",
            isOpen ? "rotate-180" : ""
          )}>
            ▼
          </span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 p-3 rounded-md border transition-all" 
        style={{
          borderColor: isDarkMode ? 'rgba(234, 193, 105, 0.2)' : 'rgba(184, 138, 68, 0.2)',
          backgroundColor: isDarkMode ? 'rgba(10, 31, 51, 0.3)' : 'rgba(248, 241, 224, 0.2)'
        }}
      >
        {/* Morning slots */}
        {morningSlots.length > 0 && (
          <div className="mb-3">
            <h4 className={cn(
              "text-xs mb-2 font-medium",
              isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
            )}>
              {t('services.morning', 'Morning')}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {morningSlots.map((slot) => (
                <div
                  key={slot.time}
                  className={cn(
                    "p-2 rounded-md text-center cursor-pointer transition-all text-sm",
                    selectedTime === slot.time 
                      ? isDarkMode
                        ? 'bg-darcare-gold/20 border border-darcare-gold/40 text-darcare-gold' 
                        : 'bg-darcare-deepGold/20 border border-darcare-deepGold/40 text-darcare-deepGold'
                      : isDarkMode
                        ? 'bg-darcare-navy/60 text-darcare-beige border border-darcare-gold/10 hover:border-darcare-gold/30'
                        : 'bg-white text-darcare-charcoal border border-darcare-deepGold/10 hover:border-darcare-deepGold/30'
                  )}
                  onClick={() => {
                    onTimeSelect(slot.time);
                    onOpenChange(false);
                  }}
                >
                  {slot.time}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Afternoon slots */}
        {afternoonSlots.length > 0 && (
          <div className="mb-3">
            <h4 className={cn(
              "text-xs mb-2 font-medium",
              isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
            )}>
              {t('services.afternoon', 'Afternoon')}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {afternoonSlots.map((slot) => (
                <div
                  key={slot.time}
                  className={cn(
                    "p-2 rounded-md text-center cursor-pointer transition-all text-sm",
                    selectedTime === slot.time 
                      ? isDarkMode
                        ? 'bg-darcare-gold/20 border border-darcare-gold/40 text-darcare-gold' 
                        : 'bg-darcare-deepGold/20 border border-darcare-deepGold/40 text-darcare-deepGold'
                      : isDarkMode
                        ? 'bg-darcare-navy/60 text-darcare-beige border border-darcare-gold/10 hover:border-darcare-gold/30'
                        : 'bg-white text-darcare-charcoal border border-darcare-deepGold/10 hover:border-darcare-deepGold/30'
                  )}
                  onClick={() => {
                    onTimeSelect(slot.time);
                    onOpenChange(false);
                  }}
                >
                  {slot.time}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evening slots */}
        {eveningSlots.length > 0 && (
          <div>
            <h4 className={cn(
              "text-xs mb-2 font-medium",
              isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
            )}>
              {t('services.evening', 'Evening')}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {eveningSlots.map((slot) => (
                <div
                  key={slot.time}
                  className={cn(
                    "p-2 rounded-md text-center cursor-pointer transition-all text-sm",
                    selectedTime === slot.time 
                      ? isDarkMode
                        ? 'bg-darcare-gold/20 border border-darcare-gold/40 text-darcare-gold' 
                        : 'bg-darcare-deepGold/20 border border-darcare-deepGold/40 text-darcare-deepGold'
                      : isDarkMode
                        ? 'bg-darcare-navy/60 text-darcare-beige border border-darcare-gold/10 hover:border-darcare-gold/30'
                        : 'bg-white text-darcare-charcoal border border-darcare-deepGold/10 hover:border-darcare-deepGold/30'
                  )}
                  onClick={() => {
                    onTimeSelect(slot.time);
                    onOpenChange(false);
                  }}
                >
                  {slot.time}
                </div>
              ))}
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
