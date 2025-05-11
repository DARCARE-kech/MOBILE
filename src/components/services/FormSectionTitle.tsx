
import React from 'react';
import { cn } from '@/lib/utils';
import { formatFieldKey } from '@/utils/formattingUtils';
import { useTranslation } from 'react-i18next';

interface FormSectionTitleProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
  rawKeys?: boolean; // Set to true only when title is already formatted or is a translation key
}

const FormSectionTitle: React.FC<FormSectionTitleProps> = ({ 
  title, 
  icon, 
  subtitle,
  className,
  rawKeys = false
}) => {
  const { t } = useTranslation();
  
  // For translation keys, we try to translate them first
  // If rawKeys is true, we assume the title is already a human-readable string or direct translation key
  const displayTitle = rawKeys ? title : formatFieldKey(title);
  const displaySubtitle = subtitle ? (rawKeys ? subtitle : formatFieldKey(subtitle)) : undefined;
  
  return (
    <div className={cn("mb-4", className)}>
      <div className="flex items-center gap-2 mb-1">
        {icon && <div className="text-darcare-gold">{icon}</div>}
        <h3 className="text-darcare-gold font-serif text-lg">{displayTitle}</h3>
      </div>
      
    </div>
  );
};

export default FormSectionTitle;
