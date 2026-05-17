import { useState } from 'react';
import type { DrawnCard, TarotCardData } from '../types/tarot';

interface TarotCardProps {
  drawnCard?: DrawnCard;
  previewCard?: TarotCardData;
  onReveal?: () => void;
  onSelect?: () => void;
  compact?: boolean;
  resultCompact?: boolean;
  showBackOnly?: boolean;
  isSelected?: boolean;
  selectionOrder?: number;
  disabled?: boolean;
}

export function TarotCard({
  drawnCard,
  previewCard,
  onReveal,
  onSelect,
  compact = false,
  resultCompact = false,
  showBackOnly = false,
  isSelected = false,
  selectionOrder,
  disabled = false,
}: TarotCardProps) {
  const [imageVisible, setImageVisible] = useState(false);
  const card = drawnCard?.card ?? previewCard;
  const isRevealed = drawnCard?.isRevealed ?? false;
  const isReversed = drawnCard?.orientation === 'reversed';
  const isInteractive = Boolean(onReveal || onSelect);

  if (!card) return null;

  const handleClick = () => {
    if (disabled) return;
    if (onSelect) {
      onSelect();
      return;
    }
    onReveal?.();
  };

  const showFront = !showBackOnly && (!drawnCard || isRevealed);
  const cardWidth = resultCompact ? 'max-w-[150px]' : compact ? 'max-w-[128px]' : 'max-w-[238px]';

  return (
    <article className={`${compact ? 'w-full' : 'w-full'} ${isSelected ? 'selected-card-wrap' : ''}`}>
      {drawnCard && (
        <p className="mb-2 text-center text-xs font-medium text-[var(--color-muted)]">
          {drawnCard.position.index}. {drawnCard.position.name}
        </p>
      )}

      <button
        type="button"
        data-testid={showBackOnly ? 'selectable-card' : drawnCard ? 'reading-card' : 'deck-card'}
        className={`card-3d group relative mx-auto block aspect-[2/3] w-full overflow-hidden rounded-lg border border-[rgb(var(--color-line-rgb)/0.7)] shadow-2xl ${cardWidth} ${
          isSelected ? 'is-selected' : ''
        } ${disabled ? 'cursor-default opacity-70' : ''}`}
        onClick={handleClick}
        disabled={!isInteractive || disabled || (drawnCard && isRevealed)}
        aria-label={isSelected ? `${card.nameCn} 已选中，第 ${selectionOrder} 张` : showFront ? card.nameCn : `选择 ${card.nameCn}`}
      >
        {isSelected && (
          <>
            <span className="selection-aura" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            {selectionOrder && (
              <span className="selection-order-badge" aria-hidden="true">
                {selectionOrder}
              </span>
            )}
          </>
        )}

        <span className={`card-inner ${showFront ? 'is-flipped' : ''}`}>
          <span className="card-face card-back">
            <span className="absolute inset-3 rounded-md border border-[rgb(var(--color-accent-rgb)/0.36)]" />
            <span className="absolute inset-x-7 top-8 h-px bg-[rgb(var(--color-accent-rgb)/0.5)]" />
            <span className="absolute inset-x-7 bottom-8 h-px bg-[rgb(var(--color-accent-rgb)/0.5)]" />
            <span className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgb(var(--color-accent-rgb)/0.46)]" />
            <span className="grid h-full place-items-center">
              <span className="font-display text-4xl text-[var(--color-accent)]">✦</span>
            </span>
          </span>

          <span className="card-face card-front">
            <span className={`flex h-full flex-col bg-[rgb(var(--color-panel-rgb)/0.96)] p-2 ${isReversed ? 'rotate-180' : ''}`}>
              <span className="relative mb-2 grid flex-1 place-items-center overflow-hidden rounded-md bg-card-art">
                {/* 优先展示牌面图片；图片缺失时保留渐变兜底，页面不会报错。 */}
                {card.imagePath && (
                  <img
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                      imageVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                    src={card.imagePath}
                    alt={`${card.nameCn} 塔罗牌面`}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setImageVisible(true)}
                    onError={() => setImageVisible(false)}
                  />
                )}
                {!imageVisible && (
                  <span className="relative z-10 px-2 text-center font-display text-2xl text-[var(--color-card-ink)]">
                    {card.nameCn}
                  </span>
                )}
              </span>
              <span className="block min-h-12 text-center">
                <span className="block truncate font-display text-sm font-semibold sm:text-base">{card.nameCn}</span>
                <span className="mt-1 block truncate text-[10px] text-[var(--color-muted)] sm:text-xs">{card.nameEn}</span>
              </span>
            </span>
          </span>
        </span>
      </button>

      {drawnCard && isRevealed && (
        <div className="mt-3 rounded-lg border border-[rgb(var(--color-line-rgb)/0.62)] bg-[rgb(var(--color-panel-rgb)/0.72)] p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-[var(--color-accent)]">
                {drawnCard.position.index}. {drawnCard.position.name}
              </p>
              <h3 className="mt-1 font-display text-base font-semibold">{card.nameCn}</h3>
              <p className="text-xs text-[var(--color-muted)]">{card.nameEn}</p>
            </div>
            <span className="shrink-0 rounded-full bg-[rgb(var(--color-accent-rgb)/0.14)] px-2.5 py-1 text-xs text-[var(--color-accent)]">
              {isReversed ? '逆位' : '正位'}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text)]">
            {isReversed ? card.reversedMeaning : card.uprightMeaning}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{drawnCard.position.description}</p>
        </div>
      )}
    </article>
  );
}
