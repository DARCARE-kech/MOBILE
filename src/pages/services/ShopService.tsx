
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import ServiceHeader from '@/components/services/ServiceHeader';
import IconButton from '@/components/services/IconButton';
import ProductsGrid from '@/components/shop/ProductsGrid';
import { useShopCart } from '@/hooks/useShopCart';

const ShopService = () => {
  const navigate = useNavigate();
  const { addToCart } = useShopCart();

  return (
    <div className="bg-darcare-navy min-h-screen pb-20">
      <ServiceHeader 
        title="Shop" 
        showBackButton={true}
        rightComponent={
          <IconButton
            icon={<ShoppingCart className="w-5 h-5" />}
            variant="ghost"
            size="sm"
            onClick={() => navigate('/services/shop/cart')}
          />
        }
      />
      
      <div className="p-4">
        <h2 className="text-darcare-gold font-serif text-2xl mb-4">Luxury Offerings</h2>
        <ProductsGrid onAddToCart={addToCart} />
      </div>
    </div>
  );
};

export default ShopService;
