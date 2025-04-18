
import React from "react";

interface StatusBadgeProps {
  status: "pending" | "active" | "completed";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusMap = {
    pending: {
      label: "Pending",
      className: "status-badge-pending",
    },
    active: {
      label: "Active",
      className: "status-badge-active",
    },
    completed: {
      label: "Completed",
      className: "status-badge-completed",
    },
  };

  const { label, className } = statusMap[status];

  return <span className={`status-badge ${className}`}>{label}</span>;
};

export default StatusBadge;
