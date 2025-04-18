
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1466442929976-97f336a657be",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
  "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
  "https://images.unsplash.com/photo-1500673922987-e212871fec22",
];

export const getFallbackImage = (title: string, index: number) => {
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PLACEHOLDER_IMAGES[hash % PLACEHOLDER_IMAGES.length] || PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
};
