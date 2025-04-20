
export const RECOMMENDATION_CATEGORIES = [
  'dining',
  'wellness',
  'entertainment',
  'shopping',
  'culture',
  'other'
] as const;

export type RecommendationCategory = typeof RECOMMENDATION_CATEGORIES[number];
