
import { CloudSun } from "lucide-react";

const WeatherDisplay = () => {
  return (
    <div className="flex items-center gap-1 text-darcare-beige">
      <CloudSun size={18} className="text-darcare-gold" />
      <span className="text-sm">24°C</span>
    </div>
  );
};

export default WeatherDisplay;
