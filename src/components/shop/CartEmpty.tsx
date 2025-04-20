
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CartEmptyProps {
  onContinueShopping: () => void;
}

const CartEmpty = ({ onContinueShopping }: CartEmptyProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center text-darcare-beige mt-8">
      <div className="flex justify-center mb-4">
        <ShoppingCart size={48} className="text-darcare-gold/40" />
      </div>
      <p className="mb-2">{t('shop.cartEmpty')}</p>
      <p className="text-sm text-darcare-beige/60 mb-6">{t('shop.browseItems')}</p>
      <Button 
        className="bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
        onClick={onContinueShopping}
      >
        {t('shop.continueShopping')}
      </Button>
    </div>
  );
};

export default CartEmpty;
