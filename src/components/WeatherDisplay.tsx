
import { useEffect, useState } from "react";
import { CloudSun, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface WeatherData {
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        avgtemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
    }>;
  };
}

interface WeatherDisplayProps {
  expanded?: boolean;
}

const WeatherDisplay = ({ expanded = false }: WeatherDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  // Reset expansion state when prop changes
  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  const { data: weather, isLoading, error } = useQuery({
    queryKey: ['weather'],
    queryFn: async (): Promise<WeatherData> => {
      // Since we can't actually make API calls in this demo, we'll return mock data
      return {
        current: {
          temp_c: 24,
          condition: {
            text: "Sunny",
            icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
          }
        },
        forecast: {
          forecastday: [
            {
              date: "2025-04-29",
              day: {
                avgtemp_c: 24,
                condition: {
                  text: "Sunny",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
                }
              }
            },
            {
              date: "2025-04-30",
              day: {
                avgtemp_c: 26,
                condition: {
                  text: "Partly cloudy",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
                }
              }
            },
            {
              date: "2025-05-01",
              day: {
                avgtemp_c: 27,
                condition: {
                  text: "Sunny",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
                }
              }
            }
          ]
        }
      };
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  if (isLoading || error || !weather) {
    return (
      <div className="flex items-center gap-1 text-darcare-beige">
        <CloudSun size={18} className="text-darcare-gold" />
        <span className="text-sm">--°C</span>
      </div>
    );
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="relative">
      <div 
        className="flex items-center gap-1 text-darcare-beige cursor-pointer"
        onClick={toggleExpanded}
      >
        {weather.current.condition.icon ? (
          <img 
            src={`https:${weather.current.condition.icon}`} 
            alt={weather.current.condition.text}
            width={22}
            height={22}
            className="mr-1"
          />
        ) : (
          <CloudSun size={18} className="text-darcare-gold mr-1" />
        )}
        <span className="text-sm">{Math.round(weather.current.temp_c)}°C</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 h-auto w-auto text-darcare-beige hover:bg-transparent hover:text-darcare-gold"
          onClick={toggleExpanded}
        >
          {isExpanded ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 p-3 w-48 bg-darcare-navy border border-darcare-gold/20 rounded-md shadow-lg z-50">
          <div className="text-xs text-darcare-beige/70 mb-2">Marrakech Forecast</div>
          <div className="space-y-2">
            {weather.forecast.forecastday.map((day, i) => (
              <div key={day.date} className="flex items-center justify-between">
                <span className="text-darcare-beige text-sm">
                  {i === 0 ? "Today" : formatDate(day.date)}
                </span>
                <div className="flex items-center gap-1">
                  {day.day.condition.icon && (
                    <img 
                      src={`https:${day.day.condition.icon}`} 
                      alt={day.day.condition.text}
                      width={20}
                      height={20}
                    />
                  )}
                  <span className="text-darcare-beige/90 text-sm">
                    {Math.round(day.day.avgtemp_c)}°C
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDisplay;
