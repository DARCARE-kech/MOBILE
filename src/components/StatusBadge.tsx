
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

// Expand the type definition to include all possible status values
interface StatusBadgeProps {
  status: "pending" | "active" | "completed" | "cancelled" | "in_progress" | string | null;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  // Normalize the status to lowercase to handle case inconsistencies, and handle null
  const normalizedStatus = (status || "pending").toLowerCase();
  
  const getStatusClass = () => {
    switch (normalizedStatus) {
      case 'pending':
        return isDarkMode
          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
          : "bg-[#FDF1C0] text-darcare-deepGold border-[#F6D87E]";
      case 'active':
      case 'in_progress':
        return isDarkMode
          ? "bg-green-500/20 text-green-300 border-green-500/30"
          : "bg-[#D6F5D2] text-[#147B3E] border-[#AEEAA5]";
      case 'completed':
        return isDarkMode
          ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
          : "bg-blue-50 text-blue-600 border-blue-200";
      case 'cancelled':
        return isDarkMode
          ? "bg-red-500/20 text-red-300 border-red-500/30"
          : "bg-red-50 text-red-600 border-red-200";
      default:
        return isDarkMode
          ? "bg-gray-500/20 text-gray-300 border-gray-500/30"
          : "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  // Get the translated label based on the normalized status
  const getLabel = () => {
    return t(`services.status.${normalizedStatus.replace('_', '_')}`);
  };

  return (
    <Badge 
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium border",
        getStatusClass()
      )}
    >
      {getLabel()}
    </Badge>
  );
};

export default StatusBadge;
