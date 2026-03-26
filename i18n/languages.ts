export type Language = 'en' | 'tr' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const languages: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: 'us', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: 'tr', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: 'es', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: 'fr', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: 'de', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: 'it', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: 'pt', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: 'ru', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: 'cn', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: 'jp', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: 'kr', dir: 'ltr' },
];

const languageMap = new Map<Language, LanguageConfig>(languages.map((l) => [l.code, l]));

const browserAliases: Record<string, Language> = {
  en: 'en', tr: 'tr', es: 'es', fr: 'fr', de: 'de',
  it: 'it', pt: 'pt', ru: 'ru', zh: 'zh', ja: 'ja', ko: 'ko',
};

export function normalizeLanguageCode(input: string): Language {
  const base = input.trim().toLowerCase().split('-')[0];
  return browserAliases[base] || 'en';
}

export function getLanguageConfig(code: string): LanguageConfig {
  const normalized = normalizeLanguageCode(code);
  return languageMap.get(normalized) || languageMap.get('en')!;
}

export function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en';
  return normalizeLanguageCode(navigator.language || 'en');
}
