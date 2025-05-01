
import { X, ChevronLeft, ChevronRight, Wind, Droplets, Sun, CloudSun } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/contexts/ThemeContext";
import { fetchWeatherData } from "@/utils/weatherUtils";
import { LuxuryCard } from "../ui/luxury-card";
import { getUVIndexLabel } from "@/utils/weatherUtils";
import { useState } from "react";
import { getWeatherIcon } from "./weatherDisplayUtils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

interface ExpandedWeatherDisplayProps {
  onClose: () => void;
  className?: string;
}

const ExpandedWeatherDisplay = ({ onClose, className }: ExpandedWeatherDisplayProps) => {
  const [currentForecastIndex, setCurrentForecastIndex] = useState(0);
  const { isDarkMode } = useTheme();
  
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

  return (
    <div className="relative">
      <LuxuryCard className={cn(
        "w-80 p-0 shadow-lg absolute right-0 top-full mt-2 z-50",
        isDarkMode ? "border-darcare-gold/30" : "border-darcare-deepGold/30",
        className
      )}>
        {/* Card header */}
        <div className="p-4 border-b border-primary/10 flex items-center justify-between">
          <h3 className="text-base font-serif text-primary">Weather Marrakech</h3>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-6 w-6 p-0 rounded-full hover:bg-primary/10"
            onClick={onClose}
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
                  <div className="flex items-center justify-center mb-2">
                    {getWeatherIcon(weather.forecast.forecastday[currentForecastIndex].day.condition.icon, 48)}
                  </div>
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

            {/* Weekly forecast carousel */}
            <div className="border-t border-primary/10 pt-3 pb-6 px-4">
              <h4 className="text-xs font-medium text-primary/70 mb-3">Weekly Forecast</h4>
              <Carousel 
                opts={{
                  align: "start",
                  loop: false,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2">
                  {weather.forecast.forecastday.map((day, index) => (
                    <CarouselItem key={day.date} className="pl-2 basis-1/3 min-w-[5rem]">
                      <Card className={cn(
                        "border-0 bg-transparent",
                        index === currentForecastIndex ? "ring-1 ring-primary/20" : ""
                      )}>
                        <CardContent className="flex flex-col items-center justify-center p-2">
                          <div className="text-xs text-primary/70 mb-1">
                            {index === 0 ? "Today" : formatDate(day.date).split(',')[0]}
                          </div>
                          <div className="mb-1">
                            {getWeatherIcon(day.day.condition.icon, 24)}
                          </div>
                          <div className="text-sm font-medium text-primary">
                            {Math.round(day.day.maxtemp_c)}°
                          </div>
                          <div className="text-xs text-primary/50">
                            {Math.round(day.day.mintemp_c)}°
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-2">
                  <CarouselPrevious className="relative inset-auto h-6 w-6 p-0 mr-1" />
                  <CarouselNext className="relative inset-auto h-6 w-6 p-0 ml-1" />
                </div>
              </Carousel>
            </div>

            {/* Precipitation chance for today */}
            {currentForecastIndex === 0 && (
              <div className="border-t border-primary/10 p-4">
                <div className="text-xs font-medium text-primary/70 mb-2">Precipitation</div>
                <div className="flex items-center">
                  <div className="h-2 flex-1 bg-primary/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ 
                        width: `${weather.forecast.forecastday[0].day.totalPrecipitation * 10}%`,
                        maxWidth: '100%' 
                      }} 
                    />
                  </div>
                  <span className="ml-2 text-xs text-primary/70">
                    {weather.forecast.forecastday[0].day.totalPrecipitation} mm
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </LuxuryCard>
    </div>
  );
};

export default ExpandedWeatherDisplay;
