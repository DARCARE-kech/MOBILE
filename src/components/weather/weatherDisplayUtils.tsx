
import React from "react";
import { Sun, CloudSun, Cloud, CloudDrizzle, CloudRain, CloudSnow, CloudLightning } from "lucide-react";

// Mapping of icon names to Lucide component
const iconComponents = {
  "sun": Sun,
  "cloud-sun": CloudSun,
  "cloud": Cloud,
  "cloud-drizzle": CloudDrizzle,
  "cloud-rain": CloudRain,
  "cloud-snow": CloudSnow,
  "cloud-lightning": CloudLightning
};

/**
 * Helper to get the right icon component for weather condition
 */
export const getWeatherIcon = (iconName: string, size: number = 24) => {
  const IconComponent = iconComponents[iconName as keyof typeof iconComponents] || CloudSun;
  return <IconComponent size={size} />;
};
