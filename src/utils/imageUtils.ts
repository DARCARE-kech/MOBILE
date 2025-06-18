const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1564421063420-727fc89e4000?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1583251633146-d0c6c036187d?auto=format&fit=crop&q=80",
];

/**
 * Optimise une image pour l'affichage mobile
 */
export const optimizeImageForMobile = (
  imageUrl: string | null | undefined,
  options: {
    width?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): string => {
  if (!imageUrl) return '';

  const width = options.width || 320;
  const height = Math.round((width * 9) / 16);  // Calcul du 16/9
  const quality = options.quality || 80;
  const format = options.format || 'webp';

  // Vérifier si c'est une image Supabase Storage
  if (imageUrl.includes('supabase.co/storage/v1/object/public/')) {
    const separator = imageUrl.includes('?') ? '&' : '?';
    const transformations = `width=${width}&height=${height}&resize=fill&fit=crop&format=${format}&quality=${quality}`;
    return `${imageUrl}${separator}${transformations}`;
  }

  // Pour les images Unsplash
  if (imageUrl.includes('unsplash.com')) {
    const url = new URL(imageUrl);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('h', height.toString());
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('fm', format);
    return url.toString();
  }

  return imageUrl;
};


export const getFallbackImage = (title: string, index: number) => {
  // Create a deterministic hash from the product name
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Use the hash to select an image, with a fallback to using the index
  const baseImage = PLACEHOLDER_IMAGES[hash % PLACEHOLDER_IMAGES.length] || PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
  
  // Optimiser l'image de fallback pour mobile
  return optimizeImageForMobile(baseImage, { width: 320, quality: 80 });

};
