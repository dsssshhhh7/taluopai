import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Sparkles } from 'lucide-react';
import { TarotCard } from './TarotCard';
import type { DrawnCard, TarotCardData } from '../types/tarot';

interface CardCarouselProps {
  deck: TarotCardData[];
  selectedCards: DrawnCard[];
  requiredCount: number;
  isActive: boolean;
  isShuffling: boolean;
  onDraw: (card: TarotCardData) => void;
}

const visibleRadius = 5;
const wheelSpeed = 0.00168;
const cardStep = 128;

export function CardCarousel({
  deck,
  selectedCards,
  requiredCount,
  isActive,
  isShuffling,
  onDraw,
}: CardCarouselProps) {
  const [wheelPosition, setWheelPosition] = useState(0);
  const [drawPulseId, setDrawPulseId] = useState(0);
  const [latestCardRevealed, setLatestCardRevealed] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const selectedIds = useMemo(() => new Set(selectedCards.map((item) => item.card.id)), [selectedCards]);
  const availableCards = useMemo(() => deck.filter((card) => !selectedIds.has(card.id)), [deck, selectedIds]);
  const latestDrawnCard = selectedCards[selectedCards.length - 1];
  const progressText = `${selectedCards.length} / ${requiredCount}`;
  const isComplete = selectedCards.length >= requiredCount;

  useEffect(() => {
    if (!latestDrawnCard) return;

    setLatestCardRevealed(false);
    const revealTimer = window.setTimeout(() => setLatestCardRevealed(true), 260);

    return () => window.clearTimeout(revealTimer);
  }, [latestDrawnCard]);

  useEffect(() => {
    if (!isActive || isComplete || availableCards.length === 0) {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const tick = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const nextPosition = (timestamp - startTimeRef.current) * wheelSpeed;
      setWheelPosition(nextPosition);
      animationRef.current = window.requestAnimationFrame(tick);
    };

    animationRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = null;
    };
  }, [availableCards.length, isActive, isComplete]);

  const centerIndex = availableCards.length > 0 ? Math.floor(wheelPosition) % availableCards.length : 0;
  const flowProgress = wheelPosition - Math.floor(wheelPosition);

  const visibleCards = useMemo(() => {
    if (availableCards.length === 0) return [];

    return Array.from({ length: visibleRadius * 2 + 1 }, (_, offset) => {
      const relative = offset - visibleRadius;
      const index = (centerIndex + relative + availableCards.length) % availableCards.length;

      return {
        card: availableCards[index],
        relative,
      };
    });
  }, [availableCards, centerIndex]);

  const handleDraw = () => {
    const currentCard = availableCards[centerIndex];
    if (!currentCard || !isActive || isComplete || isShuffling) return;

    setDrawPulseId((value) => value + 1);
    onDraw(currentCard);
  };

  return (
    <section className="carousel-shell mt-10">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-display text-2xl font-semibold">
            {isActive ? '命运牌流正在流动' : '命运牌流'}
          </h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {isActive
              ? `当你感觉时机到了，点击抽取此刻的牌。已抽取 ${progressText}。`
              : '输入问题并开始洗牌后，牌背会在中央选牌区缓慢流动。'}
          </p>
        </div>
        <span className="text-sm text-[var(--color-muted)]">剩余 {availableCards.length} / 78</span>
      </div>

      <div className={`fate-stream ${isActive ? 'is-running' : ''} ${isShuffling ? 'is-shuffling' : ''}`}>
        <div className="fate-center-zone" aria-hidden="true">
          <span className="magic-ring" />
          <span className="magic-ring magic-ring-inner" />
        </div>
        {drawPulseId > 0 && (
          <div key={drawPulseId} className="hexagram-burst" aria-hidden="true">
            <span className="hexagram-star" />
            <span className="hexagram-orbit" />
            <span className="hexagram-spark spark-1" />
            <span className="hexagram-spark spark-2" />
            <span className="hexagram-spark spark-3" />
            <span className="hexagram-spark spark-4" />
            <span className="hexagram-spark spark-5" />
            <span className="hexagram-spark spark-6" />
          </div>
        )}

        <div className="fate-track" aria-label="命运牌流">
          {visibleCards.map(({ card, relative }) => {
            const flowOffset = relative - flowProgress;
            const distanceFromCenter = Math.abs(flowOffset);
            const scale = 0.86 + Math.max(0, 1 - distanceFromCenter) * 0.28;

            return (
              <div
                key={card.id}
                className={`fate-card-slot ${distanceFromCenter < 0.55 ? 'is-center' : ''}`}
                style={
                  {
                    transform: `translate(-50%, -50%) translateX(${flowOffset * cardStep}px) scale(${scale})`,
                    opacity: Math.max(0.28, 1 - distanceFromCenter * 0.11),
                    zIndex: 20 - Math.round(distanceFromCenter),
                  } as CSSProperties
                }
              >
                <TarotCard previewCard={card} compact showBackOnly />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 font-semibold text-[var(--color-accent-text)] shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
          disabled={!isActive || isComplete || availableCards.length === 0 || isShuffling}
          onClick={handleDraw}
        >
          <Sparkles size={18} aria-hidden="true" />
          {isComplete ? '已抽满牌阵' : '抽取此刻的牌'}
        </button>
      </div>

      {latestDrawnCard && (
        <div key={drawPulseId} className="drawn-card-stage">
          <p className="mb-3 text-center font-display text-lg text-[var(--color-accent)]">
            第 {latestDrawnCard.position.index} 张牌已进入牌阵
          </p>
          <TarotCard drawnCard={{ ...latestDrawnCard, isRevealed: latestCardRevealed }} resultCompact={false} />
        </div>
      )}
    </section>
  );
}
