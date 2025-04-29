
import { CloudSun } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { fetchWeatherData } from "@/utils/weatherUtils";
import { getWeatherIcon } from "./weatherDisplayUtils";

interface CompactWeatherDisplayProps {
  className?: string;
  onExpand: () => void;
}

const CompactWeatherDisplay = ({ className, onExpand }: CompactWeatherDisplayProps) => {
  // Fetch weather data from Open-Meteo API
  const { data: weather, isLoading, error } = useQuery({
    queryKey: ['weather'],
    queryFn: fetchWeatherData,
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });

  return (
    <button 
      className={cn("flex items-center gap-1 text-primary cursor-pointer hover:opacity-80", className)}
      onClick={onExpand}
      aria-label="Show weather details"
    >
      {isLoading ? (
        <CloudSun size={18} className="animate-pulse" />
      ) : error ? (
        <CloudSun size={18} />
      ) : weather ? (
        <span className="flex items-center gap-1">
          <span className="text-primary">
            {weather.current?.condition.icon && (
              <span className="inline-flex items-center">
                {getWeatherIcon(weather.current.condition.icon, 18)}
              </span>
            )}
          </span>
          <span className="text-sm font-medium">{Math.round(weather.current.temp_c)}°C</span>
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <CloudSun size={18} />
          <span className="text-sm">--°C</span>
        </span>
      )}
    </button>
  );
};

export default CompactWeatherDisplay;
