
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface TimeSelectorProps {
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  selectedTime,
  onTimeSelect,
  isOpen,
  onOpenChange,
}) => {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige"
        >
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-darcare-gold" />
            {selectedTime ? selectedTime : "Select Time"}
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((time) => (
            <div
              key={time}
              className={cn(
                "p-2 rounded-md text-center cursor-pointer transition-all",
                selectedTime === time 
                  ? 'bg-darcare-gold/20 border border-darcare-gold/40 text-darcare-gold' 
                  : 'bg-darcare-navy/60 text-darcare-beige border border-darcare-gold/10'
              )}
              onClick={() => {
                onTimeSelect(time);
                onOpenChange(false);
              }}
            >
              {time}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
