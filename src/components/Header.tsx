import { Moon, Sparkles } from 'lucide-react';
import { themeLabels, useTheme } from './ThemeProvider';
import type { ThemeName } from '../types/tarot';

const themes = Object.keys(themeLabels) as ThemeName[];

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-[rgb(var(--color-line-rgb)/0.6)] bg-[rgb(var(--color-panel-rgb)/0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full border border-[rgb(var(--color-accent-rgb)/0.42)] bg-[rgb(var(--color-accent-rgb)/0.12)] shadow-glow">
            <Sparkles size={22} aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-normal sm:text-3xl">命运塔罗</h1>
            <p className="text-xs text-[var(--color-muted)]">Tarot of Inner Direction</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-full border border-[rgb(var(--color-line-rgb)/0.76)] bg-[rgb(var(--color-soft-rgb)/0.62)] p-1">
            {themes.map((item) => (
              <button
                key={item}
                type="button"
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  theme === item
                    ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)] shadow-glow'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                }`}
                onClick={() => setTheme(item)}
              >
                {themeLabels[item]}
              </button>
            ))}
          </div>

          <Moon className="hidden text-[var(--color-muted)] sm:block" size={18} aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
