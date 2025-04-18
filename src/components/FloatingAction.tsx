
import React, { useState } from "react";
import { Plus, Coffee, Calendar, MessageSquare, X } from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

const FloatingAction: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: "service",
      label: "Request Service",
      icon: <Coffee size={20} />,
      action: () => console.log("Service requested"),
    },
    {
      id: "booking",
      label: "Book Space",
      icon: <Calendar size={20} />,
      action: () => console.log("Booking started"),
    },
    {
      id: "chat",
      label: "Ask Chatbot",
      icon: <MessageSquare size={20} />,
      action: () => console.log("Chat opened"),
    },
  ];

  return (
    <div className="fixed right-6 bottom-24">
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3">
          {quickActions.map((action) => (
            <div
              key={action.id}
              className="flex items-center gap-3 transition-all animate-slide-up"
              style={{ transformOrigin: "bottom right" }}
            >
              <div className="bg-darcare-navy border border-darcare-gold/30 text-darcare-white rounded-full py-1 px-3 text-sm">
                {action.label}
              </div>
              <button
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
                className="w-12 h-12 rounded-full bg-darcare-gold text-darcare-navy flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
              >
                {action.icon}
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-darcare-gold text-darcare-navy flex items-center justify-center shadow-lg hover:opacity-90 transition-all"
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  );
};

export default FloatingAction;
