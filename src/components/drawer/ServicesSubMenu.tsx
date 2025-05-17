
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface ServicesSubMenuProps {
  onClose?: () => void;
}

const ServicesSubMenu: React.FC<ServicesSubMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        onClick={() => handleClick('invilla')}
      >
        <span className="text-left">{t('services.invilla')}</span>
        <ChevronRight size={16} />
      </button>
      
      <button 
        className={cn(menuItemClass, "hover:bg-muted")} 
        onClick={() => handleClick('leisure')}
      >
        <span className="text-left">{t('services.leisure')}</span>
        <ChevronRight size={16} />
      </button>
      
      <button 
        className={cn(menuItemClass, "hover:bg-muted")} 
        onClick={() => handleClick('requests')}
      >
        <span className="text-left">{t('services.requests')}</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default ServicesSubMenu;
