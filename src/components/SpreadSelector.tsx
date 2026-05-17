import { CircleDot, Gem, Triangle } from 'lucide-react';
import type { SpreadConfig, SpreadType } from '../types/tarot';

interface SpreadSelectorProps {
  spreads: SpreadConfig[];
  selectedSpreadId: SpreadType;
  onSelect: (spreadId: SpreadType) => void;
}

const iconMap = {
  single: CircleDot,
  three: Triangle,
  hexagram: Gem,
};

export function SpreadSelector({ spreads, selectedSpreadId, onSelect }: SpreadSelectorProps) {
  return (
    <section className="grid gap-3 md:grid-cols-3" aria-label="牌阵选择">
      {spreads.map((spread) => {
        const Icon = iconMap[spread.id];
        const isActive = selectedSpreadId === spread.id;

        return (
          <button
            key={spread.id}
            type="button"
            className={`group min-h-32 rounded-lg border p-4 text-left transition ${
              isActive
                ? 'border-[rgb(var(--color-accent-rgb)/0.9)] bg-[rgb(var(--color-accent-rgb)/0.14)] shadow-glow'
                : 'border-[rgb(var(--color-line-rgb)/0.65)] bg-[rgb(var(--color-panel-rgb)/0.6)] hover:border-[rgb(var(--color-accent-rgb)/0.55)]'
            }`}
            onClick={() => onSelect(spread.id)}
          >
            <div className="mb-3 flex items-center justify-between">
              <Icon className={isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]'} size={22} />
              <span className="text-xs text-[var(--color-muted)]">{spread.positions.length} 张</span>
            </div>
            <h2 className="font-display text-lg font-semibold">{spread.name}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{spread.description}</p>
          </button>
        );
      })}
    </section>
  );
}
