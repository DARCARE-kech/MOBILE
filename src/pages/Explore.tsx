
import React from 'react';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';

const ExplorePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title="Explore" />
      
      <div className="p-4 pb-24">
        <div className="luxury-card">
          <h2 className="text-xl font-serif text-darcare-gold mb-3">Discover</h2>
          <p className="text-darcare-beige">
            Explore local attractions, dining options, and exclusive experiences.
          </p>
        </div>
      </div>
      
      <BottomNavigation activeTab="explore" />
    </div>
  );
};

export default ExplorePage;
