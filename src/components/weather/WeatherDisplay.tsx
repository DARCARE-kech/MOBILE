
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import CompactWeatherDisplay from "./CompactWeatherDisplay";
import ExpandedWeatherDisplay from "./ExpandedWeatherDisplay";

interface WeatherDisplayProps {
  expanded?: boolean;
  className?: string;
}

const WeatherDisplay = ({ expanded = false, className }: WeatherDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  // Reset expansion state when prop changes
  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  // Show either compact or expanded view
  return isExpanded ? (
    <ExpandedWeatherDisplay 
      onClose={handleClose} 
      className={className} 
    />
  ) : (
    <CompactWeatherDisplay 
      onExpand={handleExpand} 
      className={className} 
    />
  );
};

export default WeatherDisplay;
