
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface FormSectionTitleProps {
  title: string;
  icon?: React.ReactNode;
  rawKeys?: boolean;
  className?: string; // Added className prop
  subtitle?: string; // Added subtitle prop
}

const FormSectionTitle: React.FC<FormSectionTitleProps> = ({ 
  title, 
  icon, 
  rawKeys = false, // Default to false to ensure translations are used
  className,
  subtitle
}) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  
  // If rawKeys is false, attempt to translate the title
  const displayTitle = rawKeys ? title : t(title, title);
  
  return (
    <div className={cn("flex flex-col", className)}>
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
      {subtitle && (
        <p className="text-sm text-darcare-beige/70 mt-1">
          {rawKeys ? subtitle : t(subtitle, subtitle)}
        </p>
      )}
    </div>
  );
};

export default FormSectionTitle;
