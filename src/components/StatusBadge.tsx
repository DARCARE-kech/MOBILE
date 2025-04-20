
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

// Expand the type definition to include all possible status values
interface StatusBadgeProps {
  status: "pending" | "active" | "completed" | "cancelled" | string | null;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation();
  
  // Normalize the status to lowercase to handle case inconsistencies, and handle null
  const normalizedStatus = (status || "pending").toLowerCase();
  
  const statusMap = {
    pending: {
      className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    },
    active: {
      className: "bg-green-500/20 text-green-300 border-green-500/30",
    },
    in_progress: {
      className: "bg-green-500/20 text-green-300 border-green-500/30",
    },
    completed: {
      className: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    },
    cancelled: {
      className: "bg-red-500/20 text-red-300 border-red-500/30",
    },
    // Add any other known status types here
  };

  // Get the translated label
  const getLabel = () => {
    if (normalizedStatus === 'in_progress') {
      return t('services.status.in_progress');
    }
    return t(`services.status.${normalizedStatus}`);
  };

  // Fallback for unexpected status values
  const className = statusMap[normalizedStatus]?.className || "bg-gray-500/20 text-gray-300 border-gray-500/30";

  return (
    <Badge 
      className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      {getLabel()}
    </Badge>
  );
};

export default StatusBadge;
