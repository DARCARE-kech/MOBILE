
import React from 'react';
import { Users } from 'lucide-react';
import FormSectionTitle from '@/components/services/FormSectionTitle';

interface PeopleCounterProps {
  count: number;
  maxCapacity?: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const PeopleCounter: React.FC<PeopleCounterProps> = ({
  count,
  maxCapacity,
  onIncrement,
  onDecrement
}) => {
  return (
    <div>
      <FormSectionTitle title="Number of People" icon={<Users className="w-5 h-5" />} />
      
      <div className="flex items-center justify-between bg-darcare-navy/60 border border-darcare-gold/20 rounded-md p-2">
        <button
          type="button"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-darcare-navy border border-darcare-gold/30 text-darcare-gold"
          onClick={onDecrement}
        >
          -
        </button>
        
        <div className="text-darcare-beige text-lg font-medium">
          {count} {count === 1 ? 'Person' : 'People'}
        </div>
        
        <button
          type="button"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-darcare-navy border border-darcare-gold/30 text-darcare-gold"
          onClick={onIncrement}
        >
          +
        </button>
      </div>
      
      {maxCapacity && count > maxCapacity && (
        <p className="text-red-400 text-sm mt-2">
          This exceeds the maximum capacity of {maxCapacity} people.
        </p>
      )}
    </div>
  );
};
