
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

export const getFallbackImage = (title: string, index: number) => {
  // Create a deterministic hash from the product name
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Use the hash to select an image, with a fallback to using the index
  return PLACEHOLDER_IMAGES[hash % PLACEHOLDER_IMAGES.length] || PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
};
