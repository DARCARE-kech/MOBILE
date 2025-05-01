
import React from 'react';
import { Lock } from 'lucide-react';

export const PasswordHeader = () => {
  return (
    <div className="flex justify-center mb-8">
      <div className="w-16 h-16 rounded-full bg-darcare-gold/10 flex items-center justify-center shadow-inner">
        <Lock className="h-8 w-8 text-darcare-gold" />
      </div>
    </div>
  );
};
