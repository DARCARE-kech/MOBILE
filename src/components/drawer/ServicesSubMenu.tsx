
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface ServicesSubMenuProps {
  onClose?: () => void;
  expanded?: boolean; // Added the expanded prop
}

const ServicesSubMenu: React.FC<ServicesSubMenuProps> = ({ onClose, expanded = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // If not expanded, don't render the menu
  if (!expanded) {
    return null;
  }

  const handleClick = (activeTab: string) => {
    navigate('/services', { state: { activeTab } });
    if (onClose) onClose();
  };

  const menuItemClass = 
    "flex items-center w-full justify-between p-2 rounded-md transition-colors";

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground mb-3">
        {t('drawer.services')}
      </div>

      <button 
        className={cn(menuItemClass, "hover:bg-muted")} 
        onClick={() => handleClick('services')}
      >
        <span className="text-left">{t('services.services', 'Services')}</span>
        <ChevronRight size={16} />
      </button>
      
      <button 
        className={cn(menuItemClass, "hover:bg-muted")} 
        onClick={() => handleClick('external')}
      >
        <span className="text-left">{t('services.external', 'External')}</span>
        <ChevronRight size={16} />
      </button>
      
      <button 
        className={cn(menuItemClass, "hover:bg-muted")} 
        onClick={() => handleClick('requests')}
      >
        <span className="text-left">{t('services.requests', 'Requests')}</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default ServicesSubMenu;
