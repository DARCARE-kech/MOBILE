
export const RECOMMENDATION_CATEGORIES = [
  'restaurant',
  'spa',
  'activity',
  'attraction',
  'experience',
  'excursion'
] as const;

export type RecommendationCategory = typeof RECOMMENDATION_CATEGORIES[number];

export function isValidCategory(category: string | null | undefined): category is RecommendationCategory {
  if (!category) return false;
  return (RECOMMENDATION_CATEGORIES as readonly string[]).includes(category);
}
