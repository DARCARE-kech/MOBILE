
import React from 'react';

interface FormSectionTitleProps {
  title: string;
  icon?: React.ReactNode;
}

const FormSectionTitle: React.FC<FormSectionTitleProps> = ({ title, icon }) => {
  return (
    <div className="flex items-center gap-2 mb-3">
      {icon && <div className="text-darcare-gold">{icon}</div>}
      <h3 className="text-darcare-white font-medium">{title}</h3>
    </div>
  );
};

export default FormSectionTitle;
