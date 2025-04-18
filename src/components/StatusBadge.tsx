
import React from "react";
import { Badge } from "@/components/ui/badge";

// Expand the type definition to include all possible status values
interface StatusBadgeProps {
  status: "pending" | "active" | "completed" | "cancelled" | string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Normalize the status to lowercase to handle case inconsistencies
  const normalizedStatus = status?.toLowerCase() || "pending";
  
  const statusMap = {
    pending: {
      label: "Pending",
      className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    },
    active: {
      label: "Active",
      className: "bg-green-500/20 text-green-300 border-green-500/30",
    },
    completed: {
      label: "Completed",
      className: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-red-500/20 text-red-300 border-red-500/30",
    },
    // Add any other known status types here
  };

  // Fallback for unexpected status values
  const { label, className } = statusMap[normalizedStatus] || {
    label: normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1),
    className: "bg-gray-500/20 text-gray-300 border-gray-500/30"
  };

  return (
    <Badge 
      className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </Badge>
  );
};

export default StatusBadge;
