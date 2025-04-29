
import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import { RecommendationsList } from "@/components/explore/RecommendationsList";
import { SearchBar } from "@/components/explore/SearchBar";
import { FiltersBar } from "@/components/explore/FiltersBar";
import { useTranslation } from "react-i18next";
import FloatingAction from "@/components/FloatingAction";

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"rating" | "distance">("rating");
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-darcare-navy">
      <AppHeader title={t('navigation.explore')} />
      
      <div className="pt-16 pb-24 space-y-4">
        <div className="p-4">
          <div className="luxury-card">
            <SearchBar onSearch={setSearchQuery} />
            <FiltersBar 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>
        
        <RecommendationsList 
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
        />
      </div>
      
      <FloatingAction />
      <BottomNavigation activeTab="explore" />
    </div>
  );
};

export default ExplorePage;
