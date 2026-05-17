import { Blocks, CircleDot, GitBranch, Gem, LayoutGrid, Scale, Sparkles, Triangle } from 'lucide-react';
import type { SpreadConfig, SpreadType } from '../types/tarot';

interface SpreadSelectorProps {
  spreads: SpreadConfig[];
  selectedSpreadId: SpreadType;
  onSelect: (spreadId: SpreadType) => void;
}

const iconMap = {
  single: CircleDot,
  universal: Triangle,
  'core-solution': Sparkles,
  choice: GitBranch,
  'grand-cross': Scale,
  hexagram: Gem,
  inspiration: Blocks,
  'celtic-cross': LayoutGrid,
};

export function SpreadSelector({ spreads, selectedSpreadId, onSelect }: SpreadSelectorProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="牌阵选择">
      {spreads.map((spread) => {
        const Icon = iconMap[spread.id];
        const isActive = selectedSpreadId === spread.id;

        return (
          <button
            key={spread.id}
            type="button"
            className={`group min-h-44 rounded-lg border p-4 text-left transition ${
              isActive
                ? 'border-[rgb(var(--color-accent-rgb)/0.9)] bg-[rgb(var(--color-accent-rgb)/0.14)] shadow-glow'
                : 'border-[rgb(var(--color-line-rgb)/0.65)] bg-[rgb(var(--color-panel-rgb)/0.6)] hover:border-[rgb(var(--color-accent-rgb)/0.55)]'
            }`}
            onClick={() => onSelect(spread.id)}
          >
            <div className="mb-3 flex items-center justify-between">
              <Icon className={isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]'} size={22} />
              <span className="rounded-full bg-[rgb(var(--color-soft-rgb)/0.72)] px-2.5 py-1 text-xs text-[var(--color-muted)]">
                {spread.cardCount} 张
              </span>
            </div>
            <h2 className="font-display text-lg font-semibold">{spread.name}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--color-muted)]">{spread.description}</p>
            <p className="mt-3 text-xs leading-5 text-[var(--color-accent)]">适合：{spread.suitableFor}</p>
          </button>
        );
      })}
    </section>
  );
}
