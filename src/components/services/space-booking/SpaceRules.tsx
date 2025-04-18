
import React from 'react';
import { Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import FormSectionTitle from '@/components/services/FormSectionTitle';

interface SpaceRulesProps {
  rules?: string;
}

export const SpaceRules: React.FC<SpaceRulesProps> = ({ rules }) => {
  if (!rules) return null;

  return (
    <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
      <FormSectionTitle title="Rules & Guidelines" icon={<Info className="w-5 h-5" />} />
      <p className="text-darcare-beige whitespace-pre-line">
        {rules}
      </p>
    </Card>
  );
};
