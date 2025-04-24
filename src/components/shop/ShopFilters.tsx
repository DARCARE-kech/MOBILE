
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface ShopFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
}

const ShopFilters = ({ 
  categories = [], 
  selectedCategory, 
  onCategoryChange,
  onSearchChange 
}: ShopFiltersProps) => {
  const { t } = useTranslation();

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-darcare-beige/50" />
        <Input
          placeholder={t('shop.searchProducts', 'Search products')}
          className="pl-9 bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige placeholder:text-darcare-beige/50"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
            selectedCategory === null
              ? 'bg-darcare-gold text-darcare-navy'
              : 'bg-darcare-navy/60 text-darcare-beige border border-darcare-gold/20'
          }`}
          onClick={() => onCategoryChange(null)}
        >
          {t('shop.allProducts', 'All Products')}
        </button>
        
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-darcare-gold text-darcare-navy'
                : 'bg-darcare-navy/60 text-darcare-beige border border-darcare-gold/20'
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShopFilters;
