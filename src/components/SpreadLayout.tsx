import { TarotCard } from './TarotCard';
import type { DrawnCard, SpreadConfig } from '../types/tarot';

interface SpreadLayoutProps {
  cards: DrawnCard[];
  spread: SpreadConfig;
  onReveal: (index: number) => void;
}

const placementClass: Record<SpreadConfig['layout'], string[]> = {
  single: ['spread-center'],
  three: ['spread-three-1', 'spread-three-2', 'spread-three-3'],
  core: ['core-1', 'core-2', 'core-3', 'core-4'],
  choice: ['choice-1', 'choice-2', 'choice-3', 'choice-4', 'choice-5'],
  cross: ['cross-1', 'cross-2', 'cross-3', 'cross-4', 'cross-5'],
  hexagram: ['hex-1', 'hex-2', 'hex-3', 'hex-4', 'hex-5', 'hex-6', 'hex-7'],
  inspiration: ['insp-1', 'insp-2', 'insp-3', 'insp-4', 'insp-5', 'insp-6', 'insp-7'],
  celtic: ['celtic-1', 'celtic-2', 'celtic-3', 'celtic-4', 'celtic-5', 'celtic-6', 'celtic-7', 'celtic-8', 'celtic-9', 'celtic-10'],
};

export function SpreadLayout({ cards, spread, onReveal }: SpreadLayoutProps) {
  return (
    <div className={`spread-board spread-board-${spread.layout}`} aria-label={`${spread.name}结果布局`}>
      {cards.map((drawnCard, index) => (
        <div
          key={`${drawnCard.card.id}-${drawnCard.position.index}`}
          className={`spread-slot ${placementClass[spread.layout][index]}`}
        >
          <TarotCard drawnCard={drawnCard} resultCompact={spread.cardCount >= 7} onReveal={() => onReveal(index)} />
        </div>
      ))}
    </div>
  );
}
