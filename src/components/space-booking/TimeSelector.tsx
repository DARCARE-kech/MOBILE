
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Clock, ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface TimeSelectorProps {
  selectedTime?: string | null;
  onTimeSelect: (time: string) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  onChange?: (time: string) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  selectedTime,
  onTimeSelect,
  isOpen = false,
  onOpenChange = () => {},
  value,
  onChange,
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
            "w-full justify-between rounded-2xl shadow-sm transition-all duration-200",
            isDarkMode 
              ? "bg-darcare-navy/60 border-darcare-gold/30 text-darcare-beige hover:bg-darcare-gold/10 hover:border-darcare-gold/50" 
              : "bg-white border-darcare-deepGold/30 text-darcare-charcoal hover:bg-darcare-deepGold/10 hover:border-darcare-deepGold/50"
          )}
        >
          <div className="flex items-center">
            <Clock className={cn(
              "mr-3 h-5 w-5",
              isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
            )} />
            <span className="text-base">
              {displayTime ? displayTime : t('services.selectTime', 'Select Time')}
            </span>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform duration-200",
            openState ? "rotate-180" : "",
            isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
          )} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 rounded-2xl shadow-lg transition-all overflow-hidden" 
        style={{
          borderColor: isDarkMode ? 'rgba(234, 193, 105, 0.3)' : 'rgba(184, 138, 68, 0.3)',
          backgroundColor: isDarkMode ? 'rgba(10, 31, 51, 0.4)' : 'rgba(248, 241, 224, 0.3)'
        }}
      >
        <div className="p-5 space-y-6">
          {/* Morning slots */}
          {morningSlots.length > 0 && (
            <div>
              <h4 className={cn(
                "text-sm mb-3 font-serif font-medium",
                isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
              )}>
                {t('services.morning', 'Morning')}
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {morningSlots.map((slot) => (
                  <div
                    key={slot.time}
                    className={cn(
                      "p-3 rounded-xl text-center cursor-pointer transition-all duration-200 text-base",
                      displayTime === slot.time 
                        ? isDarkMode
                          ? 'bg-darcare-gold/20 border border-darcare-gold/50 text-darcare-gold shadow-md' 
                          : 'bg-darcare-deepGold/20 border border-darcare-deepGold/50 text-darcare-deepGold shadow-md'
                        : isDarkMode
                          ? 'bg-darcare-navy/60 text-darcare-beige border border-darcare-gold/20 hover:border-darcare-gold/40 hover:bg-darcare-gold/10'
                          : 'bg-white text-darcare-charcoal border border-darcare-deepGold/20 hover:border-darcare-deepGold/40 hover:bg-darcare-deepGold/10'
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
            <div>
              <h4 className={cn(
                "text-sm mb-3 font-serif font-medium",
                isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
              )}>
                {t('services.afternoon', 'Afternoon')}
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {afternoonSlots.map((slot) => (
                  <div
                    key={slot.time}
                    className={cn(
                      "p-3 rounded-xl text-center cursor-pointer transition-all duration-200 text-base",
                      displayTime === slot.time 
                        ? isDarkMode
                          ? 'bg-darcare-gold/20 border border-darcare-gold/50 text-darcare-gold shadow-md' 
                          : 'bg-darcare-deepGold/20 border border-darcare-deepGold/50 text-darcare-deepGold shadow-md'
                        : isDarkMode
                          ? 'bg-darcare-navy/60 text-darcare-beige border border-darcare-gold/20 hover:border-darcare-gold/40 hover:bg-darcare-gold/10'
                          : 'bg-white text-darcare-charcoal border border-darcare-deepGold/20 hover:border-darcare-deepGold/40 hover:bg-darcare-deepGold/10'
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
                "text-sm mb-3 font-serif font-medium",
                isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
              )}>
                {t('services.evening', 'Evening')}
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {eveningSlots.map((slot) => (
                  <div
                    key={slot.time}
                    className={cn(
                      "p-3 rounded-xl text-center cursor-pointer transition-all duration-200 text-base",
                      displayTime === slot.time 
                        ? isDarkMode
                          ? 'bg-darcare-gold/20 border border-darcare-gold/50 text-darcare-gold shadow-md' 
                          : 'bg-darcare-deepGold/20 border border-darcare-deepGold/50 text-darcare-deepGold shadow-md'
                        : isDarkMode
                          ? 'bg-darcare-navy/60 text-darcare-beige border border-darcare-gold/20 hover:border-darcare-gold/40 hover:bg-darcare-gold/10'
                          : 'bg-white text-darcare-charcoal border border-darcare-deepGold/20 hover:border-darcare-deepGold/40 hover:bg-darcare-deepGold/10'
                    )}
                    onClick={() => handleTimeSelect(slot.time)}
                  >
                    {slot.time}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
