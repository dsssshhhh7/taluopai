import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ThemeName } from '../types/tarot';

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const themeLabels: Record<ThemeName, string> = {
  classic: '古风',
  starry: '星空',
  minimal: '简约',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>('classic');

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme-${theme} min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme 必须在 ThemeProvider 内使用');
  }

  return context;
}
