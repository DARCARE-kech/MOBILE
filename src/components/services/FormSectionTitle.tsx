
import React from 'react';

interface FormSectionTitleProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

const FormSectionTitle: React.FC<FormSectionTitleProps> = ({ title, icon, subtitle }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        {icon && <div className="text-darcare-gold">{icon}</div>}
        <h3 className="text-darcare-white font-medium">{title}</h3>
      </div>
      {subtitle && (
        <p className="text-darcare-beige/70 text-sm ml-[28px]">{subtitle}</p>
      )}
    </div>
  );
};

export default FormSectionTitle;
