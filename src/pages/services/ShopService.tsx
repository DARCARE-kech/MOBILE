
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  CircleDollarSign,
  ChevronRight,
  ChevronLeft,
  Trash2,
  CreditCard
} from 'lucide-react';

import ServiceHeader from '@/components/services/ServiceHeader';
import IconButton from '@/components/services/IconButton';
import { Card, CardContent } from '@/components/ui/card';
import { getShopProducts, type ShopProduct } from '@/integrations/supabase/rpc';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type CartItem = ShopProduct & { quantity: number };

const ShopService = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['shop-products'],
    queryFn: getShopProducts
  });
  
  const addToCart = (product: ShopProduct) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId: string, change: number) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };
  
  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  
  const getTotalCartPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const handleCheckout = () => {
    // In a real app, this would process the payment
    toast({
      title: "Order Placed",
      description: "Your order has been placed successfully",
    });
    
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
  };
  
  if (isLoading) {
    return (
      <div className="bg-darcare-navy min-h-screen">
        <ServiceHeader title="Shop" />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-spin w-8 h-8 border-4 border-darcare-gold border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-darcare-navy min-h-screen pb-20">
      <ServiceHeader title="Shop" />
      
      <div className="p-4">
        <h2 className="text-darcare-gold font-serif text-2xl mb-4">Luxury Offerings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products?.map((product) => (
            <Card 
              key={product.id} 
              className="bg-darcare-navy border border-darcare-gold/20 overflow-hidden"
            >
              <AspectRatio ratio={4/3}>
                <img 
                  src={product.image_url || '/placeholder.svg'} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="text-darcare-white text-lg font-semibold">
                    {product.name}
                  </h3>
                  <span className="text-darcare-gold font-medium">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-darcare-beige text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-end">
                  <IconButton
                    icon={<Plus className="w-4 h-4" />}
                    variant="primary"
                    size="sm"
                    onClick={() => addToCart(product)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Floating cart button */}
      {cart.length > 0 && (
        <div className="fixed bottom-20 right-4">
          <IconButton
            icon={<ShoppingBag className="w-5 h-5" />}
            variant="primary"
            size="lg"
            badge={getTotalCartItems()}
            onClick={() => setCartOpen(true)}
          />
        </div>
      )}
      
      {/* Cart Sheet */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="bg-darcare-navy border-l border-darcare-gold/20 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-darcare-gold font-serif">Your Cart</SheetTitle>
          </SheetHeader>
          
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-72">
              <ShoppingBag className="w-16 h-16 text-darcare-gold/30 mb-4" />
              <p className="text-darcare-beige text-center">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="mt-6 space-y-4">
                {cart.map((item) => (
                  <Card key={item.id} className="bg-darcare-navy border-darcare-gold/20">
                    <div className="flex p-3">
                      <div className="w-20 h-20 rounded-md overflow-hidden mr-3 flex-shrink-0">
                        <img 
                          src={item.image_url || '/placeholder.svg'} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-darcare-white font-medium">{item.name}</h4>
                          <button 
                            className="text-darcare-beige/70 hover:text-red-400"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <p className="text-darcare-gold text-sm mb-2">
                          ${item.price.toFixed(2)}
                        </p>
                        
                        <div className="flex items-center">
                          <button
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-darcare-navy border border-darcare-gold/30 text-darcare-gold"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <span className="mx-3 text-darcare-beige">
                            {item.quantity}
                          </span>
                          
                          <button
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-darcare-navy border border-darcare-gold/30 text-darcare-gold"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          
                          <span className="ml-auto text-darcare-beige">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 border-t border-darcare-gold/20 pt-4">
                <div className="flex justify-between text-darcare-beige mb-1">
                  <span>Subtotal</span>
                  <span>${getTotalCartPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-darcare-beige mb-1">
                  <span>Tax</span>
                  <span>${(getTotalCartPrice() * 0.07).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-darcare-white font-medium mt-3">
                  <span>Total</span>
                  <span>${(getTotalCartPrice() * 1.07).toFixed(2)}</span>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <IconButton
                    icon={<CreditCard className="w-5 h-5" />}
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      
      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="bg-darcare-navy border border-darcare-gold/20 text-darcare-beige sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-darcare-gold font-serif">Complete Your Order</DialogTitle>
            <DialogDescription className="text-darcare-beige">
              Your items will be charged to your room and delivered promptly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-3">
            <div className="border-b border-darcare-gold/10 pb-3">
              <h4 className="text-darcare-white font-medium mb-2">Order Summary</h4>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between font-medium">
              <span>Total with Tax</span>
              <span className="text-darcare-gold">${(getTotalCartPrice() * 1.07).toFixed(2)}</span>
            </div>
          </div>
          
          <DialogFooter className="flex justify-center sm:justify-center mt-4">
            <IconButton
              icon={<ChevronLeft className="w-5 h-5" />}
              variant="secondary"
              onClick={() => {
                setCheckoutOpen(false);
                setCartOpen(true);
              }}
            />
            <IconButton
              icon={<ChevronRight className="w-5 h-5" />}
              variant="primary"
              onClick={handleCheckout}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopService;
