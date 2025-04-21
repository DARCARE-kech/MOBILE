
export const RECOMMENDATION_CATEGORIES = [
  'restaurant',
  'spa',
  'activity',
  'attraction',
  'experience',
  'excursion'
] as const;

export type RecommendationCategory = typeof RECOMMENDATION_CATEGORIES[number];

// Helper function to validate if a string is a valid category
export function isValidCategory(category: string | null | undefined): category is RecommendationCategory {
  if (!category) return false;
  return RECOMMENDATION_CATEGORIES.includes(category as RecommendationCategory);
}
