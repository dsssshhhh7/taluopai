export type TarotType = 'major' | 'minor';
export type Orientation = 'upright' | 'reversed';
export type SpreadType = 'single' | 'three' | 'hexagram';
export type ThemeName = 'classic' | 'starry' | 'minimal';

export interface TarotCardData {
  id: string;
  nameCn: string;
  nameEn: string;
  type: TarotType;
  uprightMeaning: string;
  reversedMeaning: string;
  description: string;
  imagePath: string;
}

export interface DrawnCard {
  card: TarotCardData;
  orientation: Orientation;
  position: string;
  isRevealed: boolean;
}

export interface SpreadConfig {
  id: SpreadType;
  name: string;
  description: string;
  positions: string[];
}
