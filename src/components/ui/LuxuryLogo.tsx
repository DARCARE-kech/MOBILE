
import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
  className?: string;
}

const LuxuryLogo: React.FC<LogoProps> = ({ 
  size = "md", 
  withText = true,
  className
}) => {
  const sizeClass = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        sizeClass[size],
        "flex items-center justify-center rounded-full bg-gradient-to-br from-darcare-gold to-darcare-gold/80 shadow-lg shadow-darcare-gold/20"
      )}>
        <span className="font-serif text-2xl font-bold text-darcare-navy">T</span>
      </div>
      {withText && (
        <div className={cn(
          "font-serif font-medium",
          size === "sm" ? "text-xl" : "text-2xl",
          "text-darcare-gold"
        )}>
          The View
        </div>
      )}
    </div>
  );
};

export default LuxuryLogo;
