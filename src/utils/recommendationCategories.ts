
export const RECOMMENDATION_CATEGORIES = [
  'restaurant',
  'spa',
  'activity',
  'attraction',
  'experience',
  'excursion',
  'dining',
  'events',
  'shopping',
  'culture',
  'other'
] as const;

export type RecommendationCategory = typeof RECOMMENDATION_CATEGORIES[number];

export function isValidCategory(category: string | null | undefined): category is RecommendationCategory {
  if (!category) return false;
  return (RECOMMENDATION_CATEGORIES as readonly string[]).includes(category.toLowerCase());
}

export function getCategoryTranslationKey(category: string | null | undefined): string {
  if (!category) return 'other';
  
  const normalizedCategory = category.toLowerCase();
  
  // Check if it's a valid category
  if ((RECOMMENDATION_CATEGORIES as readonly string[]).includes(normalizedCategory)) {
    return normalizedCategory;
  }
  
  // Return 'other' as fallback
  return 'other';
}
