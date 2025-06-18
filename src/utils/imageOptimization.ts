
interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  resize?: 'cover' | 'contain' | 'fill';
}

/**
 * Optimise une image Supabase Storage pour les appareils mobiles
 */
export const optimizeImageForMobile = (
  imageUrl: string | null | undefined,
  options: ImageOptimizationOptions = {}
): string => {
  if (!imageUrl) return '';
  
  const {
    width = 300,
    height = 300,
    quality = 75,
    format = 'webp',
    resize = 'cover'
  } = options;
  
  // Vérifier si c'est une image Supabase Storage
  const supabaseStoragePattern = /https:\/\/[^\/]+\.supabase\.co\/storage\/v1\/object\/public\//;
  
  if (supabaseStoragePattern.test(imageUrl)) {
    // Appliquer les transformations Supabase
    const separator = imageUrl.includes('?') ? '&' : '?';
    const transformations = [
      `width=${width}`,
      `height=${height}`,
      `resize=${resize}`,
      `format=${format}`,
      `quality=${quality}`
    ].join('&');
    
    return `${imageUrl}${separator}${transformations}`;
  }
  
  // Pour les images Unsplash (fallback), appliquer des paramètres similaires
  if (imageUrl.includes('unsplash.com')) {
    const url = new URL(imageUrl);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('h', height.toString());
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('fm', format);
    return url.toString();
  }
  
  // Retourner l'URL originale si aucune optimisation n'est possible
  return imageUrl;
};

/**
 * Obtient différentes tailles d'images selon l'appareil
 */
export const getResponsiveImageSizes = (baseImageUrl: string | null | undefined) => {
  return {
    mobile: optimizeImageForMobile(baseImageUrl, { width: 300, height: 300, quality: 75 }),
    tablet: optimizeImageForMobile(baseImageUrl, { width: 350, height: 350, quality: 80 }),
    desktop: optimizeImageForMobile(baseImageUrl, { width: 400, height: 400, quality: 85 })
  };
};
