import { WandSparkles } from 'lucide-react';

interface QuestionInputProps {
  value: string;
  isShuffling: boolean;
  onChange: (value: string) => void;
  onStart: () => void;
}

export function QuestionInput({ value, isShuffling, onChange, onStart }: QuestionInputProps) {
  const canStart = value.trim().length > 0 && !isShuffling;

  return (
    <section className="ritual-panel mt-8 rounded-lg border border-[rgb(var(--color-line-rgb)/0.66)] bg-[rgb(var(--color-panel-rgb)/0.68)] p-5 sm:p-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-display text-2xl font-semibold text-[var(--color-text)]">
          静下心来，在心中默念你的问题
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            className="min-h-12 flex-1 rounded-full border border-[rgb(var(--color-line-rgb)/0.68)] bg-[rgb(var(--color-soft-rgb)/0.48)] px-5 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[rgb(var(--color-accent-rgb)/0.9)] focus:shadow-glow"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="例如：我和 ta 后续会如何发展？"
          />
          <button
            type="button"
            data-testid="start-selecting-button"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 font-semibold text-[var(--color-accent-text)] shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onStart}
            disabled={!canStart}
          >
            <WandSparkles size={18} aria-hidden="true" />
            开始洗牌
          </button>
        </div>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          输入问题后再开始抽牌，牌阵会围绕这一次提问展开。
        </p>
      </div>
    </section>
  );
}
