
import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import { RecommendationsList as ExploreRecommendationsList } from "@/components/explore/RecommendationsList";
import { SearchBar } from "@/components/explore/SearchBar";
import { FiltersBar } from "@/components/explore/FiltersBar";
import { useTranslation } from "react-i18next";
import FloatingAction from "@/components/FloatingAction";
import { type RecommendationCategory } from "@/utils/recommendationCategories";
import ShopButton from "@/components/shop/ShopButton";

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"rating" | "distance">("rating");
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title={t('navigation.explore')}
      />
      
      <div className="pt-16 pb-24 space-y-4">
        <div className="p-4">
          <div className="luxury-card">
            <div className="flex items-center gap-2">
              <SearchBar onSearch={setSearchQuery} />
              <FiltersBar 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </div>
        </div>
        
        <ExploreRecommendationsList 
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
        />
      </div>
      
      <ShopButton />
      <FloatingAction />
      <BottomNavigation activeTab="explore" />
    </div>
  );
};

export default ExplorePage;
