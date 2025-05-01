
import React, { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface PreferenceItemProps {
  icon: ReactNode;
  label: string;
  control: ReactNode;
}

export const PreferenceItem: React.FC<PreferenceItemProps> = ({ 
  icon, 
  label, 
  control 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <Label className="text-foreground">{label}</Label>
      </div>
      {control}
    </div>
  );
};
