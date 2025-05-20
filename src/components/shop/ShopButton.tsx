
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const ShopButton: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  
  // Only show the button on specific routes
  const allowedPaths = ['/', '/services', '/explore'];
  const currentPath = location.pathname;
  
  // Check if current path is in the allowed paths list or starts with one of them
  const shouldShow = allowedPaths.some(path => 
    currentPath === path || 
    (path !== '/' && currentPath.startsWith(path + '/'))
  );
  
  if (!shouldShow) return null;

  return (
    <div className="fixed right-6 bottom-40 z-40">
      <Popover>
        <PopoverTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/services/shop")}
            className="w-10 h-10 rounded-full bg-darcare-gold text-darcare-navy flex items-center justify-center shadow-lg hover:opacity-90 transition-all"
          >
            <ShoppingBag size={18} />
          </motion.button>
        </PopoverTrigger>
        <PopoverContent 
          side="left" 
          className="py-1 px-3 text-sm bg-darcare-navy border border-darcare-gold/30 text-darcare-beige rounded-full shadow-lg"
        >
          {t('shop.title', 'Luxury Shop')}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ShopButton;
