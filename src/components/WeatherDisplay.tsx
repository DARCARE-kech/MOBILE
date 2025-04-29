
import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, CloudSun, Wind, Droplets, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/contexts/ThemeContext";
import { fetchWeatherData } from "@/utils/weatherUtils";
import { WeatherData } from "@/types/weather";
import { LuxuryCard } from "./ui/luxury-card";
import { getUVIndexLabel, getWeatherConditionIcon } from "@/utils/weatherUtils";

interface WeatherDisplayProps {
  expanded?: boolean;
  className?: string;
}

const WeatherDisplay = ({ expanded = false, className }: WeatherDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [currentForecastIndex, setCurrentForecastIndex] = useState(0);
  const { isDarkMode } = useTheme();
  
  // Reset expansion state when prop changes
  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  // Fetch weather data from Open-Meteo API
  const { data: weather, isLoading, error, isSuccess } = useQuery({
    queryKey: ['weather'],
    queryFn: fetchWeatherData,
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const handleNextDay = () => {
    if (weather && currentForecastIndex < weather.forecast.forecastday.length - 1) {
      setCurrentForecastIndex(prev => prev + 1);
    }
  };

  const handlePreviousDay = () => {
    if (currentForecastIndex > 0) {
      setCurrentForecastIndex(prev => prev - 1);
    }
  };

  // Compact display for header
  if (!isExpanded) {
    return (
      <button 
        className={cn("flex items-center gap-1 text-primary cursor-pointer hover:opacity-80", className)}
        onClick={() => setIsExpanded(true)}
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
                  {(() => {
                    const IconComponent = require("lucide-react")[weather.current.condition.icon] || CloudSun;
                    return <IconComponent size={18} />;
                  })()}
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
  }

  // Expanded view (detailed weather card)
  return (
    <div className="relative">
      <LuxuryCard className={cn(
        "w-72 p-0 shadow-lg absolute right-0 top-full mt-2 z-50",
        isDarkMode ? "border-darcare-gold/30" : "border-darcare-deepGold/30"
      )}>
        {/* Card header */}
        <div className="p-4 border-b border-primary/10 flex items-center justify-between">
          <h3 className="text-base font-serif text-primary">Météo Marrakech</h3>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-6 w-6 p-0 rounded-full hover:bg-primary/10"
            onClick={() => setIsExpanded(false)}
          >
            <X size={14} className="text-primary/70" />
          </Button>
        </div>
        
        {/* Date navigation */}
        <div className="flex items-center justify-between px-4 py-2 text-sm text-primary/70">
          <Button 
            variant="ghost" 
            size="sm"
            className={cn(
              "h-6 w-6 p-0 rounded-full",
              currentForecastIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-primary/10"
            )}
            onClick={handlePreviousDay}
            disabled={currentForecastIndex === 0}
          >
            <ChevronLeft size={16} />
          </Button>
          
          {isSuccess && weather?.forecast?.forecastday[currentForecastIndex] && (
            <span className="text-sm font-medium">
              {currentForecastIndex === 0 
                ? "Today" 
                : formatDate(weather.forecast.forecastday[currentForecastIndex].date)
              }
            </span>
          )}
          
          <Button 
            variant="ghost" 
            size="sm"
            className={cn(
              "h-6 w-6 p-0 rounded-full",
              isSuccess && currentForecastIndex >= weather.forecast.forecastday.length - 1 
                ? "opacity-30 cursor-not-allowed" 
                : "hover:bg-primary/10"
            )}
            onClick={handleNextDay}
            disabled={isSuccess && currentForecastIndex >= weather.forecast.forecastday.length - 1}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
        
        {isLoading ? (
          <div className="p-6 flex flex-col items-center justify-center">
            <CloudSun size={36} className="text-primary animate-pulse mb-2" />
            <p className="text-sm text-primary/70">Loading weather data...</p>
          </div>
        ) : error ? (
          <div className="p-6 flex flex-col items-center justify-center">
            <p className="text-sm text-primary/70">Unable to load weather data.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </div>
        ) : (
          <>
            {/* Temperature and icon */}
            <div className="pt-4 pb-2 flex flex-col items-center">
              {weather && weather.forecast.forecastday[currentForecastIndex] && (
                <>
                  <div className="text-3xl font-serif font-medium text-primary mb-1">
                    {Math.round(
                      currentForecastIndex === 0 
                        ? weather.current.temp_c 
                        : weather.forecast.forecastday[currentForecastIndex].day.avgtemp_c
                    )}°C
                  </div>
                  <div className="text-lg text-primary/70 mb-2 capitalize font-serif">
                    {weather.forecast.forecastday[currentForecastIndex].day.condition.text.replace('-', ' ')}
                  </div>
                  {currentForecastIndex > 0 && (
                    <div className="text-xs text-primary/50 flex gap-2">
                      <span>High: {Math.round(weather.forecast.forecastday[currentForecastIndex].day.maxtemp_c)}°C</span>
                      <span>Low: {Math.round(weather.forecast.forecastday[currentForecastIndex].day.mintemp_c)}°C</span>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Weather details */}
            <div className="grid grid-cols-3 gap-2 p-4 text-center border-t border-primary/10">
              <div className="flex flex-col items-center">
                <Droplets size={18} className="text-primary/70 mb-1" />
                <div className="text-xs text-primary/70">Humidity</div>
                <div className="text-sm font-medium text-primary">
                  {currentForecastIndex === 0 
                    ? `${Math.round(weather.current.humidity)}%`
                    : "N/A"
                  }
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <Wind size={18} className="text-primary/70 mb-1" />
                <div className="text-xs text-primary/70">Wind</div>
                <div className="text-sm font-medium text-primary">
                  {currentForecastIndex === 0
                    ? `${Math.round(weather.current.wind_kph)} km/h`
                    : "N/A"
                  }
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <Sun size={18} className="text-primary/70 mb-1" />
                <div className="text-xs text-primary/70">UV Index</div>
                <div className="text-sm font-medium text-primary">
                  {getUVIndexLabel(weather.forecast.forecastday[currentForecastIndex].day.uv)}
                </div>
              </div>
            </div>
          </>
        )}
      </LuxuryCard>
    </div>
  );
};

export default WeatherDisplay;
