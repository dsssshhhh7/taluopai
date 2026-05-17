import { Copy } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DrawnCard, SpreadConfig } from '../types/tarot';

interface ReadingSummaryProps {
  question: string;
  spread: SpreadConfig;
  cards: DrawnCard[];
}

const orientationText = (card: DrawnCard) => (card.orientation === 'upright' ? '正位' : '逆位');

export function ReadingSummary({ question, spread, cards }: ReadingSummaryProps) {
  const [copied, setCopied] = useState(false);

  const copyText = useMemo(() => {
    const cardLines = cards
      .map(
        (item) =>
          `${item.position.index}. ${item.position.name}\n   ${item.card.nameCn}（${orientationText(item)}）`,
      )
      .join('\n\n');

    return `【塔罗抽牌结果】\n\n问题：\n${question}\n\n牌阵：\n${spread.name}\n\n${cardLines}`;
  }, [cards, question, spread.name]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = copyText;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <section className="reading-summary mx-auto mt-10 max-w-5xl rounded-lg border border-[rgb(var(--color-line-rgb)/0.66)] bg-[rgb(var(--color-panel-rgb)/0.72)] p-5 sm:p-6">
      <div className="text-center">
        <p className="font-display text-2xl font-semibold text-[var(--color-accent)]">本次抽牌结果</p>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">问题：{question}</p>
        <p className="text-sm leading-6 text-[var(--color-muted)]">牌阵：{spread.name}</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((item) => {
          const isUpright = item.orientation === 'upright';

          return (
            <article
              key={`${item.card.id}-${item.position.index}`}
              className={`summary-card rounded-lg border p-4 ${
                isUpright
                  ? 'border-[rgb(var(--color-accent-rgb)/0.62)] bg-[rgb(var(--color-accent-rgb)/0.12)]'
                  : 'border-[rgb(var(--color-line-rgb)/0.62)] bg-[rgb(var(--color-soft-rgb)/0.56)]'
              }`}
            >
              <p className="text-xs text-[var(--color-muted)]">
                {item.position.index}. {item.position.name}
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="font-display text-lg font-semibold">{item.card.nameCn}</p>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    isUpright
                      ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)]'
                      : 'bg-[rgb(var(--color-panel-rgb)/0.9)] text-[var(--color-accent)]'
                  }`}
                >
                  {orientationText(item)}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[rgb(var(--color-accent-rgb)/0.58)] px-5 text-sm font-medium text-[var(--color-text)] transition hover:bg-[rgb(var(--color-accent-rgb)/0.14)]"
          onClick={handleCopy}
        >
          <Copy size={16} aria-hidden="true" />
          {copied ? '已复制' : '复制抽牌结果'}
        </button>
      </div>
    </section>
  );
}
