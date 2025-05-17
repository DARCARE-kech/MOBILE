
import React, { useState } from 'react';
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
  selectedTime?: string | null; // Make this prop optional or nullable
  onTimeSelect: (time: string) => void;
  isOpen?: boolean; // Make isOpen optional
  onOpenChange?: (open: boolean) => void; // Make onOpenChange optional
  value?: string; // Add value prop for backward compatibility
  onChange?: (time: string) => void; // Add onChange prop for backward compatibility
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  selectedTime,
  onTimeSelect,
  isOpen = false, // Default value
  onOpenChange = () => {}, // Default empty function
  value, // Get value from props
  onChange, // Get onChange from props
}) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);

  // Handle both API patterns
  const handleTimeSelect = (time: string) => {
    onTimeSelect(time);
    if (onChange) onChange(time);
    
    // Handle internal state if onOpenChange not provided
    if (!onOpenChange) {
      setInternalIsOpen(false);
    } else {
      onOpenChange(false);
    }
  };

  // Use either the controlled or uncontrolled open state
  const openState = onOpenChange ? isOpen : internalIsOpen;
  const setOpenState = onOpenChange || setInternalIsOpen;
  
  // Use value prop if selectedTime is not provided
  const displayTime = selectedTime || value || null;

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
      open={openState}
      onOpenChange={setOpenState}
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
            {displayTime ? displayTime : t('services.selectTime', 'Select Time')}
          </div>
          <span className={cn(
            "transform transition-transform",
            openState ? "rotate-180" : ""
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
                    displayTime === slot.time 
                      ? isDarkMode
                        ? 'bg-darcare-gold/20 border border-darcare-gold/40 text-darcare-gold' 
                        : 'bg-darcare-deepGold/20 border border-darcare-deepGold/40 text-darcare-deepGold'
                      : isDarkMode
                        ? 'bg-darcare-navy/60 text-darcare-beige border border-darcare-gold/10 hover:border-darcare-gold/30'
                        : 'bg-white text-darcare-charcoal border border-darcare-deepGold/10 hover:border-darcare-deepGold/30'
                  )}
                  onClick={() => handleTimeSelect(slot.time)}
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
                    displayTime === slot.time 
                      ? isDarkMode
                        ? 'bg-darcare-gold/20 border border-darcare-gold/40 text-darcare-gold' 
                        : 'bg-darcare-deepGold/20 border border-darcare-deepGold/40 text-darcare-deepGold'
                      : isDarkMode
                        ? 'bg-darcare-navy/60 text-darcare-beige border border-darcare-gold/10 hover:border-darcare-gold/30'
                        : 'bg-white text-darcare-charcoal border border-darcare-deepGold/10 hover:border-darcare-deepGold/30'
                  )}
                  onClick={() => handleTimeSelect(slot.time)}
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
                    displayTime === slot.time 
                      ? isDarkMode
                        ? 'bg-darcare-gold/20 border border-darcare-gold/40 text-darcare-gold' 
                        : 'bg-darcare-deepGold/20 border border-darcare-deepGold/40 text-darcare-deepGold'
                      : isDarkMode
                        ? 'bg-darcare-navy/60 text-darcare-beige border border-darcare-gold/10 hover:border-darcare-gold/30'
                        : 'bg-white text-darcare-charcoal border border-darcare-deepGold/10 hover:border-darcare-deepGold/30'
                  )}
                  onClick={() => handleTimeSelect(slot.time)}
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
