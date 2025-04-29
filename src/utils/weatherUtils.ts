
import { WeatherData, WeatherCondition } from "@/types/weather";

// Marrakech coordinates
const MARRAKECH_LAT = 31.6295;
const MARRAKECH_LON = -7.9811;

// Weather condition mapping based on WMO weather codes
// https://open-meteo.com/en/docs
export const weatherCodeToCondition = (code: number): WeatherCondition => {
  // Clear
  if (code === 0) return "clear";
  
  // Mainly clear, partly cloudy
  if (code >= 1 && code <= 2) return "partly-cloudy";
  
  // Overcast
  if (code === 3) return "cloudy";
  
  // Fog, depositing rime fog
  if (code >= 45 && code <= 48) return "fog";
  
  // Drizzle: light, moderate, dense, freezing
  if (code >= 51 && code <= 57) return "light-rain";
  
  // Rain: slight, moderate, heavy, freezing
  if (code >= 61 && code <= 67) return "rain";
  
  // Snow: slight, moderate, heavy
  if (code >= 71 && code <= 77) return "snow";
  
  // Rain showers: slight, moderate, violent
  if (code >= 80 && code <= 82) return "rain";
  
  // Snow showers: slight, heavy
  if (code >= 85 && code <= 86) return "snow";
  
  // Thunderstorm: slight, moderate, with hail
  if (code >= 95 && code <= 99) return "thunderstorm";
  
  return "clear"; // Default fallback
};

export const getUVIndexLabel = (uvIndex: number): string => {
  if (uvIndex <= 2) return "Low";
  if (uvIndex <= 5) return "Moderate";
  if (uvIndex <= 7) return "High";
  if (uvIndex <= 10) return "Very High";
  return "Extreme";
};

export const getWeatherConditionIcon = (condition: WeatherCondition) => {
  switch (condition) {
    case "clear":
      return "sun";
    case "partly-cloudy":
      return "cloud-sun";
    case "cloudy":
      return "cloud";
    case "fog":
      return "cloud";
    case "light-rain":
      return "cloud-drizzle";
    case "rain":
      return "cloud-rain";
    case "snow":
      return "cloud-snow";
    case "thunderstorm":
      return "cloud-lightning";
    default:
      return "sun";
  }
};

export const fetchWeatherData = async (): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${MARRAKECH_LAT}&longitude=${MARRAKECH_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_sum&timezone=auto&forecast_days=3`
    );
    
    if (!response.ok) {
      throw new Error('Weather API response not ok');
    }
    
    const data = await response.json();
    
    // Process and format the data
    const processedData: WeatherData = {
      current: {
        temp_c: data.current.temperature_2m,
        condition: {
          text: weatherCodeToCondition(data.current.weather_code),
          icon: getWeatherConditionIcon(weatherCodeToCondition(data.current.weather_code))
        },
        humidity: data.current.relative_humidity_2m,
        wind_kph: data.current.wind_speed_10m,
        uv: data.daily.uv_index_max[0]
      },
      forecast: {
        forecastday: data.daily.time.map((date: string, index: number) => ({
          date,
          day: {
            avgtemp_c: (data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2,
            maxtemp_c: data.daily.temperature_2m_max[index],
            mintemp_c: data.daily.temperature_2m_min[index],
            condition: {
              text: weatherCodeToCondition(data.daily.weather_code[index]),
              icon: getWeatherConditionIcon(weatherCodeToCondition(data.daily.weather_code[index]))
            },
            uv: data.daily.uv_index_max[index],
            totalPrecipitation: data.daily.precipitation_sum[index]
          }
        }))
      }
    };
    
    return processedData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
