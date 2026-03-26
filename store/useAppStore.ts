import { create } from 'zustand';
import type { Language } from '@/i18n/languages';
import { getLanguageConfig, detectBrowserLanguage } from '@/i18n/languages';

function getSavedLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem('language');
  if (saved) return getLanguageConfig(saved).code;
  return detectBrowserLanguage();
}

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: (typeof window !== 'undefined' && localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  toggleTheme: () => set((state) => {
    const next = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    return { theme: next };
  }),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },
  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
  language: getSavedLanguage(),
  setLanguage: (lang) => {
    localStorage.setItem('language', lang);
    const config = getLanguageConfig(lang);
    document.documentElement.dir = config.dir;
    document.documentElement.lang = config.code;
    set({ language: config.code });
  },
  soundEnabled: typeof window !== 'undefined' ? localStorage.getItem('sound') !== 'off' : true,
  toggleSound: () => set((state) => {
    const next = !state.soundEnabled;
    localStorage.setItem('sound', next ? 'on' : 'off');
    return { soundEnabled: next };
  }),
}));
