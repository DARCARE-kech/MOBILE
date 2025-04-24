
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

interface LoadingStateProps {
  onBack: () => void;
}

const LoadingState = ({ onBack }: LoadingStateProps) => {
  return (
    <div className="bg-darcare-navy min-h-screen">
      <div className="flex items-center justify-between p-4 bg-darcare-navy border-b border-darcare-gold/20">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-darcare-gold/10"
        >
          <ArrowLeft className="text-darcare-gold w-5 h-5" />
        </button>
        <h1 className="text-darcare-gold font-serif text-xl mx-auto">
          Book a Space
        </h1>
        <div className="w-10" />
      </div>
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin w-8 h-8 border-4 border-darcare-gold border-t-transparent rounded-full" />
      </div>
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default LoadingState;
