
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  onBack: () => void;
}

const Header = ({ title, onBack }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-darcare-navy border-b border-darcare-gold/20">
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-darcare-gold/10"
        aria-label="Back"
      >
        <ArrowLeft className="text-darcare-gold w-5 h-5" />
      </button>
      <h1 className="text-darcare-gold font-serif text-xl mx-auto">
        {title}
      </h1>
      <div className="w-10" />
    </div>
  );
};

export default Header;
