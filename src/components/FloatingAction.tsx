
import React, { useState } from "react";
import { Plus, DoorOpen, Wrench, MessageCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

const FloatingAction: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const openWhatsApp = () => {
    const phoneNumber = "212612345678"; // Replace with actual admin WhatsApp number
    const message = "Hello, I need assistance with my stay at the condominium.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const quickActions: QuickAction[] = [
    {
      id: "space",
      label: t('navigation.bookSpace'),
      icon: <DoorOpen size={20} />,
      action: () => navigate("/services/spaces"),
    },
    {
      id: "service",
      label: t('navigation.requestService'),
      icon: <Wrench size={20} />,
      action: () => navigate("/services"),
    },
    {
      id: "whatsapp",
      label: t('navigation.chatWithUs'),
      icon: <MessageCircle size={20} />,
      action: openWhatsApp,
    },
  ];

  return (
    <div className="fixed right-6 bottom-24 z-40">
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3">
          {quickActions.map((action) => (
            <div
              key={action.id}
              className="flex items-center gap-3 transition-all animate-fade-in"
              style={{ transformOrigin: "bottom right" }}
            >
              <div className="bg-darcare-navy border border-darcare-gold/30 text-darcare-white rounded-full py-1 px-3 text-sm shadow-lg">
                {action.label}
              </div>
              <button
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
                className="w-12 h-12 rounded-full bg-darcare-gold text-darcare-navy flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity hover:scale-105"
              >
                {action.icon}
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-darcare-gold text-darcare-navy flex items-center justify-center shadow-lg hover:opacity-90 transition-all hover:scale-105"
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  );
};

export default FloatingAction;
