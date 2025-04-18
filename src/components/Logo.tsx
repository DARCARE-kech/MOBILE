
import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  color?: "gold" | "white";
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  size = "md", 
  color = "gold",
  withText = true 
}) => {
  const sizeClass = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const colorClass = {
    gold: "text-darcare-gold",
    white: "text-darcare-white",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClass[size]} ${colorClass[color]} flex items-center justify-center border-2 border-current rounded-full`}>
        <span className="font-serif text-2xl font-bold">D</span>
      </div>
      {withText && (
        <div className={`text-${size === "sm" ? "xl" : "2xl"} font-serif font-medium ${colorClass[color]}`}>
          DarCare
        </div>
      )}
    </div>
  );
};

export default Logo;
