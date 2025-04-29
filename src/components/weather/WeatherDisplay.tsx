
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CompactWeatherDisplay from './CompactWeatherDisplay';
import ExpandedWeatherDisplay from './ExpandedWeatherDisplay';

interface WeatherDisplayProps {
  expanded?: boolean;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ expanded = false }) => {
  const [isOpen, setIsOpen] = useState(expanded);
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <div>
          <CompactWeatherDisplay 
            onExpand={() => setIsOpen(true)} 
            className="text-darcare-beige hover:text-darcare-gold transition-colors" 
          />
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md p-0">
        <ExpandedWeatherDisplay onClose={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

export default WeatherDisplay;
