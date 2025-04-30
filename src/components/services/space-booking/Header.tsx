
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppHeader from '@/components/AppHeader';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <AppHeader 
      title={title} 
      onBack={() => navigate('/services/spaces')}
      rightContent={<div />} // Empty div to prevent default icons
    />
  );
};

export default Header;
