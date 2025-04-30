
import React from 'react';
import { cn } from '@/lib/utils';

interface FormSectionTitleProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

const FormSectionTitle: React.FC<FormSectionTitleProps> = ({ 
  title, 
  icon, 
  subtitle,
  className
}) => {
  return (
    <div className={cn("mb-4", className)}>
      <div className="flex items-center gap-2 mb-1">
        {icon && <div className="text-darcare-gold">{icon}</div>}
        <h3 className="text-darcare-gold font-serif text-lg">{title}</h3>
      </div>
      {subtitle && (
        <p className="text-darcare-beige/70 text-sm">{subtitle}</p>
      )}
    </div>
  );
};

export default FormSectionTitle;
