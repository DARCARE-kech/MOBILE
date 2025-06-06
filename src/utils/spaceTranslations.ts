
import { TFunction } from 'react-i18next';

// Mapping des noms d'espaces vers les clés de traduction
const spaceNameMap: Record<string, string> = {
  'Kids Club': 'spaces.kidsClub',
  'Gym': 'spaces.gym',
  'Pool': 'spaces.pool',
  'Spa': 'spaces.spa',
  'Restaurant': 'spaces.restaurant',
  'Meeting Room': 'spaces.meetingRoom',
  'Fitness Suite': 'spaces.fitnessSuite',
  'Padel Court': 'spaces.padelCourt',
  'Game Room': 'spaces.gameRoom',
  'Cinema': 'spaces.cinema',
  'Library': 'spaces.library',
  'Terrace': 'spaces.terrace',
  'Garden': 'spaces.garden',
  'Conference Room': 'spaces.conferenceRoom',
  'Business Center': 'spaces.businessCenter'
};

export const translateSpaceName = (spaceName: string | null | undefined, t: TFunction): string => {
  if (!spaceName) return '';
  
  // Chercher la clé de traduction correspondante
  const translationKey = spaceNameMap[spaceName];
  
  if (translationKey) {
    // Utiliser la traduction si elle existe
    const translated = t(translationKey);
    // Si la traduction retourne la clé (pas trouvée), utiliser le nom original
    return translated === translationKey ? spaceName : translated;
  }
  
  // Fallback vers le nom original si aucune traduction n'est définie
  return spaceName;
};
