export type TarotType = 'major' | 'minor';
export type Orientation = 'upright' | 'reversed';

export type SpreadType =
  | 'single'
  | 'universal'
  | 'core-solution'
  | 'choice'
  | 'grand-cross'
  | 'hexagram'
  | 'inspiration'
  | 'celtic-cross';

export type SpreadLayoutType =
  | 'single'
  | 'three'
  | 'core'
  | 'choice'
  | 'cross'
  | 'hexagram'
  | 'inspiration'
  | 'celtic';

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

export interface SpreadPosition {
  index: number;
  name: string;
  description: string;
}

export interface DrawnCard {
  card: TarotCardData;
  orientation: Orientation;
  position: SpreadPosition;
  isRevealed: boolean;
}

export interface SpreadConfig {
  id: SpreadType;
  name: string;
  cardCount: number;
  description: string;
  suitableFor: string;
  examples: string[];
  positions: SpreadPosition[];
  layout: SpreadLayoutType;
  modes?: string[];
}
