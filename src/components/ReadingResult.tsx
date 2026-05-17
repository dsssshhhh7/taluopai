import { TarotCard } from './TarotCard';
import type { DrawnCard, SpreadType } from '../types/tarot';

interface ReadingResultProps {
  cards: DrawnCard[];
  spreadId: SpreadType;
  guideText: string;
  onReveal: (index: number) => void;
}

const layoutClass: Record<SpreadType, string> = {
  single: 'grid-cols-1 max-w-md',
  three: 'grid-cols-1 sm:grid-cols-3 max-w-5xl',
  hexagram: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl',
};

export function ReadingResult({ cards, spreadId, guideText, onReveal }: ReadingResultProps) {
  if (cards.length === 0) return null;

  const allRevealed = cards.every((item) => item.isRevealed);

  return (
    <section className="mt-10">
      <div className="mb-7 text-center">
        <p className="font-display text-xl text-[var(--color-accent)]">{guideText}</p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          {allRevealed ? '牌面已经展开。' : '点击卡背，慢慢翻开你的牌。'}
        </p>
      </div>

      <div className={`mx-auto grid gap-6 ${layoutClass[spreadId]}`}>
        {cards.map((drawnCard, index) => (
          <TarotCard
            key={`${drawnCard.card.id}-${drawnCard.position}`}
            drawnCard={drawnCard}
            onReveal={() => onReveal(index)}
          />
        ))}
      </div>
    </section>
  );
}
