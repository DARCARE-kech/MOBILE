
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface FormSectionTitleProps {
  title: string;
  icon?: React.ReactNode;
  rawKeys?: boolean;
}

const FormSectionTitle: React.FC<FormSectionTitleProps> = ({ 
  title, 
  icon, 
  rawKeys = false // Default to false to ensure translations are used
}) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  
  // If rawKeys is false, attempt to translate the title
  const displayTitle = rawKeys ? title : t(title, title);
  
  return (
    <div className="flex items-center gap-2">
      {icon && (
        <span className={cn(
          "text-darcare-gold",
          isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
        )}>
          {icon}
        </span>
      )}
      <h3 className={cn(
        "text-lg font-serif",
        isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
      )}>
        {displayTitle}
      </h3>
    </div>
  );
};

export default FormSectionTitle;
