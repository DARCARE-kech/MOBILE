
import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="overflow-x-auto scrollbar-hide pb-2">
      <div className="flex space-x-2 px-4 w-max min-w-full">
        <button
          key="all"
          onClick={() => onSelectCategory('')}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            selectedCategory === ''
              ? "bg-darcare-gold text-darcare-navy"
              : "bg-darcare-navy border border-darcare-gold/30 text-darcare-beige hover:border-darcare-gold/50"
          )}
        >
          {t('shop.allProducts')}
        </button>
        
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              selectedCategory === category
                ? "bg-darcare-gold text-darcare-navy"
                : "bg-darcare-navy border border-darcare-gold/30 text-darcare-beige hover:border-darcare-gold/50"
            )}
          >
            {t(`shop.categories.${category.toLowerCase()}`) || category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
