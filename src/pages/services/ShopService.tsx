
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import ProductsGrid from '@/components/shop/ProductsGrid';
import { useShopCart } from '@/hooks/useShopCart';
import MainHeader from '@/components/MainHeader';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';
import { useTranslation } from 'react-i18next';

const ShopService = () => {
  const navigate = useNavigate();
  const { addToCart } = useShopCart();
  const { t } = useTranslation();

  return (
    <div className="bg-darcare-navy min-h-screen pb-24 pt-16">
      <MainHeader 
        title={t('services.shop')} 
        onBack={() => navigate('/services')}
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
          onClick={() => navigate('/services/cart')}
        >
          <ShoppingCart size={20} />
        </Button>
      </MainHeader>
      <div className="p-4">
        <h2 className="text-darcare-gold font-serif text-2xl mb-4">{t('services.luxuryOfferings')}</h2>
        <ProductsGrid onAddToCart={addToCart} />
      </div>
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default ShopService;
