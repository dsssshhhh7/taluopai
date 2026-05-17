import { ReadingSummary } from './ReadingSummary';
import { SpreadLayout } from './SpreadLayout';
import type { DrawnCard, SpreadConfig } from '../types/tarot';

interface ReadingResultProps {
  cards: DrawnCard[];
  spread: SpreadConfig;
  question: string;
  guideText: string;
  onReveal: (index: number) => void;
}

export function ReadingResult({ cards, spread, question, guideText, onReveal }: ReadingResultProps) {
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

      <SpreadLayout cards={cards} spread={spread} onReveal={onReveal} />
      <div id="reading-summary">
        <ReadingSummary question={question} spread={spread} cards={cards} />
      </div>
    </section>
  );
}
