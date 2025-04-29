
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import AppHeader from '@/components/AppHeader';

interface HeaderProps {
  title: string;
  onBack: () => void;
}

const Header = ({ title, onBack }: HeaderProps) => {
  return (
    <AppHeader title={title}>
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-darcare-gold/10"
        aria-label="Back"
      >
        <ArrowLeft className="text-darcare-gold w-5 h-5" />
      </button>
    </AppHeader>
  );
};

export default Header;
