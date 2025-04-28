import { createContext, useContext } from 'react';
import { ThemeConfig } from 'antd/es/config-provider/context';

export type ThemeMode = 'dark' | 'light';

export const ThemeContext = createContext<{
  themeData: Partial<ThemeConfig>;
  themeMode: ThemeMode;
  toggleTheme: () => void;
} | null>(null);

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return ctx;
};
