
import React, { useState } from "react";
import { Plus, DoorOpen, Wrench, MessageCircle, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

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
      id: "whatsapp",
      label: t('navigation.chatWithUs'),
      icon: <MessageCircle size={16} />,
      action: openWhatsApp,
    },
    {
      id: "contact-admin",
      label: t('navigation.contactAdmin', 'Contact Admin'),
      icon: <User size={16} />,
      action: () => navigate("/contact-admin"),
    },
  ];

  return (
    <div className="fixed right-4 bottom-28 z-40">
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-12 right-0 flex flex-col items-end space-y-2">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ 
                  duration: 0.2,
                  delay: index * 0.05
                }}
                className="flex items-center gap-2 transition-all"
              >
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-darcare-navy border border-darcare-gold/30 text-darcare-white rounded-full py-1 px-2 text-xs shadow-lg whitespace-nowrap"
                >
                  {action.label}
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    action.action();
                    setIsOpen(false);
                  }}
                  className="w-9 h-9 rounded-full bg-darcare-gold text-darcare-navy flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
                >
                  {action.icon}
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-darcare-gold text-darcare-navy flex items-center justify-center shadow-lg hover:opacity-90 transition-all"
      >
        {isOpen ? <X size={16} /> : <Plus size={16} />}
      </motion.button>
    </div>
  );
};

export default FloatingAction;
