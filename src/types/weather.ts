
export type WeatherCondition = 
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "light-rain"
  | "rain"
  | "snow"
  | "thunderstorm";

export interface WeatherData {
  current: {
    temp_c: number;
    condition: {
      text: WeatherCondition;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
    uv: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        avgtemp_c: number;
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: WeatherCondition;
          icon: string;
        };
        uv: number;
        totalPrecipitation: number;
      };
    }>;
  };
}
